"""Dyscalculia risk screening with the trained monotonic XGBoost model (notebook 13).

The model is loaded from the plain XGBoost JSON export, so it works with any XGBoost version
and does not need scikit-learn. Missing features are filled with the training medians
(the same SimpleImputer step used in Colab). Explanations are exact TreeSHAP values (pred_contribs).
"""
import json
import logging
import math
from datetime import datetime, timezone
from functools import lru_cache

import numpy as np
import xgboost as xgb

from app.services.dyscalculia import texts
from app.services.dyscalculia.config import settings
from app.services.dyscalculia.features import control_low, looks_like_guessing, summarise_trials

logger = logging.getLogger(__name__)


class ModelNotFoundError(RuntimeError):
    pass


class ScreeningService:
    def __init__(self, model_dir=settings.MODEL_DIR):
        model_path = model_dir / settings.MODEL_FILE
        meta_path = model_dir / settings.META_FILE
        if not model_path.exists() or not meta_path.exists():
            raise ModelNotFoundError(
                f'Dyscalculia model not found in {model_dir}. Put {settings.MODEL_FILE} and '
                f'{settings.META_FILE} (the Colab export of notebook 13) there.'
            )
        self.meta = json.loads(meta_path.read_text(encoding='utf-8'))
        self.features: list[str] = self.meta['features']
        self.medians: dict[str, float] = self.meta['imputer_medians']
        self.threshold: float = float(self.meta['screening_threshold'])
        self.booster = xgb.Booster()
        self.booster.load_model(str(model_path))
        self.model_name: str = self.meta.get('model', model_path.stem)
        logger.info('Dyscalculia model loaded (%s, threshold %.3f)', self.model_name, self.threshold)

    def _matrix(self, features: dict[str, float | None]) -> tuple[np.ndarray, list[str]]:
        row, imputed = [], []
        for name in self.features:
            value = features.get(name)
            if value is None or (isinstance(value, float) and math.isnan(value)):
                value = self.medians[name]
                imputed.append(name)
            row.append(float(value))
        return np.array([row], dtype=float), imputed

    def predict_features(self, features: dict[str, float | None]) -> dict:
        x, imputed = self._matrix(features)
        dm = xgb.DMatrix(x, feature_names=self.features)
        probability = float(self.booster.predict(dm)[0])
        contribs = self.booster.predict(dm, pred_contribs=True)[0]
        return {
            'probability': probability,
            'contributions': {name: float(c) for name, c in zip(self.features, contribs[:-1])},
            'base_value': float(contribs[-1]),
            'imputed': imputed,
        }

    def screen(self, trials: list[dict]) -> dict:
        features = summarise_trials(trials)
        pred = self.predict_features(features)
        at_risk = pred['probability'] >= self.threshold
        controls_low = control_low(features)
        risk_level = 'low' if not at_risk else ('general' if controls_low else 'elevated')

        # Reasons: features that pushed the risk up most (SHAP > 0), in plain Sinhala
        reasons = []
        raising = sorted(
            ((c, n) for n, c in pred['contributions'].items() if c >= settings.MIN_REASON_CONTRIBUTION),
            reverse=True,
        )
        if at_risk:
            for _, name in raising[: settings.MAX_REASONS]:
                task, kind = name.split('_')
                reasons.append(texts.low_accuracy(task) if kind == 'acc' else texts.slow_response(task))
        if at_risk and controls_low:
            reasons.append(texts.CONTROL_LOW)
        if looks_like_guessing(trials):
            reasons.append(texts.GUESSING)

        return {
            'riskLevel': risk_level,
            'riskScore': pred['probability'],
            'recommendation': {'elevated': 'stage2', 'general': 'slowLearner', 'low': 'none'}[risk_level],
            'reasons': reasons,
            'controlLow': controls_low,
            'features': features,
            'contributions': pred['contributions'],
            'imputed': pred['imputed'],
            'threshold': self.threshold,
            'source': 'model',
            'date': datetime.now(timezone.utc).isoformat(),
        }


@lru_cache(maxsize=1)
def get_screening_service() -> ScreeningService:
    """Loaded once, on first use (raises ModelNotFoundError if the model files are missing)."""
    return ScreeningService()

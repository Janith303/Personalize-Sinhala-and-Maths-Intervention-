"""Settings for the dyscalculia screening module only."""
import os
from pathlib import Path

APP_DIR = Path(__file__).resolve().parents[2]


class DyscalculiaSettings:
    # Folder with the model exported from Colab (notebook 13, monotonic XGBoost on 6 arithmetic features):
    #   xgboost_monotone_arith.json  - the XGBoost model
    #   model_meta.json              - feature order, missing-value medians and the screening threshold
    # Override with the DYSCALCULIA_MODEL_DIR environment variable if you keep it elsewhere.
    MODEL_DIR = Path(os.getenv('DYSCALCULIA_MODEL_DIR', APP_DIR / 'ml_models' / 'ML' / 'dyscalculia'))
    MODEL_FILE = 'xgboost_monotone_arith.json'
    META_FILE = 'model_meta.json'

    # A feature counts as a reason for the risk when it raises the risk by at least this much (log-odds)
    MIN_REASON_CONTRIBUTION = 0.05
    MAX_REASONS = 3


settings = DyscalculiaSettings()

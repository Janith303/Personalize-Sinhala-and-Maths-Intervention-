"""Loads the baseline deviation Random Forest and turns an uploaded photo into a result for the app."""
from functools import lru_cache

import cv2
import joblib
import numpy as np

from app.services.sinhala_writing import baseline_preprocessing as bp
from app.services.sinhala_writing.config import settings
from app.services.sinhala_writing.spacing_preprocessing import NoHandwritingError
# Same photo reading (EXIF rotation, sideways fix) and JPEG output as the spacing check
from app.services.sinhala_writing.spacing_service import decode_image, encode_jpeg_base64

MSG_GOOD = 'ඉතා හොඳයි! ඔබ රේඛාව මත නිවැරදිව ලියා ඇත.'
MSG_BAD = 'වචන රේඛාව මත තබා ලියන්න.'
MSG_NO_HANDWRITING = 'ඡායාරූපයේ ලිවීම හඳුනාගත නොහැක. ඔබ ලියූ පේළිය පැහැදිලිව පෙනෙන සේ නැවත ඡායාරූපයක් ගන්න.'
WORD_MESSAGES = {
    'on_line': 'රේඛාව මත',
    'above': 'රේඛාවට ඉහළින්',
    'below': 'රේඛාවට පහළින්',
}


def _r(v):
    return None if v is None or np.isnan(v) else round(float(v), 4)


class BaselineService:
    def __init__(self, model_path):
        bundle = joblib.load(model_path)
        self.model = bundle['model']
        self.model_name = bundle['model_name']
        self.feature_names = bundle['feature_names']
        self.class_names = bundle['class_names']
        self.threshold = float(bundle['threshold'])
        self.target_width = int(bundle['target_width'])

    def predict(self, image_bytes: bytes, include_image: bool = True) -> dict:
        gray = decode_image(image_bytes)
        final = bp.preprocess(gray, self.target_width)
        f, dbg = bp.extract_features(final, return_debug=True)

        # Phone photos can arrive upside down. Children write ON the guide line, so most ink is above it;
        # if most ink is below the line, turn the photo 180° and keep whichever way has less ink below.
        if dbg is not None and f['line_found'] and f['below_ink_ratio'] > 0.5:
            flipped = np.ascontiguousarray(np.rot90(final, 2))
            f2, dbg2 = bp.extract_features(flipped, return_debug=True)
            if dbg2 is not None and f2['below_ink_ratio'] < f['below_ink_ratio']:
                f, dbg = f2, dbg2

        if dbg is None or f['n_words'] == 0:
            raise NoHandwritingError(MSG_NO_HANDWRITING)
        x = np.array([[f[k] for k in self.feature_names]])
        p_wrong = float(self.model.predict_proba(x)[0, 1])
        is_correct = p_wrong < self.threshold          # same rule as the notebook: wrong if p >= threshold

        words = []
        for i, g in enumerate(dbg['gaps'], 1):
            status = 'above' if g > bp.ON_LINE_TOL else 'below' if g < -bp.ON_LINE_TOL else 'on_line'
            words.append({
                'index': i,
                'gap': round(float(g), 3),
                'status': status,
                'message': f'{i} වන වචනය: {WORD_MESSAGES[status]}',
            })

        annotated = None
        if include_image:
            annotated = encode_jpeg_base64(cv2.cvtColor(bp.draw_measurements(dbg), cv2.COLOR_RGB2BGR))

        return {
            'is_correct': is_correct,
            'verdict': 'CORRECT' if is_correct else 'WRONG',
            'message': MSG_GOOD if is_correct else MSG_BAD,
            'probability_wrong': round(p_wrong, 4),
            'confidence': round(max(p_wrong, 1 - p_wrong), 4),
            'guide_line_found': bool(f['line_found']),
            'words_found': int(f['n_words']),
            'measurements': {                              # in character heights
                'drift_slope': _r(f['drift_slope']),       # + rising, - falling
                'mean_gap': _r(f['mean_gap']),             # + above line, - below
                'max_abs_gap': _r(f['max_abs_gap']),
                'waviness': _r(f['waviness']),
            },
            'words': words,
            'annotated_image': annotated,
            'model': self.model_name,
        }


@lru_cache
def get_baseline_service() -> BaselineService:
    """Loads the model on the first request and reuses it for every later request."""
    if not settings.BASELINE_MODEL_PATH.exists():
        raise FileNotFoundError(f'Baseline model not found: {settings.BASELINE_MODEL_PATH}')
    return BaselineService(settings.BASELINE_MODEL_PATH)
"""Loads the trained spacing model and turns an uploaded photo into a result for the app."""
import base64
import io
from functools import lru_cache

import cv2
import joblib
import numpy as np
import pandas as pd
from PIL import Image, ImageOps, UnidentifiedImageError

from app.services.sinhala_writing import spacing_preprocessing as sp
from app.services.sinhala_writing.config import settings
from app.services.sinhala_writing.spacing_preprocessing import NoHandwritingError

MSG_GOOD = 'ඉතා හොඳයි! වචන අතර පරතරය නිවැරදියි.'
MSG_BAD = 'වචන අතර පරතරය නිවැරදි කරන්න.'
MSG_NO_HANDWRITING = 'ඡායාරූපයේ ලිවීම හඳුනාගත නොහැක. ඔබ ලියූ පේළිය පැහැදිලිව පෙනෙන සේ නැවත ඡායාරූපයක් ගන්න.'
MSG_BAD_IMAGE = 'මෙම ගොනුව ඡායාරූපයක් ලෙස කියවිය නොහැක. වෙනත් ඡායාරූපයක් තෝරන්න.'
GAP_MESSAGES = {
    'ok': 'හරි',
    'too_wide': 'පරතරය වැඩියි',
    'too_narrow': 'පරතරය අඩුයි',
}


class InvalidImageError(ValueError):
    """Raised when the uploaded bytes are not a readable image."""


def decode_image(data: bytes) -> np.ndarray:
    """Bytes -> grayscale array. Applies the phone's EXIF rotation so portrait/landscape photos come out upright."""
    try:
        img = Image.open(io.BytesIO(data))
        img = ImageOps.exif_transpose(img).convert('L')
    except (UnidentifiedImageError, OSError) as e:
        raise InvalidImageError(MSG_BAD_IMAGE) from e
    gray = np.array(img)
    # One written line is always wider than tall; a tall photo means the line is sideways, so turn it
    if gray.shape[0] > gray.shape[1]:
        gray = np.ascontiguousarray(np.rot90(gray, -1))
    return gray

def encode_jpeg_base64(bgr: np.ndarray, max_width: int = 1000) -> str:
    """Smaller JPEG for the phone, as a data URL that <Image source={{ uri }}> can show directly."""
    if bgr.shape[1] > max_width:
        h = round(bgr.shape[0] * max_width / bgr.shape[1])
        bgr = cv2.resize(bgr, (max_width, h), interpolation=cv2.INTER_AREA)
    ok, buf = cv2.imencode('.jpg', bgr, [cv2.IMWRITE_JPEG_QUALITY, 85])
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.tobytes()).decode('ascii')


class SpacingService:
    def __init__(self, model_path):
        bundle = joblib.load(model_path)
        self.model = bundle['model']
        self.model_name = bundle['model_name']
        self.features = bundle['features']
        self.good_range = tuple(float(v) for v in bundle['good_range'])

    def predict(self, image_bytes: bytes, include_image: bool = True) -> dict:
        gray = decode_image(image_bytes)
        try:
            m = sp.measure_line(gray)
        except NoHandwritingError as e:
            raise NoHandwritingError(MSG_NO_HANDWRITING) from e

        feats = pd.DataFrame([sp.make_features(m)])[self.features]
        p_bad = float(self.model.predict_proba(feats)[0, 1])
        is_correct = p_bad <= 0.5
        lo, hi = self.good_range

        gaps = []
        for i, g in enumerate(m['gap_w'][m['is_word']], 1):
            status = 'too_wide' if g > hi else 'too_narrow' if g < lo else 'ok'
            gaps.append({
                'index': i,
                'between_words': [i, i + 1],
                'width': round(float(g), 3),
                'status': status,
                'message': f'{i} සහ {i + 1} වචන අතර: {GAP_MESSAGES[status]}',
            })

        return {
            'is_correct': is_correct,
            'verdict': 'GOOD' if is_correct else 'BAD',
            'message': MSG_GOOD if is_correct else MSG_BAD,
            'probability_bad': round(p_bad, 4),
            'confidence': round(max(p_bad, 1 - p_bad), 4),
            'words_found': len(m['words']),
            'letter_height_px': round(float(m['h']), 1),
            'normal_gap_range': [round(lo, 3), round(hi, 3)],
            'gaps': gaps,
            'annotated_image': encode_jpeg_base64(sp.draw_gaps(m, self.good_range)) if include_image else None,
            'model': self.model_name,
        }


@lru_cache
def get_spacing_service() -> SpacingService:
    """Loads the model on the first request and reuses it for every later request."""
    if not settings.MODEL_PATH.exists():
        raise FileNotFoundError(f'Spacing model not found: {settings.MODEL_PATH}')
    return SpacingService(settings.MODEL_PATH)
import logging
import threading
from typing import Literal

import keras
import numpy as np

from app.core.config import CLASS_NAMES, settings
from app.services.preprocessing import preprocess_image

logger = logging.getLogger(__name__)

Verdict = Literal["correct", "wrong", "wrong_letter", "try_again"]


def decide(probs: np.ndarray, asked_letter: str | None, min_confidence: float | None = None) -> dict:
    """Turn the 10-way softmax into a verdict (same logic as check_letter in resnet50.ipynb).

    try_again    - model is not sure enough (top probability < min_confidence)
    wrong_letter - model sees a different letter than the one asked for
    correct/wrong - right letter, written correctly / badly
    """
    if min_confidence is None:
        min_confidence = settings.min_confidence
    best = int(np.argmax(probs))
    pred_class = CLASS_NAMES[best]
    confidence = float(probs[best])
    predicted_letter, predicted_state = pred_class.split("_")

    if confidence < min_confidence:
        verdict: Verdict = "try_again"
    elif asked_letter is not None and predicted_letter != asked_letter:
        verdict = "wrong_letter"
    else:
        verdict = "correct" if predicted_state == "correct" else "wrong"

    return {
        "verdict": verdict,
        "asked_letter": asked_letter,
        "predicted_letter": predicted_letter,
        "predicted_state": predicted_state,
        "pred_class": pred_class,
        "confidence": confidence,
        "probabilities": {name: float(p) for name, p in zip(CLASS_NAMES, probs)},
    }


class PredictionService:
    def __init__(self) -> None:
        self._model: keras.Model | None = None
        self._lock = threading.Lock()

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def load(self) -> None:
        if self._model is not None:
            return
        logger.info("Loading model from %s", settings.model_path)
        self._model = keras.models.load_model(settings.model_path, compile=False)
        if self._model.output_shape[-1] != len(CLASS_NAMES):
            raise RuntimeError(
                f"Model has {self._model.output_shape[-1]} outputs, expected {len(CLASS_NAMES)}"
            )
        # warm-up so the first request is fast
        self._model.predict(np.zeros((1, 224, 224, 3), dtype="float32"), verbose=0)
        logger.info("Model loaded")

    def predict(self, image_bytes: bytes, asked_letter: str | None = None) -> dict:
        if self._model is None:
            raise RuntimeError("Model is not loaded")
        x = preprocess_image(image_bytes)
        with self._lock:
            probs = np.asarray(self._model.predict(x, verbose=0))[0]
        return decide(probs, asked_letter)


prediction_service = PredictionService()

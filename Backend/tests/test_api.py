import io

import numpy as np
import pytest
from fastapi.testclient import TestClient
from PIL import Image, ImageDraw

from app.core.config import CLASS_NAMES, LETTERS
from app.main import app
from app.services.prediction_service import decide
from app.services.preprocessing import preprocess_image


def probs_for(class_name: str, confidence: float) -> np.ndarray:
    p = np.full(len(CLASS_NAMES), (1 - confidence) / (len(CLASS_NAMES) - 1))
    p[CLASS_NAMES.index(class_name)] = confidence
    return p


# ---------- decision logic (no model needed) ----------

def test_class_order_matches_notebook():
    assert CLASS_NAMES == [
        "ga_correct", "ga_wrong", "ra_correct", "ra_wrong", "ta_correct",
        "ta_wrong", "u_correct", "u_wrong", "la_correct", "la_wrong",
    ]


@pytest.mark.parametrize("cls,asked,verdict", [
    ("ga_correct", "ga", "correct"),
    ("ga_wrong", "ga", "wrong"),
    ("ra_correct", "ga", "wrong_letter"),
    ("la_wrong", "u", "wrong_letter"),
    ("u_correct", None, "correct"),
])
def test_decide_verdicts(cls, asked, verdict):
    r = decide(probs_for(cls, 0.9), asked)
    assert r["verdict"] == verdict
    assert r["pred_class"] == cls
    assert r["predicted_letter"] == cls.split("_")[0]


def test_decide_low_confidence_is_try_again():
    assert decide(probs_for("ga_correct", 0.49), "ga")["verdict"] == "try_again"
    assert decide(probs_for("ga_correct", 0.5), "ga")["verdict"] == "correct"
    # low confidence wins even when the letter is also wrong
    assert decide(probs_for("ra_correct", 0.3), "ga")["verdict"] == "try_again"


# ---------- API (loads the real model) ----------

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def make_image(fmt="PNG", size=(300, 180)) -> bytes:
    img = Image.new("RGB", size, "white")
    d = ImageDraw.Draw(img)
    d.line((30, 40, 250, 140), fill="black", width=8)
    d.ellipse((60, 30, 120, 90), outline="black", width=6)
    buf = io.BytesIO()
    img.save(buf, fmt)
    return buf.getvalue()


def test_preprocess_shape_and_range():
    x = preprocess_image(make_image())
    assert x.shape == (1, 224, 224, 3)
    assert x.dtype == np.float32
    assert x.min() < -100 and x.max() > 100


def test_root_and_health(client):
    assert client.get("/").status_code == 200
    body = client.get("/health").json()
    assert body["status"] == "ok"
    assert body["model_loaded"] is True


@pytest.mark.parametrize("fmt,mime", [("PNG", "image/png"), ("JPEG", "image/jpeg")])
def test_predict_shape(client, fmt, mime):
    r = client.post(
        "/api/v1/predict",
        files={"file": (f"a.{fmt.lower()}", make_image(fmt), mime)},
        data={"student_id": "s1", "subject": "sinhala", "question_id": "ga", "asked_letter": "ga"},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["verdict"] in ("correct", "wrong", "wrong_letter", "try_again")
    assert body["asked_letter"] == "ga"
    assert body["predicted_letter"] in LETTERS
    assert set(body["probabilities"]) == set(CLASS_NAMES)
    assert sum(body["probabilities"].values()) == pytest.approx(1.0, abs=1e-3)


def test_predict_without_asked_letter_never_wrong_letter(client):
    r = client.post("/api/v1/predict", files={"file": ("a.png", make_image(), "image/png")})
    assert r.status_code == 200
    assert r.json()["verdict"] != "wrong_letter"


def test_predict_is_deterministic(client):
    img = make_image()
    c = [
        client.post("/api/v1/predict", files={"file": ("a.png", img, "image/png")}).json()["confidence"]
        for _ in range(2)
    ]
    assert c[0] == pytest.approx(c[1])


def test_predict_rejects_bad_input(client):
    ok = ("a.png", make_image(), "image/png")
    assert client.post("/api/v1/predict", files={"file": ok}, data={"asked_letter": "xx"}).status_code == 422
    assert client.post("/api/v1/predict", files={"file": ("a.txt", b"hi", "text/plain")}).status_code == 415
    assert client.post("/api/v1/predict", files={"file": ("a.png", b"", "image/png")}).status_code == 400
    assert client.post("/api/v1/predict", files={"file": ("a.png", b"notanimage", "image/png")}).status_code == 422


def test_history_requires_db(client):
    if client.get("/health").json()["database_connected"]:
        assert client.get("/api/v1/predict").status_code == 200
    else:
        assert client.get("/api/v1/predict").status_code == 503

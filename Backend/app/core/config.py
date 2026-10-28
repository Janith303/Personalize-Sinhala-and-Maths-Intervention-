from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]

# The 5 letters the model knows. Folder names used in training, in model order.
LETTERS = ["ga", "ra", "ta", "u", "la"]
STATES = ["correct", "wrong"]
# Output order of resnet50_letter_10class.keras (see resnet50.ipynb): class id = letter_index * 2 + state_index
CLASS_NAMES = [f"{letter}_{state}" for letter in LETTERS for state in STATES]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")

    app_name: str = "Personalize Sinhala and Maths Intervention API"
    api_prefix: str = "/api/v1"

    mongodb_uri: str = ""
    mongodb_db_name: str = "sinhala_maths_intervention"

    model_path: Path = BASE_DIR / "app" / "ml_models" / "DL" / "resnet50_letter_10class.keras"
    # Below this top-class probability the model is unsure -> ask the student to try again
    min_confidence: float = 0.5
    max_upload_mb: int = 10


settings = Settings()

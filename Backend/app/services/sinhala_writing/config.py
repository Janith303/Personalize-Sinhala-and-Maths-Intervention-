"""Settings for the Sinhala writing module only (word spacing + baseline deviation)."""
import os
from pathlib import Path

APP_DIR = Path(__file__).resolve().parents[2]
MODELS_DIR = APP_DIR / 'ml_models' / 'ML' / 'sinhala_writing'


class SpacingSettings:
    # Trained model from Colab (dataset2/svm_rbf_output/spacing_svm.joblib).
    # Override with the SINHALA_SPACING_MODEL_PATH environment variable if you keep it elsewhere.
    MODEL_PATH = Path(os.getenv('SINHALA_SPACING_MODEL_PATH', MODELS_DIR / 'spacing_svm.joblib'))

    # Baseline deviation model from Colab (baseline_results_random_forest/models/opencv_random_forest.joblib)
    BASELINE_MODEL_PATH = Path(os.getenv('SINHALA_BASELINE_MODEL_PATH', MODELS_DIR / 'baseline_rf.joblib'))

    # Largest photo the API accepts (phone photos are usually 2-6 MB)
    MAX_UPLOAD_MB = int(os.getenv('SINHALA_SPACING_MAX_UPLOAD_MB', '15'))


settings = SpacingSettings()
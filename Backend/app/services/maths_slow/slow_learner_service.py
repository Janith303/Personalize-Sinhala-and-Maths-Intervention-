"""Loads the slow-learner Decision Tree and predicts Slow / Normal for one answered question."""
import os
from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd

APP_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = Path(os.getenv('MATHS_SLOW_MODEL_PATH',
                            APP_DIR / 'ml_models' / 'ML' / 'maths_slow' / 'dt_slow_learner_model.joblib'))

# Column order the model was trained with (dt_model_metadata.json -> features_required_in_order)
FEATURES = ['Total_Time', 'Carry_Over_Time', 'Erasure_Count', 'Carry_Ratio',
            'Non_Carry_Time', 'Hint_Requests', 'Operation_Type']
THRESHOLD = 0.5
OPERATION_NAMES = {'addition': 'Addition', 'subtraction': 'Subtraction',
                   'multiplication': 'Multiplication', 'division': 'Division'}


def build_features(total_time, carry_over_time, erase_count, hint_count, operation):
    """App values -> one model row. CHECK Carry_Ratio and Non_Carry_Time against the training notebook."""
    total_time = float(total_time)
    carry_over_time = float(carry_over_time)
    return {
        'Total_Time': total_time,
        'Carry_Over_Time': carry_over_time,
        'Erasure_Count': int(erase_count),
        'Carry_Ratio': carry_over_time / total_time if total_time > 0 else 0.0,   # ASSUMED formula
        'Non_Carry_Time': max(0.0, total_time - carry_over_time),                # ASSUMED formula
        'Hint_Requests': int(hint_count),
        'Operation_Type': OPERATION_NAMES[operation],
    }


class SlowLearnerService:
    def __init__(self, model_path):
        self.model = joblib.load(model_path)       # Pipeline: OneHotEncoder(Operation_Type) + DecisionTree
        classes = list(self.model.classes_)
        self.slow_index = classes.index('Slow') if 'Slow' in classes else classes.index(1)

    def predict(self, features: dict) -> dict:
        row = pd.DataFrame([features])[FEATURES]
        p_slow = float(self.model.predict_proba(row)[0, self.slow_index])
        is_slow = p_slow >= THRESHOLD
        return {
            'prediction': 'Slow' if is_slow else 'Normal',
            'is_slow': is_slow,
            'probability_slow': round(p_slow, 4),
            'features': features,
            'model': 'DecisionTreeClassifier',
        }


@lru_cache
def get_slow_learner_service() -> SlowLearnerService:
    """Loads the model on the first request and reuses it for every later request."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f'Slow-learner model not found: {MODEL_PATH}')
    return SlowLearnerService(MODEL_PATH)
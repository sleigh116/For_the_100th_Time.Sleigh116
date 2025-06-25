import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

MODEL_PATH = "device_classifier.joblib"

# Simulated training for demo (replace with real model/data later)
def train_and_save_model():
    X = np.array([
        [0.2, 0.3, 0.1],   # fridge
        [0.8, 1.0, 0.9],   # TV
        [1.5, 1.7, 1.6],   # irrigation
    ])
    y = ["fridge", "TV", "irrigation"]
    model = RandomForestClassifier()
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)

# Load model or train if missing
def load_model():
    if not os.path.exists(MODEL_PATH):
        train_and_save_model()
    return joblib.load(MODEL_PATH)

model = load_model()

def predict_device(energy_sequence):
    energy_sequence = np.array(energy_sequence).reshape(1, -1)
    device = model.predict(energy_sequence)[0]
    confidence = max(model.predict_proba(energy_sequence)[0])
    return {"device": device, "confidence": round(confidence, 2)} 
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

# Mock data for weather forecasts and panel specs
mock_weather_data = [
    {"date": "2023-10-01", "temperature": 25, "sunlight_hours": 8},
    {"date": "2023-10-02", "temperature": 22, "sunlight_hours": 6},
    {"date": "2023-10-03", "temperature": 28, "sunlight_hours": 9},
]

mock_panel_specs = {
    "efficiency": 0.18,  # 18% efficiency
    "area": 10,  # 10 square meters
}

def predict_solar_output(weather_data, panel_specs):
    """
    Predict solar output based on weather data and panel specifications.
    """
    # Prepare mock regression model
    sunlight_hours = [data["sunlight_hours"] for data in weather_data]
    temperatures = [data["temperature"] for data in weather_data]
    X = np.array([sunlight_hours, temperatures]).T
    y = np.array([hours * panel_specs["efficiency"] * panel_specs["area"] for hours in sunlight_hours])

    # Train regression model
    model = LinearRegression()
    model.fit(X, y)

    # Predict output
    predictions = model.predict(X)
    return [{"date": weather_data[i]["date"], "predicted_output_kwh": round(predictions[i], 2)} for i in range(len(weather_data))]

# Example usage
if __name__ == "__main__":
    predictions = predict_solar_output(mock_weather_data, mock_panel_specs)
    print(predictions) 
from flask import Blueprint, jsonify
from app.services.solar_output_estimator import predict_solar_output, mock_weather_data, mock_panel_specs

solar_bp = Blueprint("solar", __name__)

@solar_bp.route("/solar-output", methods=["GET"])
def get_solar_output():
    """
    API endpoint to get solar output predictions.
    """
    predictions = predict_solar_output(mock_weather_data, mock_panel_specs)
    return jsonify(predictions) 
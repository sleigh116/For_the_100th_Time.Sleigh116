from flask import Blueprint, request, jsonify
from app.ai_device_detector import predict_device

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/api/ai/d', methods=['POST'])
def detect_device():
    try:
        data = request.get_json()
        sequence = data.get("sequence", [])

        if not sequence or not isinstance(sequence, list):
            return jsonify({"error": "Invalid or missing sequence"}), 400

        result = predict_device(sequence)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500 
from flask import Blueprint, jsonify, request
from services.video_service import VideoService
from services.warning_service import WarningService
import base64
import numpy as np
import cv2
from utils.validators import validate_json  # 👈 ADD THIS LINE!

detection_bp = Blueprint('detection', __name__)
video_service = VideoService()
warning_service = WarningService()

@detection_bp.route('/analyze-frame', methods=['POST'])
@validate_json  # ✅ Now this works!
def analyze_frame():
    data = request.get_json()
    frame_b64 = data.get('frame')

    if not frame_b64:
        return jsonify({"error": "No frame provided"}), 400

    try:
        img_data = base64.b64decode(frame_b64)
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Invalid image data"}), 400

        result = video_service.process_frame(frame)

        if result["cheating_detected"]:
            warning_service.add_warning("Suspicious eye/head movement")

        return jsonify({
            "success": True,
            "result": result,
            "warning_status": warning_service.get_status()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
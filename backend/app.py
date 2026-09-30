from flask import Flask
from config import Config
from flask_cors import CORS 
from routes.interview_routes import interview_bp
from routes.detection_routes import detection_bp
from utils.logger import interview_logger

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # 👇 ENABLE CORS FOR FRONTEND ORIGIN
    CORS(app, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.29.144:5173"  # if you open frontend on another device
                       ], methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

    # Register blueprints
    app.register_blueprint(interview_bp, url_prefix='/api/interview')
    app.register_blueprint(detection_bp, url_prefix='/api/detection')

    # Health check
    @app.route('/')
    def home():
        return jsonify({"status": "MockMentorAI Backend Running", "version": "1.0"})

    @app.route('/health')
    def health():
        return jsonify({"status": "OK"})

    interview_logger.info("🚀 MockMentorAI Backend Started")
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=Config.DEBUG)
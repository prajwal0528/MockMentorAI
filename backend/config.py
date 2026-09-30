import os

class Config:
    # LLM Configuration (Remote API)
    LLM_API_KEY = os.getenv('LLM_API_KEY', 'sk-73d4010e7b34492283fee5ca1a14229e')
    LLM_API_URL = os.getenv('LLM_API_URL', 'https://chat.ivislabs.in/api/chat/completions')

    # Video Detection Thresholds (adjust as needed)
    EYE_ASPECT_RATIO_THRESHOLD = 0.25        # If EAR < this → eye closed
    EYE_CLOSED_FRAMES_THRESHOLD = 15         # How many consecutive frames → warning
    HEAD_POSE_THRESHOLD = 30                 # Degrees deviation from center 
    CHEATING_WARNING_COUNT = 3               # After 3 warnings → flag as cheating

    # Interview Settings
    INTERVIEW_DURATION_MINUTES = 10          # Default interview length
    QUESTIONS_PER_INTERVIEW = 5                # Number of questions asked

    # Logging
    LOG_DIR = "data/logs"
    DEBUG = True

    @staticmethod
    def init_app(app):
        pass
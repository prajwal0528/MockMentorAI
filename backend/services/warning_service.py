from config import Config
from utils.logger import detection_logger

class WarningService:
    def __init__(self):
        self.warning_count = 0
        self.is_cheating = False

    def add_warning(self, reason="Unknown"):
        self.warning_count += 1
        detection_logger.warning(f"Warning #{self.warning_count}: {reason}")

        if self.warning_count >= Config.CHEATING_WARNING_COUNT:
            self.is_cheating = True
            detection_logger.critical("🚨 CHEATING DETECTED: Interview flagged!")

    def reset_warnings(self):
        self.warning_count = 0
        self.is_cheating = False

    def get_status(self):
        return {
            "warning_count": self.warning_count,
            "is_cheating": self.is_cheating
        }
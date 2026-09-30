import logging
import os
from datetime import datetime

LOG_DIR = "../data/logs"

if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

def setup_logger(name, log_file, level=logging.INFO):
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

    handler = logging.FileHandler(log_file)
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger

# Initialize loggers
interview_logger = setup_logger('interview', f"{LOG_DIR}/interview_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
detection_logger = setup_logger('detection', f"{LOG_DIR}/detection_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
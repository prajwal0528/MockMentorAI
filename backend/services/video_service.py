import cv2
import dlib
import numpy as np
from config import Config
from utils.logger import detection_logger

class VideoService:
    def __init__(self):
        # Load face detector and landmark predictor
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor("data/models/shape_predictor_68_face_landmarks.dat")

        # Eye landmark indices (dlib 68-point model)
        self.LEFT_EYE_INDICES = list(range(36, 42))
        self.RIGHT_EYE_INDICES = list(range(42, 48))

        # Head pose landmarks for gaze estimation
        self.FACE_POINTS = [1, 8, 16, 27, 30, 33, 36, 39, 42, 45]  # Key facial points

        # State tracking
        self.eye_closed_frames = 0
        self.head_deviation_frames = 0
        self.warning_count = 0

    def eye_aspect_ratio(self, eye):
        # Compute the euclidean distances between the two sets of vertical eye landmarks
        A = np.linalg.norm(eye[1] - eye[5])
        B = np.linalg.norm(eye[2] - eye[4])
        C = np.linalg.norm(eye[0] - eye[3])

        ear = (A + B) / (2.0 * C)
        return ear

    def get_head_pose(self, image, landmarks):
        # Simplified head pose estimation using 3D model projection
        # This is a basic version — you can enhance with solvePnP later
        h, w = image.shape[:2]

        # 3D model points (standard face model)
        model_points = np.array([
            (0.0, 0.0, 0.0),             # Nose tip
            (0.0, -330.0, -65.0),        # Chin
            (-225.0, 170.0, -135.0),     # Left eye left corner
            (225.0, 170.0, -135.0),      # Right eye right corner
            (-150.0, -150.0, -125.0),    # Left mouth corner
            (150.0, -150.0, -125.0)      # Right mouth corner
        ])

        # 2D image points from dlib landmarks
        image_points = np.array([
            landmarks.part(30).x, landmarks.part(30).y,     # Nose tip
            landmarks.part(8).x, landmarks.part(8).y,       # Chin
            landmarks.part(36).x, landmarks.part(36).y,     # Left eye corner
            landmarks.part(45).x, landmarks.part(45).y,     # Right eye corner
            landmarks.part(48).x, landmarks.part(48).y,     # Left mouth
            landmarks.part(54).x, landmarks.part(54).y      # Right mouth
        ]).reshape(6, 2).astype("double")

        # Camera internals
        focal_length = w
        center = (w / 2, h / 2)
        camera_matrix = np.array([
            [focal_length, 0, center[0]],
            [0, focal_length, center[1]],
            [0, 0, 1]], dtype="double")

        dist_coeffs = np.zeros((4, 1))  # Assuming no lens distortion

        success, rotation_vector, translation_vector = cv2.solvePnP(
            model_points, image_points, camera_matrix, dist_coeffs)

        # Convert rotation vector to Euler angles
        rmat, _ = cv2.Rodrigues(rotation_vector)
        pose_mat = cv2.hconcat([rmat, translation_vector])
        _, _, _, _, _, _, euler_angles = cv2.decomposeProjectionMatrix(pose_mat)

        pitch, yaw, roll = [np.radians(angle) for angle in euler_angles.flatten()[:3]]
        return abs(yaw) * 180 / np.pi, abs(pitch) * 180 / np.pi

    def process_frame(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.detector(gray)

        if len(faces) == 0:
            return {"cheating_detected": False, "warnings": self.warning_count}

        face = faces[0]
        landmarks = self.predictor(gray, face)

        # --- EYE DETECTION ---
        left_eye = np.array([(landmarks.part(n).x, landmarks.part(n).y) for n in self.LEFT_EYE_INDICES])
        right_eye = np.array([(landmarks.part(n).x, landmarks.part(n).y) for n in self.RIGHT_EYE_INDICES])

        left_ear = self.eye_aspect_ratio(left_eye)
        right_ear = self.eye_aspect_ratio(right_eye)
        ear = (left_ear + right_ear) / 2.0

        # --- HEAD POSE DETECTION ---
        yaw_angle, pitch_angle = self.get_head_pose(frame, landmarks)

        # --- LOGIC FOR CHEATING ---
        cheating_detected = False

        # Eye closed
        if ear < Config.EYE_ASPECT_RATIO_THRESHOLD:
            self.eye_closed_frames += 1
            if self.eye_closed_frames >= Config.EYE_CLOSED_FRAMES_THRESHOLD:
                detection_logger.warning("Eyes closed for too long — potential cheating")
                self.warning_count += 1
                cheating_detected = True
        else:
            self.eye_closed_frames = 0

        # Head turned too far
        if yaw_angle > Config.HEAD_POSE_THRESHOLD:
            self.head_deviation_frames += 1
            if self.head_deviation_frames >= 10:  # 10 frames ~ 0.3s at 30fps
                detection_logger.warning(f"Head turned too far (yaw={yaw_angle:.1f}°) — potential cheating")
                self.warning_count += 1
                cheating_detected = True
        else:
            self.head_deviation_frames = 0

        # Reset if above threshold
        if self.warning_count >= Config.CHEATING_WARNING_COUNT:
            detection_logger.critical("CHEATING FLAGGED: Exceeded warning threshold")
            self.warning_count = 0  # Reset after flagging

        return {
            "ear": round(ear, 3),
            "yaw_angle": round(yaw_angle, 1),
            "pitch_angle": round(pitch_angle, 1),
            "cheating_detected": cheating_detected,
            "warnings": self.warning_count
        }
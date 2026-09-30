import dlib
import os

model_path = "shape_predictor_68_face_landmarks.dat"
print(f"File exists: {os.path.exists(model_path)}")
print(f"File size: {os.path.getsize(model_path)} bytes")

try:
    predictor = dlib.shape_predictor(model_path)
    print("✅ SUCCESS! dlib loaded the model correctly.")
except Exception as e:
    print(f"❌ FAILED: {e}")

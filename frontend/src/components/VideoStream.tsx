import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, AlertTriangle, Loader } from 'lucide-react';

interface VideoStreamProps {
  webcamRef: React.RefObject<Webcam>;
  active: boolean;
}

const VideoStream: React.FC<VideoStreamProps> = ({ webcamRef, active }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoConstraints = {
    facingMode: 'user',
    width: 640,
    height: 480
  };

  useEffect(() => {
    if (active) {
      // Request camera permission
      navigator.mediaDevices.getUserMedia({ video: videoConstraints })
        .then(() => {
          setHasPermission(true);
          setError(null);
        })
        .catch((err) => {
          console.error('Camera permission denied:', err);
          setHasPermission(false);
          setError('Camera access denied. Please allow camera permission to continue.');
        });
    }
  }, [active]);

  const handleUserMediaError = (error: any) => {
    console.error('Webcam error:', error);
    setError('Failed to access camera. Please check your camera permissions.');
  };

  if (!active) {
    return (
      <div className="w-full h-96 bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-white">
        <Camera className="w-12 h-12 mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Camera Standby</h3>
        <p className="text-gray-300">Waiting for interview to start...</p>
      </div>
    );
  }

  if (hasPermission === false || error) {
    return (
      <div className="w-full h-96 bg-red-600 rounded-2xl flex flex-col items-center justify-center text-white p-6">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-bold mb-2">❌ Camera Access Required</h3>
        <p className="text-center">
          {error || 'Please allow camera access and refresh the page to continue with the interview.'}
        </p>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="w-full h-96 bg-orange-600 rounded-2xl flex flex-col items-center justify-center text-white">
        <Loader className="w-12 h-12 mb-4 animate-spin" />
        <h3 className="text-xl font-semibold mb-2">📷 Requesting Camera Access</h3>
        <p>Please allow camera permission...</p>
      </div>
    );
  }

  return (
    <Webcam
      ref={webcamRef}
      audio={false}
      mirrored={true}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
      onUserMediaError={handleUserMediaError}
      className="w-full h-full object-cover rounded-2xl"
    />
  );
};

export default VideoStream;
import React, { useEffect, useRef } from 'react';

interface FaceMeshOverlayProps {
  webcamRef: React.RefObject<any>;
  isCheating: boolean;
  active: boolean;
  eyesClosed: boolean;
  lookingAway: boolean;
  cameraBlocked: boolean;
}

const FaceMeshOverlay: React.FC<FaceMeshOverlayProps> = ({ 
  webcamRef, 
  isCheating, 
  active, 
  eyesClosed, 
  lookingAway, 
  cameraBlocked 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !webcamRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = webcamRef.current.video;

    if (!ctx) return;

    const drawFaceMesh = () => {
      if (!video || video.readyState !== 4) {
        requestAnimationFrame(drawFaceMesh);
        return;
      }

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Basic face detection simulation
      const padding = 0.15;
      const faceWidth = canvas.width * (1 - 2 * padding);
      const faceHeight = canvas.height * (1 - 2 * padding);
      const faceX = canvas.width * padding;
      const faceY = canvas.height * padding;

      // Determine mesh color based on status
      let meshColor = 'rgba(0, 255, 0, 0.8)'; // Green for good
      if (isCheating) {
        meshColor = 'rgba(255, 0, 0, 0.9)'; // Red for cheating
      } else if (cameraBlocked) {
        meshColor = 'rgba(255, 0, 0, 0.7)'; // Red for blocked
      } else if (eyesClosed || lookingAway) {
        meshColor = 'rgba(255, 165, 0, 0.8)'; // Orange for warnings
      }

      // Draw face outline
      ctx.strokeStyle = meshColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(faceX, faceY, faceWidth, faceHeight);

      // Draw facial features
      const eyeRadius = faceWidth * 0.06;
      const eyeY = faceY + faceHeight * 0.35;
      const leftEyeX = faceX + faceWidth * 0.3;
      const rightEyeX = faceX + faceWidth * 0.7;

      // Eyes
      ctx.beginPath();
      ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Fill eyes if closed
      if (eyesClosed || cameraBlocked) {
        ctx.fillStyle = meshColor;
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nose
      const noseX = faceX + faceWidth * 0.5;
      const noseY = faceY + faceHeight * 0.5;
      ctx.beginPath();
      ctx.moveTo(noseX, noseY);
      ctx.lineTo(noseX - 5, noseY + 15);
      ctx.lineTo(noseX + 5, noseY + 15);
      ctx.closePath();
      ctx.stroke();

      // Mouth
      const mouthY = faceY + faceHeight * 0.7;
      const mouthWidth = faceWidth * 0.3;
      ctx.beginPath();
      ctx.arc(noseX, mouthY, mouthWidth / 2, 0, Math.PI);
      ctx.stroke();

      // Status indicators
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = meshColor;

      if (isCheating) {
        ctx.fillText('⚠️ CHEATING DETECTED', canvas.width / 2, faceY - 20);
      } else if (cameraBlocked) {
        ctx.fillText('📷 CAMERA BLOCKED', canvas.width / 2, faceY - 20);
      } else if (eyesClosed) {
        ctx.fillText('😴 EYES CLOSED', canvas.width / 2, faceY - 20);
      } else if (lookingAway) {
        ctx.fillText('👀 LOOKING AWAY', canvas.width / 2, faceY - 20);
      } else {
        ctx.fillText('✅ GOOD BEHAVIOR', canvas.width / 2, faceY - 20);
      }

      requestAnimationFrame(drawFaceMesh);
    };

    drawFaceMesh();
  }, [webcamRef, isCheating, active, eyesClosed, lookingAway, cameraBlocked]);

  if (!active) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default FaceMeshOverlay;
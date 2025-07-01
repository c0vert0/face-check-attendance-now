
import { useEffect, useRef, useState } from "react";
import { Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraFeedProps {
  isActive: boolean;
  onFaceDetected: (faceCount: number) => void;
}

export const CameraFeed = ({ isActive, onFaceDetected }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setError("");
        
        // Start face detection simulation
        startFaceDetection();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      setError("Unable to access camera. Please ensure camera permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startFaceDetection = () => {
    // Simulate face detection with random face counts
    const interval = setInterval(() => {
      if (!isActive) {
        clearInterval(interval);
        return;
      }
      
      // Simulate detecting 0-3 faces randomly
      const faceCount = Math.floor(Math.random() * 4);
      onFaceDetected(faceCount);
      
      // Draw face detection boxes on canvas
      drawFaceBoxes(faceCount);
    }, 1000);
  };

  const drawFaceBoxes = (faceCount: number) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw face detection boxes
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.font = '16px Arial';
    ctx.fillStyle = '#3B82F6';
    
    for (let i = 0; i < faceCount; i++) {
      // Random positions for demo purposes
      const x = Math.random() * (canvas.width - 150);
      const y = Math.random() * (canvas.height - 150);
      const width = 120 + Math.random() * 50;
      const height = 150 + Math.random() * 50;
      
      ctx.strokeRect(x, y, width, height);
      ctx.fillText(`Face ${i + 1}`, x, y - 10);
    }
  };

  const requestPermission = async () => {
    await startCamera();
  };

  if (hasPermission === false) {
    return (
      <div className="relative bg-gray-100 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={requestPermission} className="bg-blue-600 hover:bg-blue-700">
            <Camera className="mr-2 h-4 w-4" />
            Grant Camera Access
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-96 object-cover"
        onLoadedMetadata={() => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }}
      />
      
      {/* Face detection overlay */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'normal' }}
      />
      
      {/* Status indicator */}
      <div className="absolute top-4 left-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          isActive 
            ? 'bg-green-500/90 text-white' 
            : 'bg-gray-500/90 text-white'
        }`}>
          <div className={`h-2 w-2 rounded-full ${
            isActive ? 'bg-white animate-pulse' : 'bg-gray-300'
          }`} />
          {isActive ? 'LIVE' : 'INACTIVE'}
        </div>
      </div>
      
      {!isActive && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Camera Feed Inactive</p>
            <p className="text-sm opacity-75">Click "Start System" to begin</p>
          </div>
        </div>
      )}
    </div>
  );
};

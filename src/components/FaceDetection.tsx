
import { Badge } from "@/components/ui/badge";
import { Users, Eye } from "lucide-react";

interface FaceDetectionProps {
  isActive: boolean;
  faceCount: number;
}

export const FaceDetection = ({ isActive, faceCount }: FaceDetectionProps) => {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-700">Face Detection</span>
        </div>
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>
      
      {isActive && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">
                {faceCount === 0 && "No faces detected"}
                {faceCount === 1 && "1 face detected"}
                {faceCount > 1 && `${faceCount} faces detected`}
              </p>
              <p className="text-sm text-blue-700">
                Processed Image Face Detected!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

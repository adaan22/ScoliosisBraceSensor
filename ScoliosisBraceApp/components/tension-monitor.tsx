import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function TensionMonitor() {
  const currentTension = 32;
  const recommendedMin = 25;
  const recommendedMax = 35;
  const isInRange = currentTension >= recommendedMin && currentTension <= recommendedMax;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-[#00487C]">Tension Level</h3>
        <Badge 
          variant={isInRange ? "default" : "destructive"}
          className={isInRange ? "bg-green-500" : ""}
        >
          {isInRange ? (
            <><CheckCircle className="w-3 h-3 mr-1" /> Optimal</>
          ) : (
            <><AlertCircle className="w-3 h-3 mr-1" /> Adjust</>
          )}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="text-center py-4">
          <p className="text-5xl font-bold text-[#00487C]">{currentTension}</p>
          <p className="text-sm text-[#00487C]/60 mt-1">Current Tension</p>
        </div>

        <div className="relative h-4 bg-gradient-to-r from-red-200 via-green-200 to-red-200 rounded-full">
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00487C] rounded-full shadow-lg"
            style={{ left: `${(currentTension / 50) * 100}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-[#00487C]/70">
          <span>0</span>
          <div className="text-center">
            <p className="font-medium text-[#00487C]">Recommended</p>
            <p>{recommendedMin} - {recommendedMax}</p>
          </div>
          <span>50</span>
        </div>
      </div>
    </Card>
  );
}

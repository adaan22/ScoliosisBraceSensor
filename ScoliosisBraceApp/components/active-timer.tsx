import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Clock, Target } from 'lucide-react';

export function ActiveTimer() {
  const hoursWornToday = 6.5;
  const dailyGoal = 10;
  const timeRemaining = dailyGoal - hoursWornToday;
  const progressPercentage = (hoursWornToday / dailyGoal) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-[#00487C] to-[#005A8C] text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h3 className="font-medium">Today's Wear Time</h3>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span className="text-sm opacity-90">Goal: {dailyGoal}h</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold">{hoursWornToday}h</p>
            <p className="text-sm opacity-75">Hours worn</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold">{timeRemaining}h</p>
            <p className="text-sm opacity-75">Remaining</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-white/20 [&>div]:bg-white" 
          />
          <div className="flex justify-between text-xs opacity-75">
            <span>{Math.round(progressPercentage)}% complete</span>
            <span>{Math.round(100 - progressPercentage)}% to go</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

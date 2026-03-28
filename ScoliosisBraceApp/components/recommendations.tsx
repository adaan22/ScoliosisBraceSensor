import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const recommendations = [
  {
    id: 1,
    type: 'tension',
    message: 'Increase tension by 3 units for optimal support',
    priority: 'high'
  },
  {
    id: 2,
    type: 'duration',
    message: 'Try to wear brace for 10 total hours per day',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'consistency',
    message: 'Great progress! Keep maintaining your current schedule',
    priority: 'low'
  }
];

export function Recommendations() {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggleComplete = (id: number) => {
    setCompleted(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-[#00487C]" />
        <h3 className="font-medium text-[#00487C]">Recommendations</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <Alert 
            key={rec.id}
            className={`border-l-4 ${
              rec.priority === 'high' 
                ? 'border-l-orange-500 bg-orange-50' 
                : rec.priority === 'medium'
                ? 'border-l-blue-500 bg-blue-50'
                : 'border-l-green-500 bg-green-50'
            } ${completed.includes(rec.id) ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              <AlertDescription className="flex-1">
                {rec.message}
              </AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleComplete(rec.id)}
                className={completed.includes(rec.id) ? 'text-green-600' : ''}
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>
          </Alert>
        ))}
      </div>
    </Card>
  );
}

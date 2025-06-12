
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function CryptoPilotProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="my-6">
      <div className="mb-2 flex justify-between text-sm font-medium text-foreground">
        <span>Progress</span>
        <span>Step {currentStep} of {totalSteps}</span>
      </div>
      <Progress 
        value={progressPercentage} 
        className="w-full h-3 bg-muted [&>div]:bg-success" 
        aria-label={`Progress: ${currentStep} of ${totalSteps} steps completed`} 
      />
    </div>
  );
}


import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showLabels?: boolean;
}

export function CryptoFlightProgressBar({ currentStep, totalSteps, showLabels = true }: ProgressBarProps) {
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div> {/* Removed my-6 from here */}
      {showLabels && (
        <div className="mb-2 flex justify-between text-sm font-medium text-foreground">
          <span>Progress</span>
          <span>Step {currentStep} of {totalSteps}</span>
        </div>
      )}
      <Progress 
        value={progressPercentage} 
        className="w-full h-3 bg-muted [&>div]:bg-success" 
        aria-label={`Progress: ${currentStep} of ${totalSteps} steps completed`} 
      />
    </div>
  );
}

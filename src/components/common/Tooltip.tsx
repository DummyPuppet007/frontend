import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  trigger: React.ReactNode; // The trigger can be any React component or JSX
  content: React.ReactNode; // The content can also be any React component or JSX
}

export function TooltipWrapper({ trigger, content }: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>
            {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

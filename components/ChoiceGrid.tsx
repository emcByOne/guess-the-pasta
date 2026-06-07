"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChoiceGridProps {
  choices: string[];
  correctIndex: number;
  selectedIndex: number | null;
  gameState: "playing" | "won" | "lost";
  onChoice: (index: number) => void;
}

export function ChoiceGrid({
  choices,
  correctIndex,
  selectedIndex,
  gameState,
  onChoice,
}: ChoiceGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {choices.map((choice, index) => {
        // Determine base variant
        let variant: "default" | "outline" | "destructive" | "secondary" = "outline";
        
        // Apply custom accent colors using Tailwind utilities
        let customClasses = "";

        if (gameState !== "playing") {
          if (index === correctIndex) {
            // Correct answer gets the accent color
            customClasses = "!bg-accent !text-accent-foreground hover:!bg-accent/90 border-transparent";
          } else if (index === selectedIndex && gameState === "lost") {
            // Wrong guess gets the destructive (red) color
            variant = "destructive";
          } else {
            // Other options get dimmed
            variant = "secondary";
          }
        }

        return (
          <Button
            key={index}
            variant={variant}
            className={cn(
              "h-14 text-base font-medium transition-all",
              customClasses
            )}
            onClick={() => onChoice(index)}
            disabled={gameState !== "playing"}
          >
            {choice}
          </Button>
        );
      })}
    </div>
  );
}
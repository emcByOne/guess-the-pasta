"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, ArrowLeft, Clock, X, Check } from "lucide-react";

interface ResultOverlayProps {
  gameState: "won" | "lost";
  reason?: "wrong" | "timeout";
  correctAnswer: string;
  onAction: () => void;
}

export function ResultOverlay({
  gameState,
  reason,
  correctAnswer,
  onAction,
}: ResultOverlayProps) {
  const isWon = gameState === "won";

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center z-50 rounded-xl animate-in fade-in duration-300">
      <div className="text-center p-6 flex flex-col items-center gap-6">
        
        {/* 1. Status Icon */}
        {isWon ? (
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
             <Check className="w-10 h-10 text-accent" strokeWidth={3} />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
            {reason === "timeout" ? (
               <Clock className="w-10 h-10 text-destructive" />
            ) : (
               <X className="w-10 h-10 text-destructive" strokeWidth={3} />
            )}
          </div>
        )}

        {/* 2. Defeat Information (Correct Answer) */}
        {!isWon && (
          <p className="text-lg font-medium text-foreground">
            <span className="text-accent font-bold">{correctAnswer}</span>
          </p>
        )}

        {/* 3. Action Button (Retry or Next) */}
         <Button
          size="lg"
          className="rounded-full w-16 h-16 p-0 transition-transform hover:scale-105 bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={onAction}
        >
          {/* ArrowLeft points "forward" in RTL layouts */}
          <ArrowLeft className="w-8 h-8" /> 
        </Button>
      </div>
    </div>
  );
}
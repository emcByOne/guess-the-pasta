"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, ArrowLeft, ArrowRight, Clock, X, Check } from "lucide-react";

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
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 rounded-xl animate-in fade-in duration-300">
      <div className="text-center p-6 flex items-center gap-4 mt-100">

        
        {/* 3. Action Button (Retry or Next) */}
         <Button
          size="lg"
          className="rounded-full w-16 h-16 p-0 transition-transform hover:scale-105 bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={onAction}
        >
          {/* ArrowLeft points "forward" in RTL layouts */}
          <ArrowRight className="w-8 h-8" /> 
        </Button>
        
        {/* 1. Status Icon */}
        {isWon ? (
          <div className="w-20 h-20 rounded-full bg-accent/30 flex items-center justify-center">
             <Check className="w-10 h-10 text-accent" strokeWidth={3} />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-destructive/30 flex items-center justify-center">
            {reason === "timeout" ? (
               <Clock className="w-10 h-10 text-destructive" />
            ) : (
               <X className="w-10 h-10 text-destructive" strokeWidth={3} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { ResilientImage } from "@/components/ResilientImage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChoiceGrid } from "@/components/ChoiceGrid";
import { ResultOverlay } from "@/components/ResultOverlay";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Define the shape of our question data
interface Question {
  id: number;
  imageBaseName: string;
  choices: string[];
  correctIndex: number;
}

type GameState = "loading" | "playing" | "won" | "lost";

const TOTAL_TIME = 15; // Seconds per question
const MAX_BLUR = 20; // Maximum blur in pixels

export function GameEngine() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameState, setGameState] = useState<GameState>("loading");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  
  // ✅ FIXED: Moved inside the component where it belongs!
  const [defeatReason, setDefeatReason] = useState<"wrong" | "timeout" | null>(null);

  // 1. Fetch and Shuffle Questions on Mount
  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch("/data/questions.json");
        const data: Question[] = await response.json();
        
        // Fisher-Yates Shuffle Algorithm for true randomness
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setGameState("playing");
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    }
    loadQuestions();
  }, []);

  // 2. Countdown Timer Logic
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState("lost");
          setDefeatReason("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentIndex]);

  // 3. Handle User Choice
  const handleChoice = useCallback((choiceIndex: number) => {
    if (gameState !== "playing") return;
    
    setSelectedChoice(choiceIndex);
    const currentQuestion = questions[currentIndex];
    
    if (choiceIndex === currentQuestion.correctIndex) {
      setGameState("won");
    } else {
      setGameState("lost");
      setDefeatReason("wrong");
    }
  }, [gameState, currentIndex, questions]);

  // 4. Next Question Logic (Always moves forward, resets defeat reason)
  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reshuffle if we reach the end of the deck
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentIndex(0);
    }
    
    // Reset all states for the new question
    setTimeLeft(TOTAL_TIME);
    setSelectedChoice(null);
    setDefeatReason(null);
    setGameState("playing");
  }, [currentIndex, questions]);

  if (gameState === "loading" || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <p className="text-foreground animate-pulse">در حال بارگذاری...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  
  // Dynamic blur calculation
  const blurAmount = gameState === "playing" 
    ? (timeLeft / TOTAL_TIME) * MAX_BLUR 
    : 0;

  // Progress bar value (0 to 100)
  const progressValue = (timeLeft / TOTAL_TIME) * 100;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-2">
          <h1 className="text-l font-bold text-foreground">بازی حدس پاستا 🍝 کارگاه پاستاسازی لوزی</h1>
        <ThemeToggle />
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square">
        <ResilientImage 
          imageName={currentQuestion.imageBaseName} 
          alt="تصویر پاستا"
          className="transition-all duration-500 ease-linear"
          style={{ filter: `blur(${blurAmount}px)` }}
        />
        
        {/* ✅ FIXED: Injecting the new ResultOverlay component */}
        {gameState !== "playing" && (
          <ResultOverlay 
            gameState={gameState as "won" | "lost"}
            reason={defeatReason || undefined}
            correctAnswer={currentQuestion.choices[currentQuestion.correctIndex]}
            onAction={handleNextQuestion}
          />
        )}
      </div>

      {/* Progress Bar */}
      <div className={cn(
        "w-full transition-opacity duration-500",
        gameState !== "playing" && "opacity-0"
      )}>
        <Progress 
          value={progressValue} 
          className="h-3 bg-muted" 
        />
      </div>

      {/* ✅ FIXED: Using the new ChoiceGrid component */}
      <ChoiceGrid
        choices={currentQuestion.choices}
        correctIndex={currentQuestion.correctIndex}
        selectedIndex={selectedChoice}
        gameState={gameState}
        onChoice={handleChoice}
      />
    </div>
  );
}
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface EggAnimationProps {
  type: "fresh" | "rotten";
  onComplete?: () => void;
}

export const EggAnimation = ({ type, onComplete }: EggAnimationProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500",
        isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
      )}
    >
      <div className="relative animate-bounce">
        {type === "fresh" ? (
          <div className="text-8xl drop-shadow-2xl animate-pulse">🥚</div>
        ) : (
          <div className="text-8xl drop-shadow-2xl animate-pulse">🤢</div>
        )}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <p
            className={cn(
              "text-xl font-bold px-4 py-2 rounded-full animate-fade-in",
              type === "fresh"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            )}
          >
            {type === "fresh" ? "Fresh Egg! 🎉" : "Rotten Egg! 💀"}
          </p>
        </div>
      </div>
    </div>
  );
};

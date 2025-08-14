import { useState, useRef, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { RecipeCard } from './RecipeCard';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecipeSwiperProps {
  recipes: Recipe[];
  onLike: (id: string) => void;
}

export function RecipeSwiper({ recipes, onLike }: RecipeSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const touchEndRef = useRef<number>(0);

  const nextRecipe = () => {
    if (isTransitioning || currentIndex >= recipes.length - 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
    
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const prevRecipe = () => {
    if (isTransitioning || currentIndex <= 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
    
    setTimeout(() => setIsTransitioning(false), 400);
  };

  // Touch/Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextRecipe(); // Swipe up - next recipe
    } else if (distance < -minSwipeDistance) {
      prevRecipe(); // Swipe down - previous recipe
    }

    touchStartRef.current = 0;
    touchEndRef.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevRecipe();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextRecipe();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isTransitioning]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Recipe Cards Container */}
      <div
        ref={containerRef}
        className="w-full h-full transition-transform duration-400 ease-out"
        style={{
          transform: `translateY(-${currentIndex * 100}vh)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onLike={onLike}
            isActive={index === currentIndex}
          />
        ))}
      </div>


      {/* Navigation Buttons */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevRecipe}
          disabled={currentIndex <= 0 || isTransitioning}
          className={cn(
            "w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white",
            "hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed",
            "transition-all duration-300"
          )}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={nextRecipe}
          disabled={currentIndex >= recipes.length - 1 || isTransitioning}
          className={cn(
            "w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white",
            "hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed",
            "transition-all duration-300"
          )}
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { Heart, Clock, Users, ChefHat, Utensils, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  onLike: (id: string) => void;
  isActive: boolean;
}

export function RecipeCard({ recipe, onLike, isActive }: RecipeCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-recipe-secondary';
      case 'Medium':
        return 'text-recipe-primary';
      case 'Hard':
        return 'text-recipe-accent';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full h-screen flex-shrink-0 overflow-hidden transition-all duration-500",
        isActive ? "opacity-100 scale-100" : "opacity-80 scale-95"
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={recipe.image}
          alt={recipe.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
        {/* Bottom Section - Recipe Info */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Recipe Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-recipe-secondary" />
              <span>{recipe.cookTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-recipe-secondary" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className={cn("w-4 h-4", recipe.isLiked ? "text-recipe-accent fill-current" : "text-white")} />
              <span>{recipe.likes.toLocaleString()}</span>
            </div>
          </div>

          {/* Recipe Title & Description */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold leading-tight">{recipe.title}</h2>
            <p className="text-base text-white/90 leading-relaxed">{recipe.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onLike(recipe.id)}
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                recipe.isLiked 
                  ? "bg-recipe-accent hover:bg-recipe-accent/90 text-white animate-pulse-warm" 
                  : "bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30"
              )}
            >
              <Heart className={cn("w-4 h-4", recipe.isLiked && "fill-current")} />
              {recipe.isLiked ? 'Liked' : 'Like'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30"
            >
              <Utensils className="w-4 h-4" />
              {showDetails ? 'Hide Recipe' : 'View Recipe'}
            </Button>
          </div>
        </div>
      </div>

      {/* Recipe Details Modal */}
      {showDetails && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-end animate-scale-in">
          <div className="w-full bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">{recipe.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-recipe-primary mb-2">Ingredients</h4>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-2 h-2 bg-recipe-secondary rounded-full mt-2 flex-shrink-0" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-recipe-primary mb-2">Instructions</h4>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="w-6 h-6 bg-recipe-primary text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {index + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, UtensilsCrossed, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MealTypeFilter = 'all' | 'homemade' | 'dine-out';
export type DietaryFilter = string[];

interface RecipeFiltersProps {
  mealTypeFilter: MealTypeFilter;
  dietaryFilter: DietaryFilter;
  onMealTypeChange: (filter: MealTypeFilter) => void;
  onDietaryFilterChange: (filter: DietaryFilter) => void;
}

const dietaryOptions = [
  'vegetarian',
  'vegan', 
  'pescatarian',
  'gluten-free',
  'dairy-free',
  'keto',
  'low-carb'
];

export function RecipeFilters({
  mealTypeFilter,
  dietaryFilter,
  onMealTypeChange,
  onDietaryFilterChange,
}: RecipeFiltersProps) {
  const [showDietary, setShowDietary] = useState(false);

  const toggleDietaryPreference = (preference: string) => {
    const newFilter = dietaryFilter.includes(preference)
      ? dietaryFilter.filter(p => p !== preference)
      : [...dietaryFilter, preference];
    onDietaryFilterChange(newFilter);
  };

  return (
    <div className="absolute top-6 left-6 z-30 flex flex-col gap-3">
      {/* Meal Type Filter */}
      <div className="flex gap-2">
        <Button
          variant={mealTypeFilter === 'homemade' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onMealTypeChange(mealTypeFilter === 'homemade' ? 'all' : 'homemade')}
          className={cn(
            "bg-black/30 backdrop-blur-sm border-white/30 text-white text-xs",
            "hover:bg-white/20",
            mealTypeFilter === 'homemade' && "bg-recipe-primary border-recipe-primary text-white"
          )}
        >
          <ChefHat className="w-3 h-3 mr-1" />
          Homemade
        </Button>
        
        <Button
          variant={mealTypeFilter === 'dine-out' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onMealTypeChange(mealTypeFilter === 'dine-out' ? 'all' : 'dine-out')}
          className={cn(
            "bg-black/30 backdrop-blur-sm border-white/30 text-white text-xs",
            "hover:bg-white/20",
            mealTypeFilter === 'dine-out' && "bg-recipe-primary border-recipe-primary text-white"
          )}
        >
          <UtensilsCrossed className="w-3 h-3 mr-1" />
          Dine Out
        </Button>
      </div>

      {/* Dietary Filter */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDietary(!showDietary)}
          className={cn(
            "bg-black/30 backdrop-blur-sm border-white/30 text-white text-xs w-fit",
            "hover:bg-white/20",
            dietaryFilter.length > 0 && "bg-recipe-primary border-recipe-primary"
          )}
        >
          <Filter className="w-3 h-3 mr-1" />
          Dietary {dietaryFilter.length > 0 && `(${dietaryFilter.length})`}
        </Button>

        {showDietary && (
          <div className="flex flex-wrap gap-1 max-w-48">
            {dietaryOptions.map(option => (
              <Badge
                key={option}
                variant={dietaryFilter.includes(option) ? 'default' : 'outline'}
                className={cn(
                  "text-xs cursor-pointer bg-black/30 backdrop-blur-sm border-white/30 text-white",
                  "hover:bg-white/20",
                  dietaryFilter.includes(option) && "bg-recipe-primary border-recipe-primary text-white"
                )}
                onClick={() => toggleDietaryPreference(option)}
              >
                {option}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
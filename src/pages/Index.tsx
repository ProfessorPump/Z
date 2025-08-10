import { useState, useMemo } from 'react';
import { RecipeSwiper } from '@/components/RecipeSwiper';
import { RecipeFilters, MealTypeFilter, DietaryFilter } from '@/components/RecipeFilters';
import { CountryFilter, CountryFilter as CountryFilterType } from '@/components/CountryFilter';
import { sampleRecipes } from '@/data/recipes';
import { Recipe } from '@/types/recipe';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [mealTypeFilter, setMealTypeFilter] = useState<MealTypeFilter>('all');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>([]);
  const [countryFilter, setCountryFilter] = useState<CountryFilterType>('all');
  const { toast } = useToast();

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Filter by meal type
      if (mealTypeFilter !== 'all' && recipe.mealType !== mealTypeFilter) {
        return false;
      }

      // Filter by country
      if (countryFilter !== 'all' && recipe.country !== countryFilter) {
        return false;
      }

      // Filter by dietary preferences
      if (dietaryFilter.length > 0) {
        return dietaryFilter.every(preference => 
          recipe.dietaryPreferences.includes(preference)
        );
      }

      return true;
    });
  }, [recipes, mealTypeFilter, dietaryFilter, countryFilter]);

  const handleLike = (recipeId: string) => {
    setRecipes(prev => 
      prev.map(recipe => {
        if (recipe.id === recipeId) {
          const newIsLiked = !recipe.isLiked;
          const newLikes = newIsLiked ? recipe.likes + 1 : recipe.likes - 1;
          
          // Show toast notification
          toast({
            title: newIsLiked ? "Recipe liked! ❤️" : "Recipe unliked",
            description: newIsLiked 
              ? `${recipe.title} added to your favorites` 
              : `${recipe.title} removed from favorites`,
            duration: 2000,
          });
          
          return {
            ...recipe,
            isLiked: newIsLiked,
            likes: newLikes
          };
        }
        return recipe;
      })
    );
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <RecipeFilters
        mealTypeFilter={mealTypeFilter}
        dietaryFilter={dietaryFilter}
        onMealTypeChange={setMealTypeFilter}
        onDietaryFilterChange={setDietaryFilter}
      />
      <CountryFilter
        countryFilter={countryFilter}
        onCountryFilterChange={setCountryFilter}
      />
      <RecipeSwiper recipes={filteredRecipes} onLike={handleLike} />
      
      {filteredRecipes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-background/80 backdrop-blur-sm">
          <div className="text-center p-6">
            <h3 className="text-lg font-medium text-foreground mb-2">No recipes found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to discover more recipes</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

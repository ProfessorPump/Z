import { useState } from 'react';
import { RecipeSwiper } from '@/components/RecipeSwiper';
import { sampleRecipes } from '@/data/recipes';
import { Recipe } from '@/types/recipe';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const { toast } = useToast();

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
    <div className="w-full h-screen overflow-hidden">
      <RecipeSwiper recipes={recipes} onLike={handleLike} />
    </div>
  );
};

export default Index;

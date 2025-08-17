import { useParams, useNavigate } from 'react-router-dom';
import { Recipe } from '@/types/recipe';
import { sampleRecipes } from '@/data/recipes';
import { Clock, Users, ChefHat, ArrowLeft, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  
  const recipe = sampleRecipes.find(r => r.id === id);
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Recipe not found</h1>
          <Button onClick={() => navigate('/recipes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image */}
      <div className="relative h-64 sm:h-80">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Navigation Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/recipes')}
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Recipe Title & Stats */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Description & Actions */}
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>
          
          <div className="flex items-center gap-3">
            <Button
              variant={isLiked ? "default" : "outline"}
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-2"
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add to Shopping List
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Overall Ingredients List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-recipe-primary" />
              Ingredients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 bg-recipe-secondary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{ingredient}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cooking Instructions with Integrated Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-recipe-primary" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => {
                // Extract ingredients mentioned in this step (simple keyword matching)
                const stepIngredients = recipe.ingredients.filter(ingredient => {
                  const ingredientKeywords = ingredient.toLowerCase().split(' ');
                  const instructionLower = instruction.toLowerCase();
                  return ingredientKeywords.some(keyword => 
                    keyword.length > 3 && instructionLower.includes(keyword)
                  );
                });

                return (
                  <div key={index} className="space-y-3">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-recipe-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm leading-relaxed">{instruction}</p>
                        
                        {/* Show ingredients used in this step */}
                        {stepIngredients.length > 0 && (
                          <div className="pl-2 border-l-2 border-recipe-secondary/30">
                            <p className="text-xs font-medium text-recipe-primary mb-1">Ingredients for this step:</p>
                            <div className="space-y-1">
                              {stepIngredients.map((ingredient, ingredientIndex) => (
                                <div key={ingredientIndex} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-recipe-secondary rounded-full" />
                                  <span className="text-xs text-muted-foreground">{ingredient}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index < recipe.instructions.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recipe Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recipe Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Country:</span>
                <p className="text-foreground">{recipe.country}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Meal Type:</span>
                <p className="text-foreground capitalize">{recipe.mealType}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Creator:</span>
                <p className="text-foreground">{recipe.creator.name}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Likes:</span>
                <p className="text-foreground">{recipe.likes.toLocaleString()}</p>
              </div>
            </div>
            
            {recipe.dietaryPreferences.length > 0 && (
              <div className="mt-4">
                <span className="font-medium text-muted-foreground text-sm">Dietary Preferences:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipe.dietaryPreferences.map((pref, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
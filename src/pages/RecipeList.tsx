import { useState } from 'react';
import { Heart, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleRecipes } from '@/data/recipes';

const RecipeList = () => {
  const [likedRecipes] = useState(sampleRecipes.filter(recipe => recipe.isLiked));

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Recipes</h1>
      
      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved" className="space-y-4 mt-6">
          {likedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No saved recipes yet</p>
              <p className="text-sm text-muted-foreground">Start liking recipes to save them here</p>
            </div>
          ) : (
            likedRecipes.map(recipe => (
              <Card key={recipe.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-foreground mb-2">{recipe.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{recipe.cookTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{recipe.servings}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={14} fill="currentColor" />
                          <span>{recipe.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="suggested" className="space-y-4 mt-6">
          {sampleRecipes.slice(0, 5).map(recipe => (
            <Card key={recipe.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold text-foreground mb-2">{recipe.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{recipe.cookTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{recipe.servings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipeList;
import { useState } from 'react';
import { Heart, Clock, Users, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { sampleRecipes } from '@/data/recipes';

const RecipeList = () => {
  const [likedRecipes] = useState(sampleRecipes.filter(recipe => recipe.isLiked));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Recipes');

  const categories = [
    'All Recipes',
    'Breakfast',
    'Asian Favorites', 
    'Healthy',
    'Dinner',
    'Fast & Quick',
    'Desserts'
  ];

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto">
      <div className="mb-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">My Recipes</h1>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-4">
            <div className="bg-card border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">Recipe Categories</p>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {selectedCategory !== 'All Recipes' && (
          <div className="mt-3">
            <span className="text-sm text-muted-foreground">Showing: </span>
            <span className="text-sm font-medium text-foreground">{selectedCategory}</span>
          </div>
        )}
      </div>
      
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
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number; // minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  likes: number;
  isLiked: boolean;
  mealType: 'homemade' | 'dine-out';
  dietaryPreferences: string[];
  country: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
}
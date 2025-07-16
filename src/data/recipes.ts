import { Recipe } from '@/types/recipe';
import pastaDish from '@/assets/pasta-dish.jpg';
import pizzaMargherita from '@/assets/pizza-margherita.jpg';
import freshSalad from '@/assets/fresh-salad.jpg';
import chocolateCake from '@/assets/chocolate-cake.jpg';

export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Creamy Chicken Pasta',
    description: 'A rich and creamy pasta dish with perfectly seasoned grilled chicken, fresh herbs, and a silky smooth sauce.',
    image: pastaDish,
    cookTime: 25,
    difficulty: 'Medium',
    servings: 4,
    ingredients: [
      '400g pasta (penne or fettuccine)',
      '2 chicken breasts, sliced',
      '200ml heavy cream',
      '100ml white wine',
      '2 cloves garlic, minced',
      'Fresh basil leaves',
      'Parmesan cheese, grated',
      'Salt and pepper to taste',
      '2 tbsp olive oil'
    ],
    instructions: [
      'Cook pasta according to package instructions until al dente.',
      'Season chicken with salt and pepper, cook in olive oil until golden.',
      'Add garlic to the pan and cook for 1 minute.',
      'Pour in white wine and let it reduce by half.',
      'Add cream and simmer until sauce thickens.',
      'Toss pasta with sauce and top with basil and parmesan.',
      'Serve immediately while hot.'
    ],
    tags: ['pasta', 'chicken', 'creamy', 'dinner'],
    likes: 1247,
    isLiked: false
  },
  {
    id: '2',
    title: 'Classic Margherita Pizza',
    description: 'Authentic Italian pizza with fresh mozzarella, ripe tomatoes, and aromatic basil on a crispy homemade crust.',
    image: pizzaMargherita,
    cookTime: 30,
    difficulty: 'Medium',
    servings: 2,
    ingredients: [
      '300g pizza dough',
      '200g fresh mozzarella, sliced',
      '3 ripe tomatoes, sliced',
      '1/4 cup tomato sauce',
      'Fresh basil leaves',
      '2 tbsp olive oil',
      'Salt and pepper',
      'Semolina flour for dusting'
    ],
    instructions: [
      'Preheat oven to 250°C (482°F).',
      'Roll out pizza dough on floured surface.',
      'Spread tomato sauce evenly on dough.',
      'Add mozzarella slices and tomato slices.',
      'Drizzle with olive oil and season with salt.',
      'Bake for 10-12 minutes until crust is golden.',
      'Top with fresh basil before serving.'
    ],
    tags: ['pizza', 'italian', 'vegetarian', 'classic'],
    likes: 2156,
    isLiked: true
  },
  {
    id: '3',
    title: 'Rainbow Garden Salad',
    description: 'A vibrant and nutritious salad packed with fresh vegetables, creamy avocado, and crunchy nuts.',
    image: freshSalad,
    cookTime: 15,
    difficulty: 'Easy',
    servings: 2,
    ingredients: [
      '4 cups mixed greens',
      '1 cup cherry tomatoes, halved',
      '1 avocado, sliced',
      '1/2 cucumber, diced',
      '1/4 red onion, thinly sliced',
      '1/4 cup walnuts, chopped',
      '2 tbsp olive oil',
      '1 tbsp balsamic vinegar',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Wash and dry all vegetables thoroughly.',
      'Combine mixed greens in a large bowl.',
      'Add cherry tomatoes, cucumber, and red onion.',
      'Top with avocado slices and chopped walnuts.',
      'Whisk olive oil and balsamic vinegar together.',
      'Drizzle dressing over salad just before serving.',
      'Season with salt and pepper to taste.'
    ],
    tags: ['salad', 'healthy', 'vegetarian', 'quick'],
    likes: 892,
    isLiked: false
  },
  {
    id: '4',
    title: 'Molten Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with a molten center, served warm with vanilla ice cream.',
    image: chocolateCake,
    cookTime: 20,
    difficulty: 'Hard',
    servings: 2,
    ingredients: [
      '100g dark chocolate (70%)',
      '50g butter',
      '2 large eggs',
      '30g caster sugar',
      '20g plain flour',
      'Pinch of salt',
      'Butter for ramekins',
      'Cocoa powder for dusting',
      'Vanilla ice cream to serve'
    ],
    instructions: [
      'Preheat oven to 200°C (392°F).',
      'Butter two ramekins and dust with cocoa powder.',
      'Melt chocolate and butter in a double boiler.',
      'Whisk eggs and sugar until pale and thick.',
      'Fold in melted chocolate mixture.',
      'Sift in flour and salt, fold gently.',
      'Divide between ramekins and bake for 12 minutes.',
      'Turn out immediately and serve with ice cream.'
    ],
    tags: ['dessert', 'chocolate', 'warm', 'indulgent'],
    likes: 3421,
    isLiked: true
  }
];
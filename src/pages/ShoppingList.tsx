import { useState } from 'react';
import { Plus, Check, X, ShoppingCart, ChevronDown, ScanLine, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  category: string;
  source: 'recipe' | 'manual'; // Track if item is from recipe or manually added
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Fresh basil', completed: false, category: 'Produce', source: 'recipe' },
    { id: '2', name: 'Mozzarella cheese', completed: true, category: 'Dairy', source: 'recipe' },
    { id: '3', name: 'San Marzano tomatoes', completed: false, category: 'Canned Goods', source: 'recipe' },
    { id: '4', name: 'Extra virgin olive oil', completed: false, category: 'Oils & Condiments', source: 'recipe' },
    { id: '5', name: 'Paper towels', completed: false, category: 'Household', source: 'manual' },
    { id: '6', name: 'Apples', completed: false, category: 'Produce', source: 'manual' },
  ]);
  const [newItem, setNewItem] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Lists');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const shoppingCategories = [
    'Produce',
    'Meat & Seafood', 
    'Dairy',
    'Bakery',
    'Frozen',
    'Canned Goods',
    'Dry Goods',
    'Oils & Condiments',
    'Spices & Herbs',
    'Beverages',
    'Snacks',
    'Household',
    'Other'
  ];

  const addItem = (category: string = 'Other') => {
    if (newItem.trim()) {
      setItems(prev => [
        ...prev,
        { 
          id: Date.now().toString(), 
          name: newItem.trim(), 
          completed: false, 
          category, 
          source: 'manual' 
        }
      ]);
      setNewItem('');
    }
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const simulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate scanning delay
    setTimeout(() => {
      const products = [
        'Organic Milk',
        'Whole Wheat Bread',
        'Free Range Eggs',
        'Greek Yogurt',
        'Bananas',
        'Chicken Breast',
        'Brown Rice',
        'Olive Oil'
      ];
      
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      setScanResult(randomProduct);
      setIsScanning(false);
    }, 2000);
  };

  const addScannedItem = () => {
    if (scanResult) {
      addItemByName(scanResult);
      setScanResult(null);
    }
  };

  const addItemByName = (itemName: string, category: string = 'Other') => {
    setItems(prev => [
      ...prev,
      { 
        id: Date.now().toString(), 
        name: itemName, 
        completed: false, 
        category, 
        source: 'manual' 
      }
    ]);
  };

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(false);
  };

  const recipeItems = items.filter(item => item.source === 'recipe');
  const manualItems = items.filter(item => item.source === 'manual');
  
  // Group items by category for organized shopping
  const groupItemsByCategory = (itemsList: ShoppingItem[]) => {
    const grouped = itemsList.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
    
    // Sort categories by predefined order
    const sortedCategories = shoppingCategories.filter(cat => grouped[cat]);
    return sortedCategories.map(category => ({
      category,
      items: grouped[category].sort((a, b) => a.name.localeCompare(b.name))
    }));
  };

  const renderCategorySection = (categoryData: {category: string, items: ShoppingItem[]}, isRecipe: boolean) => {
    const uncompleted = categoryData.items.filter(item => !item.completed);
    const completed = categoryData.items.filter(item => item.completed);
    
    if (uncompleted.length === 0 && completed.length === 0) return null;

    return (
      <div key={categoryData.category} className="mb-4">
        <h3 className={`text-sm font-semibold mb-2 px-2 py-1 rounded-md inline-block ${
          isRecipe 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'bg-secondary/20 text-secondary border border-secondary/30'
        }`}>
          [{categoryData.category}]
        </h3>
        <div className="space-y-2 ml-4">
          {/* Uncompleted items */}
          {uncompleted.map(item => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <span className="flex-1 text-foreground">{item.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Completed items */}
          {completed.map(item => (
            <Card key={item.id} className="opacity-60">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <span className="flex-1 text-muted-foreground line-through">
                    {item.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Shopping List</h1>
        <p className="text-sm text-muted-foreground mt-1">Organized by category for easier shopping</p>
      </div>
      
      <div className="space-y-6">
        {/* Add new item */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add grocery item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="flex-1"
              />
              <Button onClick={() => addItem()} size="icon">
                <Plus size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scanner Section */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Product Scanner</h3>
              
              {!scanResult && !isScanning && (
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={simulateScan}
                      className="w-full"
                    >
                      <ScanLine className="mr-2 h-4 w-4" />
                      Start Scanner
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Upload from Gallery
                    </Button>
                  </div>
                  
                  <Alert>
                    <AlertDescription className="text-sm text-center">
                      Point your camera at a product barcode to scan, or upload an image from your gallery.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {isScanning && (
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <div className="w-32 h-32 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                      <ScanLine className="h-12 w-12 text-primary animate-bounce" />
                    </div>
                  </div>
                  <p className="text-muted-foreground">Scanning product...</p>
                </div>
              )}

              {scanResult && !isScanning && (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Product Found:</h4>
                    <p className="text-lg text-primary font-medium">{scanResult}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={addScannedItem}
                      className="flex-1"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add to List
                    </Button>
                    <Button 
                      onClick={resetScan}
                      variant="outline"
                      className="flex-1"
                    >
                      Scan Another
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recipe Items Section */}
        {recipeItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Rezept Zutaten</h2>
              <div className="bg-primary/20 text-primary border border-primary/30 px-2 py-1 rounded-md text-xs font-medium">
                {recipeItems.filter(item => !item.completed).length} von {recipeItems.length}
              </div>
            </div>
            {groupItemsByCategory(recipeItems).map(categoryData => 
              renderCategorySection(categoryData, true)
            )}
          </div>
        )}

        {/* Manual Items Section */}
        {manualItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Manuell Hinzugefügt</h2>
              <div className="bg-secondary/20 text-secondary border border-secondary/30 px-2 py-1 rounded-md text-xs font-medium">
                {manualItems.filter(item => !item.completed).length} von {manualItems.length}
              </div>
            </div>
            {groupItemsByCategory(manualItems).map(categoryData => 
              renderCategorySection(categoryData, false)
            )}
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your shopping list is empty</p>
            <p className="text-sm text-muted-foreground">Add items to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
import { useState } from 'react';
import { Plus, Check, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Fresh basil', completed: false },
    { id: '2', name: 'Mozzarella cheese', completed: true },
    { id: '3', name: 'San Marzano tomatoes', completed: false },
    { id: '4', name: 'Extra virgin olive oil', completed: false },
  ]);
  const [newItem, setNewItem] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Lists');

  const categories = [
    'All Lists',
    'Groceries',
    'Weekly Essentials',
    'Party Planning',
    'Meal Prep',
    'Pantry Staples',
    'Fresh Produce'
  ];

  const addItem = () => {
    if (newItem.trim()) {
      setItems(prev => [
        ...prev,
        { id: Date.now().toString(), name: newItem.trim(), completed: false }
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

  const pendingItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto">
      <div className="mb-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Shopping List</h1>
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
              <p className="text-sm font-medium text-muted-foreground mb-3">Shopping Lists</p>
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
        
        {selectedCategory !== 'All Lists' && (
          <div className="mt-3">
            <span className="text-sm text-muted-foreground">Current list: </span>
            <span className="text-sm font-medium text-foreground">{selectedCategory}</span>
          </div>
        )}
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
              <Button onClick={addItem} size="icon">
                <Plus size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending items */}
        {pendingItems.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              To Buy ({pendingItems.length})
            </h2>
            <div className="space-y-2">
              {pendingItems.map(item => (
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
            </div>
          </div>
        )}

        {/* Completed items */}
        {completedItems.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-muted-foreground mb-3">
              Completed ({completedItems.length})
            </h2>
            <div className="space-y-2">
              {completedItems.map(item => (
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
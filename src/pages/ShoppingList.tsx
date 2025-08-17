import { useState } from 'react';
import { Plus, Check, X, ShoppingCart, ChevronDown, ScanLine, Camera, List, Trash2, Edit2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  category: string;
  source: 'recipe' | 'manual'; // Track if item is from recipe or manually added
}

interface ShoppingListData {
  id: string;
  name: string;
  items: ShoppingItem[];
}

const ShoppingList = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingListData[]>([
    {
      id: '1',
      name: 'Wocheneinkauf',
      items: [
        { id: '1', name: 'Fresh basil', completed: false, category: 'Produce', source: 'recipe' },
        { id: '2', name: 'Mozzarella cheese', completed: true, category: 'Dairy', source: 'recipe' },
        { id: '3', name: 'San Marzano tomatoes', completed: false, category: 'Canned Goods', source: 'recipe' },
        { id: '4', name: 'Extra virgin olive oil', completed: false, category: 'Oils & Condiments', source: 'recipe' },
        { id: '5', name: 'Paper towels', completed: false, category: 'Household', source: 'manual' },
        { id: '6', name: 'Apples', completed: false, category: 'Produce', source: 'manual' },
      ]
    },
    {
      id: '2',
      name: 'Party Einkauf',
      items: [
        { id: '7', name: 'Chips', completed: false, category: 'Snacks', source: 'manual' },
        { id: '8', name: 'Bier', completed: false, category: 'Beverages', source: 'manual' },
      ]
    }
  ]);
  const [currentListId, setCurrentListId] = useState('1');
  const [newItem, setNewItem] = useState('');
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [categoryOrder, setCategoryOrder] = useState<{[listId: string]: string[]}>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentList = shoppingLists.find(list => list.id === currentListId) || shoppingLists[0];
  const items = currentList?.items || [];

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
      setShoppingLists(prev => prev.map(list => 
        list.id === currentListId 
          ? {
              ...list,
              items: [
                ...list.items,
                { 
                  id: Date.now().toString(), 
                  name: newItem.trim(), 
                  completed: false, 
                  category, 
                  source: 'manual' 
                }
              ]
            }
          : list
      ));
      setNewItem('');
    }
  };

  const toggleItem = (id: string) => {
    setShoppingLists(prev => prev.map(list => 
      list.id === currentListId 
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === id ? { ...item, completed: !item.completed } : item
            )
          }
        : list
    ));
  };

  const removeItem = (id: string) => {
    setShoppingLists(prev => prev.map(list => 
      list.id === currentListId 
        ? {
            ...list,
            items: list.items.filter(item => item.id !== id)
          }
        : list
    ));
  };

  const createNewList = () => {
    if (newListName.trim()) {
      const newList: ShoppingListData = {
        id: Date.now().toString(),
        name: newListName.trim(),
        items: []
      };
      setShoppingLists(prev => [...prev, newList]);
      setCurrentListId(newList.id);
      setNewListName('');
      setIsCreatingList(false);
    }
  };

  const deleteList = (listId: string) => {
    if (shoppingLists.length > 1) {
      setShoppingLists(prev => prev.filter(list => list.id !== listId));
      if (currentListId === listId) {
        setCurrentListId(shoppingLists.find(list => list.id !== listId)?.id || shoppingLists[0].id);
      }
    }
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
    setShoppingLists(prev => prev.map(list => 
      list.id === currentListId 
        ? {
            ...list,
            items: [
              ...list.items,
              { 
                id: Date.now().toString(), 
                name: itemName, 
                completed: false, 
                category, 
                source: 'manual' 
              }
            ]
          }
        : list
    ));
  };

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(false);
  };

  const recipeItems = items.filter(item => item.source === 'recipe');
  const manualItems = items.filter(item => item.source === 'manual');
  
  // Handle drag end for category reordering
  const handleDragEnd = (event: DragEndEvent, isRecipe: boolean) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const sectionKey = `${currentListId}-${isRecipe ? 'recipe' : 'manual'}`;
    const currentOrder = categoryOrder[sectionKey] || [];
    const itemsList = isRecipe ? recipeItems : manualItems;
    const categories = groupItemsByCategory(itemsList).map(c => c.category);
    
    const oldIndex = currentOrder.indexOf(active.id as string) !== -1 
      ? currentOrder.indexOf(active.id as string)
      : categories.indexOf(active.id as string);
    const newIndex = currentOrder.indexOf(over.id as string) !== -1 
      ? currentOrder.indexOf(over.id as string)
      : categories.indexOf(over.id as string);

    const orderedCategories = currentOrder.length > 0 ? currentOrder : categories;
    const newOrder = arrayMove(orderedCategories, oldIndex, newIndex);

    setCategoryOrder(prev => ({
      ...prev,
      [sectionKey]: newOrder
    }));
  };

  // Group items by category for organized shopping
  const groupItemsByCategory = (itemsList: ShoppingItem[], isRecipe: boolean = false) => {
    const grouped = itemsList.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
    
    const sectionKey = `${currentListId}-${isRecipe ? 'recipe' : 'manual'}`;
    const savedOrder = categoryOrder[sectionKey];
    
    // Sort categories by saved order or predefined order
    const availableCategories = shoppingCategories.filter(cat => grouped[cat]);
    const sortedCategories = savedOrder 
      ? savedOrder.filter(cat => grouped[cat])
      : availableCategories;
    
    return sortedCategories.map(category => ({
      category,
      items: grouped[category].sort((a, b) => a.name.localeCompare(b.name))
    }));
  };

  // Sortable Category Component
  const SortableCategory = ({ categoryData, isRecipe }: { categoryData: {category: string, items: ShoppingItem[]}, isRecipe: boolean }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: categoryData.category });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const uncompleted = categoryData.items.filter(item => !item.completed);
    const completed = categoryData.items.filter(item => item.completed);
    
    if (uncompleted.length === 0 && completed.length === 0) return null;

    return (
      <div ref={setNodeRef} style={style} className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
          <h3 className={`text-sm font-semibold px-2 py-1 rounded-md inline-block ${
            isRecipe 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'bg-secondary/20 text-secondary border border-secondary/30'
          }`}>
            [{categoryData.category}]
          </h3>
        </div>
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
        <h1 className="text-2xl font-bold text-foreground">Shopping Lists</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage multiple shopping lists</p>
      </div>

      {/* List Management Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Current List:</span>
            </div>
            
            <div className="flex gap-2">
              <Select value={currentListId} onValueChange={setCurrentListId}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shoppingLists.map(list => (
                    <SelectItem key={list.id} value={list.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{list.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({list.items.filter(item => !item.completed).length} items)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {shoppingLists.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteList(currentListId)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            {/* Create New List */}
            {!isCreatingList ? (
              <Button
                variant="outline"
                onClick={() => setIsCreatingList(true)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Neue Liste erstellen
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Liste Name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createNewList()}
                  className="flex-1"
                />
                <Button onClick={createNewList} size="icon">
                  <Check size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    setIsCreatingList(false);
                    setNewListName('');
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
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
                  <Button 
                    onClick={simulateScan}
                    className="w-full"
                  >
                    <ScanLine className="mr-2 h-4 w-4" />
                    Start Scanner
                  </Button>
                  
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, true)}
            >
              <SortableContext
                items={groupItemsByCategory(recipeItems, true).map(c => c.category)}
                strategy={verticalListSortingStrategy}
              >
                {groupItemsByCategory(recipeItems, true).map(categoryData => 
                  <SortableCategory key={categoryData.category} categoryData={categoryData} isRecipe={true} />
                )}
              </SortableContext>
            </DndContext>
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, false)}
            >
              <SortableContext
                items={groupItemsByCategory(manualItems, false).map(c => c.category)}
                strategy={verticalListSortingStrategy}
              >
                {groupItemsByCategory(manualItems, false).map(categoryData => 
                  <SortableCategory key={categoryData.category} categoryData={categoryData} isRecipe={false} />
                )}
              </SortableContext>
            </DndContext>
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
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ingredient, Recipe } from '../types';

interface StoreContextType {
  ingredients: Ingredient[];
  recipes: Recipe[];
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (id: string, ingredient: Omit<Ingredient, 'id'>) => void;
  deleteIngredient: (id: string) => void;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, recipe: Omit<Recipe, 'id'>) => void;
  deleteRecipe: (id: string) => void;
}

const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Pan de Hotdog', price: 35, quantity: 10, unit: 'pz' },
  { id: '2', name: 'Salchicha', price: 80, quantity: 1, unit: 'kg' },
  { id: '3', name: 'Carne de Hamburguesa', price: 120, quantity: 1, unit: 'kg' },
  { id: '4', name: 'Queso Amarillo', price: 45, quantity: 500, unit: 'g' },
  { id: '5', name: 'Mayonesa', price: 60, quantity: 1, unit: 'L' },
];

const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Hotdog Clásico',
    category: 'Hotdogs',
    salePrice: 35,
    ingredients: [
      { id: 'i1', ingredientId: '1', quantity: 1, unit: 'pz' },
      { id: 'i2', ingredientId: '2', quantity: 100, unit: 'g' },
      { id: 'i3', ingredientId: '5', quantity: 15, unit: 'ml' },
    ]
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('ff_ingredients');
    return saved ? JSON.parse(saved) : INITIAL_INGREDIENTS;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('ff_recipes');
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
  });

  useEffect(() => {
    localStorage.setItem('ff_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('ff_recipes', JSON.stringify(recipes));
  }, [recipes]);

  const addIngredient = (ingredient: Omit<Ingredient, 'id'>) => {
    setIngredients([...ingredients, { ...ingredient, id: Math.random().toString(36).substring(2, 9) }]);
  };

  const updateIngredient = (id: string, updatedIngredient: Omit<Ingredient, 'id'>) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...updatedIngredient, id } : ing));
  };

  const deleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    setRecipes([...recipes, { ...recipe, id: Math.random().toString(36).substring(2, 9) }]);
  };

  const updateRecipe = (id: string, updatedRecipe: Omit<Recipe, 'id'>) => {
    setRecipes(recipes.map(rec => rec.id === id ? { ...updatedRecipe, id } : rec));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(recipes.filter(rec => rec.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      ingredients, recipes,
      addIngredient, updateIngredient, deleteIngredient,
      addRecipe, updateRecipe, deleteRecipe
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export type UnitCategory = 'mass' | 'volume' | 'unit';
export type Unit = 'kg' | 'g' | 'L' | 'ml' | 'pz';

export const UNIT_CATEGORIES: Record<Unit, UnitCategory> = {
  kg: 'mass',
  g: 'mass',
  L: 'volume',
  ml: 'volume',
  pz: 'unit',
};

export const UNIT_LABELS: Record<Unit, string> = {
  kg: 'Kilogramos (kg)',
  g: 'Gramos (g)',
  L: 'Litros (L)',
  ml: 'Mililitros (ml)',
  pz: 'Piezas (pz)',
};

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: Unit;
}

export interface RecipeIngredient {
  id: string;
  ingredientId: string;
  quantity: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  ingredients: RecipeIngredient[];
  salePrice: number;
}

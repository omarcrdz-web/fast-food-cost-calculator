import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Utensils, TrendingUp, DollarSign } from 'lucide-react';
import { convertToBase, getBaseUnit } from '../utils';

export const Dashboard: React.FC = () => {
  const { ingredients, recipes } = useStore();

  const totalIngredients = ingredients.length;
  const totalRecipes = recipes.length;

  // Calculate average cost of recipes
  const calculateRecipeCost = (recipe: any) => {
    let totalCost = 0;
    recipe.ingredients.forEach((ri: any) => {
      const ingredient = ingredients.find(i => i.id === ri.ingredientId);
      if (ingredient) {
        const ingBaseQty = convertToBase(ingredient.quantity, ingredient.unit);
        const recBaseQty = convertToBase(ri.quantity, ri.unit);
        const costPerBase = ingredient.price / ingBaseQty;
        totalCost += costPerBase * recBaseQty;
      }
    });
    return totalCost;
  };

  const totalCostAllRecipes = recipes.reduce((sum, recipe) => sum + calculateRecipeCost(recipe), 0);
  const avgRecipeCost = totalRecipes > 0 ? totalCostAllRecipes / totalRecipes : 0;

  const stats = [
    {
      label: 'Total Ingredientes',
      value: totalIngredients,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    {
      label: 'Total Recetas',
      value: totalRecipes,
      icon: Utensils,
      color: 'text-emerald-500',
      bg: 'bg-emerald-100',
    },
    {
      label: 'Costo Promedio Receta',
      value: `$${avgRecipeCost.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-amber-500',
      bg: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-slate-500 mt-1">Resumen de tu negocio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recetas Recientes</h3>
        {recipes.length === 0 ? (
          <p className="text-slate-500 text-sm">No hay recetas registradas.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recipes.slice(0, 5).map(recipe => {
              const cost = calculateRecipeCost(recipe);
              const profit = recipe.salePrice - cost;
              const margin = recipe.salePrice > 0 ? (profit / recipe.salePrice) * 100 : 0;

              return (
                <div key={recipe.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{recipe.name}</p>
                    <p className="text-sm text-slate-500">{recipe.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">Costo: ${cost.toFixed(2)}</p>
                    <p className={`text-sm font-medium ${margin >= 50 ? 'text-emerald-500' : margin >= 30 ? 'text-amber-500' : 'text-red-500'}`}>
                      Margen: {margin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

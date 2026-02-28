import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Edit2, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { UNIT_LABELS, Unit, RecipeIngredient } from '../types';
import { convertToBase, generateId } from '../utils';

export const Recipes: React.FC = () => {
  const { recipes, ingredients, addRecipe, updateRecipe, deleteRecipe } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    salePrice: 0,
    recipeIngredients: [] as RecipeIngredient[],
  });

  const filteredRecipes = recipes.filter(rec => 
    rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateRecipeCost = (recipeIngredients: RecipeIngredient[]) => {
    let totalCost = 0;
    recipeIngredients.forEach((ri) => {
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

  const handleOpenModal = (recipe?: any) => {
    if (recipe) {
      setEditingId(recipe.id);
      setFormData({
        name: recipe.name,
        category: recipe.category,
        salePrice: recipe.salePrice,
        recipeIngredients: [...recipe.ingredients],
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', category: '', salePrice: 0, recipeIngredients: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipeData = {
      name: formData.name,
      category: formData.category,
      salePrice: formData.salePrice,
      ingredients: formData.recipeIngredients,
    };

    if (editingId) {
      updateRecipe(editingId, recipeData);
    } else {
      addRecipe(recipeData);
    }
    setIsModalOpen(false);
  };

  const addRecipeIngredient = () => {
    if (ingredients.length === 0) return;
    const firstIng = ingredients[0];
    setFormData({
      ...formData,
      recipeIngredients: [
        ...formData.recipeIngredients,
        { id: generateId(), ingredientId: firstIng.id, quantity: 1, unit: firstIng.unit }
      ]
    });
  };

  const updateRecipeIngredient = (id: string, field: keyof RecipeIngredient, value: any) => {
    setFormData({
      ...formData,
      recipeIngredients: formData.recipeIngredients.map(ri => 
        ri.id === id ? { ...ri, [field]: value } : ri
      )
    });
  };

  const removeRecipeIngredient = (id: string) => {
    setFormData({
      ...formData,
      recipeIngredients: formData.recipeIngredients.filter(ri => ri.id !== id)
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Recetas</h2>
          <p className="text-slate-500 mt-1">Calcula el costo de tus platillos.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Nueva Receta</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar receta o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRecipes.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No se encontraron recetas.
            </div>
          ) : (
            filteredRecipes.map((recipe) => {
              const cost = calculateRecipeCost(recipe.ingredients);
              const profit = recipe.salePrice - cost;
              const margin = recipe.salePrice > 0 ? (profit / recipe.salePrice) * 100 : 0;
              const isExpanded = expandedRecipeId === recipe.id;

              return (
                <div key={recipe.id} className="group">
                  <div 
                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                    onClick={() => toggleExpand(recipe.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-slate-900">{recipe.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {recipe.category}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-6 text-sm">
                        <div className="text-slate-500">
                          Costo: <span className="font-semibold text-slate-900">${cost.toFixed(2)}</span>
                        </div>
                        <div className="text-slate-500">
                          Precio Venta: <span className="font-semibold text-slate-900">${recipe.salePrice.toFixed(2)}</span>
                        </div>
                        <div className="text-slate-500">
                          Ganancia: <span className={`font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            ${profit.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-slate-500">
                          Margen: <span className={`font-semibold ${margin >= 50 ? 'text-emerald-600' : margin >= 30 ? 'text-amber-500' : 'text-red-500'}`}>
                            {margin.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenModal(recipe)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteRecipe(recipe.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Ingredients List */}
                  {isExpanded && (
                    <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Ingredientes de la receta</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recipe.ingredients.map((ri) => {
                          const ingredient = ingredients.find(i => i.id === ri.ingredientId);
                          if (!ingredient) return null;
                          
                          const ingBaseQty = convertToBase(ingredient.quantity, ingredient.unit);
                          const recBaseQty = convertToBase(ri.quantity, ri.unit);
                          const costPerBase = ingredient.price / ingBaseQty;
                          const itemCost = costPerBase * recBaseQty;

                          return (
                            <div key={ri.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                              <div>
                                <p className="font-medium text-slate-900 text-sm">{ingredient.name}</p>
                                <p className="text-xs text-slate-500">{ri.quantity} {UNIT_LABELS[ri.unit]}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900 text-sm">${itemCost.toFixed(2)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="p-6 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? 'Editar Receta' : 'Nueva Receta'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Receta</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Ej. Hamburguesa Doble"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Ej. Hamburguesas"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio de Venta Sugerido ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-slate-900">Ingredientes</h4>
                  <button
                    type="button"
                    onClick={addRecipeIngredient}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Agregar Ingrediente</span>
                  </button>
                </div>

                {formData.recipeIngredients.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 text-sm">Agrega ingredientes a tu receta para calcular el costo.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.recipeIngredients.map((ri, index) => (
                      <div key={ri.id} className="flex items-end gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Ingrediente</label>
                          <select
                            value={ri.ingredientId}
                            onChange={(e) => updateRecipeIngredient(ri.id, 'ingredientId', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                          >
                            {ingredients.map(ing => (
                              <option key={ing.id} value={ing.id}>{ing.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Cantidad</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={ri.quantity}
                            onChange={(e) => updateRecipeIngredient(ri.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Unidad</label>
                          <select
                            value={ri.unit}
                            onChange={(e) => updateRecipeIngredient(ri.id, 'unit', e.target.value as Unit)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                          >
                            {Object.entries(UNIT_LABELS).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRecipeIngredient(ri.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center">
                  <span className="font-medium">Costo Total Estimado:</span>
                  <span className="text-xl font-bold text-emerald-400">
                    ${calculateRecipeCost(formData.recipeIngredients).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                  Guardar Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

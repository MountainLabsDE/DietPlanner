'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Recipe, RecipeResponse, MEAL_TYPES, DIFFICULTY_LEVELS, RecipeFilters } from '@/types/recipe';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

export default function RecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [maxCalories, setMaxCalories] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: RecipeFilters = {
        page: currentPage,
        limit: 20,
      };

      if (search) filters.search = search;
      if (selectedMealType) filters.mealType = selectedMealType;
      if (maxCalories) filters.maxCalories = parseInt(maxCalories);

      const response = await api.getRecipes(filters) as any;
      setRecipes(response.items || []);
      setTotalPages(response.meta?.totalPages || 1);
      setTotal(response.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [currentPage, selectedMealType, maxCalories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadRecipes();
  };

  const getDifficultyColor = (difficulty?: string) => {
    const level = DIFFICULTY_LEVELS.find(l => l.value === parseInt(difficulty || '0'));
    return level?.color || 'bg-gray-400';
  };

  const getMealTypeLabel = (mealType?: string) => {
    const type = MEAL_TYPES.find(t => t.value === mealType);
    return type?.label || mealType;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">🍽️ Explore Recipes</h1>
            <p className="text-lg opacity-90">Discover delicious meals for your diet</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔍 Search Recipes
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🍴 Meal Type
                </label>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                >
                  <option value="">All Meal Types</option>
                  {MEAL_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Calories */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔥 Max Calories
                </label>
                <input
                  type="number"
                  value={maxCalories}
                  onChange={(e) => setMaxCalories(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Search Recipes
            </button>
          </form>

          {/* Results Info */}
          {!loading && !error && recipes.length > 0 && (
            <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
              <p className="text-gray-700 font-medium">
                Showing <span className="text-purple-600 font-bold">{total}</span> recipes
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
            </div>
          )}

          {/* Recipe Grid */}
          {!loading && recipes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => `/recipes/${recipe.id}`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {recipe.images && recipe.images.length > 0 ? (
                      <img
                        src={recipe.images[0]}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                    
                    {/* Meal Type Badge */}
                    {recipe.mealType && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-bold text-white rounded-full bg-purple-600">
                          {getMealTypeLabel(recipe.mealType)}
                        </span>
                      </div>
                    )}

                    {/* Calories Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 text-xs font-bold text-white rounded-full bg-orange-500">
                        {recipe.nutrition.calories} kcal
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                      {recipe.name}
                    </h3>
                    
                    {recipe.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {recipe.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium">
                        ⏱️ {recipe.prepTime} min
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg font-medium">
                        🍽️ {recipe.servings} servings
                      </span>
                      {recipe.difficulty && (
                        <span className={`px-2 py-1 text-white text-xs rounded-lg font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                          {parseInt(recipe.difficulty)}
                        </span>
                      )}
                    </div>

                    {/* Macros */}
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg font-medium">
                        P: {recipe.nutrition.protein}g
                      </span>
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-lg font-medium">
                        C: {recipe.nutrition.carbs}g
                      </span>
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg font-medium">
                        F: {recipe.nutrition.fat}g
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && recipes.length === 0 && !error && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Recipes Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find recipes
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

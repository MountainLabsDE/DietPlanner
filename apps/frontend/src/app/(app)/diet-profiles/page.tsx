'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DietProfile, PREDEFINED_DIET_OPTIONS } from '@/types/diet-profile';
import { ProtectedRoute } from '@/components/protected-route';

export default function DietProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<DietProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPredefined, setShowPredefined] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    loadProfiles();
  }, [page, showPredefined]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDietProfiles(showPredefined, page, limit);
      setProfiles(data.items || []);
      setTotal(data.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load diet profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const profile = profiles.find(p => p.id === id);
      if (!profile) return;
      
      await api.updateDietProfile(id, { isFavorite: !currentFavorite });
      setProfiles(profiles.map(p => 
        p.id === id ? { ...p, isFavorite: !currentFavorite } : p
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update favorite status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this diet profile?')) return;
    
    try {
      await api.deleteDietProfile(id);
      setProfiles(profiles.filter(p => p.id !== id));
      setTotal(total - 1);
    } catch (err: any) {
      setError(err.message || 'Failed to delete diet profile');
    }
  };

  const handleCombine = () => {
    router.push('/diet-profiles/combine');
  };

  const getDietInfo = (profile: DietProfile) => {
    if (profile.predefinedType) {
      return PREDEFINED_DIET_OPTIONS.find((d: any) => d.value === profile.predefinedType);
    }
    return null;
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.back()}
              className="mb-6 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              ← Back
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Diet Profiles</h1>
                <p className="text-purple-100 text-lg">Manage your dietary preferences and constraints</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCombine}
                  className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  🔗 Combine Profiles
                </button>
                <button
                  onClick={() => router.push('/diet-profiles/create')}
                  className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  + Create Profile
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowPredefined(false)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  !showPredefined 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                My Profiles
              </button>
              <button
                onClick={() => setShowPredefined(true)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  showPredefined 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Predefined Profiles
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
              ❌ {error}
            </div>
          ) : profiles.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">🥗</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Diet Profiles Yet</h2>
              <p className="text-gray-600 mb-6">Create your first diet profile to get started with personalized meal planning</p>
              <button
                onClick={() => router.push('/diet-profiles/create')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                Create Your First Profile
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => {
                  const dietInfo = getDietInfo(profile);
                  return (
                    <div key={profile.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <div className={`p-6 ${dietInfo?.color || 'bg-purple-600'} text-white relative`}>
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => handleToggleFavorite(profile.id, !!profile.isFavorite)}
                            className="text-2xl hover:scale-110 transition-transform duration-200"
                          >
                            {profile.isFavorite ? '⭐' : '☆'}
                          </button>
                        </div>
                        <div className="text-4xl mb-2">{dietInfo?.icon || '🥗'}</div>
                        <h3 className="text-2xl font-bold mb-1">{profile.name}</h3>
                        {profile.description && (
                          <p className="text-white/80 text-sm">{profile.description}</p>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {profile.type}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-green-50 rounded-xl p-3 text-center">
                            <div className="text-green-700 font-bold text-lg">
                              {profile.proteinPercentage || 0}%
                            </div>
                            <div className="text-green-600 text-xs">Protein</div>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3 text-center">
                            <div className="text-blue-700 font-bold text-lg">
                              {profile.carbsPercentage || 0}%
                            </div>
                            <div className="text-blue-600 text-xs">Carbs</div>
                          </div>
                          <div className="bg-orange-50 rounded-xl p-3 text-center">
                            <div className="text-orange-700 font-bold text-lg">
                              {profile.fatPercentage || 0}%
                            </div>
                            <div className="text-orange-600 text-xs">Fat</div>
                          </div>
                        </div>

                        {profile.dailyCalorieTarget && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Daily Target</span>
                              <span className="font-semibold text-gray-900">
                                {profile.dailyCalorieTarget} kcal
                              </span>
                            </div>
                          </div>
                        )}

                        {profile.restrictions && profile.restrictions.length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm text-gray-600 mb-2">Restrictions:</div>
                            <div className="flex flex-wrap gap-2">
                              {profile.restrictions.map((restriction, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs"
                                >
                                  {restriction}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-4 mt-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/diet-profiles/${profile.id}`)}
                              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                            >
                              View Details
                            </button>
                            {!showPredefined && (
                              <button
                                onClick={() => router.push(`/diet-profiles/${profile.id}/edit`)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                              >
                                Edit
                              </button>
                            )}
                            {!showPredefined && (
                              <button
                                onClick={() => handleDelete(profile.id)}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500">
                        Created {new Date(profile.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 mb-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${
                      page === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-purple-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          page === p
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${
                      page === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-purple-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}

              <div className="text-center text-gray-500 text-sm mb-8">
                Showing {profiles.length} of {total} profiles
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

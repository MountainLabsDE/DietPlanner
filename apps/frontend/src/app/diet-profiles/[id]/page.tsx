'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { DietProfile, PREDEFINED_DIET_OPTIONS } from '@/types/diet-profile';
import { ProtectedRoute } from '@/components/protected-route';

export default function DietProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState<DietProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadProfile(params.id as string);
    }
  }, [params.id]);

  const loadProfile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDietProfile(id);
      setProfile(data as DietProfile);
    } catch (err: any) {
      setError(err.message || 'Failed to load diet profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;
    if (!confirm('Are you sure you want to delete this profile?')) return;
    
    try {
      await api.deleteDietProfile(profile.id);
      router.push('/diet-profiles');
    } catch (err: any) {
      setError(err.message || 'Failed to delete profile');
    }
  };

  const getDietInfo = () => {
    if (profile?.predefinedType) {
      return PREDEFINED_DIET_OPTIONS.find((d: any) => d.value === profile.predefinedType);
    }
    return null;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
            ❌ {error || 'Profile not found'}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const dietInfo = getDietInfo();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className={`bg-gradient-to-r ${dietInfo?.color || 'from-purple-600 to-pink-600'} text-white p-8 shadow-lg`}>
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.back()}
              className="mb-6 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              ← Back
            </button>
            
            <div className="flex items-start gap-6">
              <div className="text-6xl">{dietInfo?.icon || '🥗'}</div>
              <div className="flex-1">
                <div className="flex items gap-4 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold">{profile.name}</h1>
                  {profile.isFavorite && <div className="text-4xl">⭐</div>}
                </div>
                <p className="text-white/80 text-lg">{profile.description || 'No description'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push(`/diet-profiles/${profile.id}/edit`)}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => router.push('/meal-plans/generate')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Generate Meal Plan
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-colors"
              >
                Delete Profile
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Profile Type</span>
                <span className="font-semibold text-gray-900">{profile.type}</span>
              </div>
              
              {dietInfo && (
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Diet Type</span>
                  <span className="font-semibold text-gray-900">{dietInfo.icon} {dietInfo.label}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Daily Calories</span>
                <span className="font-semibold text-gray-900">{profile.dailyCalorieTarget || 'Not set'} kcal</span>
              </div>

              <div className="py-3 border-b">
                <div className="text-gray-600 mb-4">Macro Ratios</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-700">{profile.proteinPercentage || 0}%</div>
                    <div className="text-green-600">Protein</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-700">{profile.carbsPercentage || 0}%</div>
                    <div className="text-blue-600">Carbs</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-orange-700">{profile.fatPercentage || 0}%</div>
                    <div className="text-orange-600">Fat</div>
                  </div>
                </div>
              </div>

              {profile.restrictions && profile.restrictions.length > 0 && (
                <div className="py-3">
                  <div className="text-gray-600 mb-3">Dietary Restrictions</div>
                  <div className="flex flex-wrap gap-3">
                    {profile.restrictions.map((restriction, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium"
                      >
                        {restriction}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Created Info */}
          <div className="bg-gray-50 rounded-2xl p-6 text-gray-600">
            <div className="flex justify-between">
              <span>Created: {new Date(profile.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(profile.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

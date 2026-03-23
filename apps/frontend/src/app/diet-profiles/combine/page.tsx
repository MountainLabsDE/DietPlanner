'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DietProfile, PROFILE_TYPE_OPTIONS } from '@/types/diet-profile';
import { ProtectedRoute } from '@/components/protected-route';

export default function CombineDietProfilesPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [profiles, setProfiles] = useState<DietProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDietProfiles(true, 1, 100);
      setProfiles(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const toggleProfile = (id: string) => {
    setSelectedProfiles(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Profile name is required');
      return;
    }

    if (selectedProfiles.length < 2) {
      setError('Select at least 2 profiles to combine');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await api.combineDietProfiles(name, selectedProfiles);
      router.push('/diet-profiles');
    } catch (err: any) {
      setSubmitting(false);
      setError(err.message || 'Failed to combine profiles');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-8 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.back()}
              className="mb-6 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              ← Back
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Combine Diet Profiles</h1>
            <p className="text-purple-100 text-lg">Merge multiple dietary preferences into one profile</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 mb-6">
              ❌ {error}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Combined Profile Name */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Combined Profile Name</h2>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Vegan Keto + Paleo"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>

              {profiles.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <div className="text-6xl mb-4">🥗</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">No Profiles Available</h2>
                  <p className="text-gray-600">Create profiles first before combining them</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Select Profiles to Combine ({selectedProfiles.length} selected)
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Choose 2 or more profiles to merge their dietary preferences
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profiles.map((profile) => (
                        <button
                          key={profile.id}
                          type="button"
                          onClick={() => toggleProfile(profile.id)}
                          className={`p-6 rounded-2xl border-2 transition-all text-start ${
                            selectedProfiles.includes(profile.id)
                              ? 'border-purple-600 bg-purple-50 shadow-lg'
                              : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                              {profile.description && (
                                <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
                              )}
                            </div>
                            <div className={`text-2xl ${
                              selectedProfiles.includes(profile.id) ? 'text-purple-600' : 'text-gray-300'
                            }`}>
                              {selectedProfiles.includes(profile.id) ? '✓' : '○'}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium text-gray-900">{profile.type}</span>
                            </div>
                            {profile.dailyCalorieTarget && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Calories:</span>
                                <span className="font-medium text-gray-900">{profile.dailyCalorieTarget}</span>
                              </div>
                            )}
                            <div className="flex gap-4 text-sm">
                              <div className="text-green-600">P: {profile.proteinPercentage || 0}%</div>
                              <div className="text-blue-600">C: {profile.carbsPercentage || 0}%</div>
                              <div className="text-orange-600">F: {profile.fatPercentage || 0}%</div>
                            </div>
                          </div>

                          {profile.restrictions && profile.restrictions.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex flex-wrap gap-2">
                                {profile.restrictions.map((r, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs"
                                  >
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || selectedProfiles.length < 2}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          Combining...
                        </div>
                      ) : 'Combine Profiles'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  DietProfileType,
  PREDEFINED_DIET_OPTIONS,
  RESTRICTION_OPTIONS,
  CALORIE_TARGET_OPTIONS,
  MACRO_COMBINATIONS,
} from '@/types/diet-profile';
import { ProtectedRoute } from '@/components/protected-route';

export default function CreateDietProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<DietProfileType>(DietProfileType.CUSTOM);
  const [predefinedType, setPredefinedType] = useState('');
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState<number>(2000);
  const [customCalorie, setCustomCalorie] = useState('');
  const [proteinPercentage, setProteinPercentage] = useState<number>(30);
  const [carbsPercentage, setCarbsPercentage] = useState<number>(40);
  const [fatPercentage, setFatPercentage] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data: any = {
        type,
        name,
        description,
        restrictions: selectedRestrictions.length > 0 ? selectedRestrictions : undefined,
        dailyCalorieTarget,
        proteinPercentage,
        carbsPercentage,
        fatPercentage,
      };

      if (type === DietProfileType.PREDEFINED && predefinedType) {
        data.predefinedType = predefinedType;
      }

      await api.createDietProfile(data);
      router.push('/diet-profiles');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to create diet profile');
    }
  };

  const toggleRestriction = (restriction: string) => {
    setSelectedRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const setMacroPreset = (preset: typeof MACRO_COMBINATIONS[number]) => {
    setProteinPercentage(preset.protein);
    setCarbsPercentage(preset.carbs);
    setFatPercentage(preset.fat);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Create Diet Profile</h1>
            <p className="text-purple-100 text-lg">Configure your dietary preferences and requirements</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 mb-6">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., My Plant-Based Diet"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Type *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {([
                      { value: DietProfileType.CUSTOM, label: 'Custom Profile', icon: '⚙️', desc: 'Create your own' },
                      { value: DietProfileType.PREDEFINED, label: 'Predefined Diet', icon: '📋', desc: 'Choose from library' },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setType(opt.value)}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          type === opt.value
                            ? 'border-purple-600 bg-purple-50 shadow-lg'
                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                        }`}
                      >
                        <div className="text-4xl mb-2">{opt.icon}</div>
                        <div className="font-semibold text-gray-900">{opt.label}</div>
                        <div className="text-sm text-gray-600">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {type === DietProfileType.PREDEFINED && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Diet Type *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {PREDEFINED_DIET_OPTIONS.map((diet) => (
                        <button
                          key={diet.value}
                          type="button"
                          onClick={() => {
                            setPredefinedType(diet.value);
                            if (diet.value === 'KETO') {
                              setMacroPreset(MACRO_COMBINATIONS[3]);
                            } else {
                              setMacroPreset(MACRO_COMBINATIONS[0]);
                            }
                          }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            predefinedType === diet.value
                              ? 'border-purple-600 shadow-lg'
                              : 'border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          <div className="text-2xl mb-2">{diet.icon}</div>
                          <div className="font-semibold text-gray-900 text-sm">{diet.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{diet.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your dietary goals and preferences..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Dietary Restrictions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {RESTRICTION_OPTIONS.map((restriction) => (
                  <button
                    key={restriction.value}
                    type="button"
                    onClick={() => toggleRestriction(restriction.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedRestrictions.includes(restriction.value)
                        ? 'border-purple-600 bg-purple-50 shadow-lg'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{restriction.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{restriction.label}</div>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-gray-500 text-sm">
                Selected: {selectedRestrictions.length} restrictions
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Calorie Target</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {CALORIE_TARGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setDailyCalorieTarget(opt.value);
                      setCustomCalorie('');
                    }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      dailyCalorieTarget === opt.value && !customCalorie
                        ? 'border-purple-600 bg-purple-50 shadow-lg'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-900">{opt.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-2">{opt.description}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Or Enter Custom Calories</label>
                <input
                  type="number"
                  value={customCalorie}
                  onChange={(e) => {
                    setCustomCalorie(e.target.value);
                    setDailyCalorieTarget(Number(e.target.value));
                  }}
                  placeholder="e.g., 1850"
                  min="1000"
                  max="10000"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Macro Nutrient Ratios</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {MACRO_COMBINATIONS.map((combo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMacroPreset(combo)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      proteinPercentage === combo.protein &&
                      carbsPercentage === combo.carbs &&
                      fatPercentage === combo.fat
                        ? 'border-purple-600 bg-purple-50 shadow-lg'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-3">{combo.name}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-600">Protein:</span>
                        <span className="font-medium">{combo.protein}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Carbs:</span>
                        <span className="font-medium">{combo.carbs}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-600">Fat:</span>
                        <span className="font-medium">{combo.fat}%</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-3">{combo.description}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (%)</label>
                  <input
                    type="number"
                    value={proteinPercentage}
                    onChange={(e) => setProteinPercentage(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (%)</label>
                  <input
                    type="number"
                    value={carbsPercentage}
                    onChange={(e) => setCarbsPercentage(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fat (%)</label>
                  <input
                    type="number"
                    value={fatPercentage}
                    onChange={(e) => setFatPercentage(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div className={`mt-4 text-center text-sm font-semibold ${
                proteinPercentage + carbsPercentage + fatPercentage === 100
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                Total: {proteinPercentage + carbsPercentage + fatPercentage}%
                {proteinPercentage + carbsPercentage + fatPercentage !== 100 && ' (Must equal 100%)'}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || proteinPercentage + carbsPercentage + fatPercentage !== 100}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Creating...
                  </div>
                ) : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}


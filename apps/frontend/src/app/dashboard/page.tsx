'use client';

import { useAuth } from '../../contexts/auth-context';
import { ProtectedRoute } from '../../components/protected-route';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to access your dashboard</p>
      </div>
    }>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-2">
                <span className="text-3xl">PlatePulse</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome back, {user?.firstName}
            </h2>
            <p className="text-xl text-gray-600">
              Ready to start your nutrition journey?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <a
              href="/recipes"
              className="group bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold mb-2">
                Explore Recipes
              </h3>
              <p className="opacity-90">
                Browse delicious recipes with full nutrition info
              </p>
              <div className="mt-4 flex items-center text-sm font-medium opacity-75 group-hover:opacity-100 transition-opacity">
                Click to start
              </div>
            </a>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Diet Profiles
              </h3>
              <p className="text-gray-600">
                Create and manage your diet preferences
              </p>
            </div>

            <a
              href="/meal-plans"
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-pink-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Meal Plans
              </h3>
              <p className="text-gray-600">
                Generate infinite meal plans automatically
              </p>
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-gray-600 font-medium">Meal Plans</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl border-2 border-pink-200">
                <div className="text-4xl font-bold text-pink-600 mb-2">0</div>
                <div className="text-gray-600 font-medium">Diet Profiles</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200">
                <div className="text-4xl font-bold text-orange-600 mb-2">0</div>
                <div className="text-gray-600 font-medium">Recipes</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">0</div>
                <div className="text-gray-600 font-medium">Days Tracked</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

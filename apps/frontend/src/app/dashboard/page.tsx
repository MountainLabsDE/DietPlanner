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
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-accent-light">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary">
                  PlatePulse
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}
            </h2>
            <p className="text-gray-600">
              Ready to start your nutrition journey?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Diet Profiles
              </h3>
              <p className="text-sm text-gray-600">
                Manage your diet preferences
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Meal Plans
              </h3>
              <p className="text-sm text-gray-600">
                Generate infinite meal plans
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-sm text-gray-600">
                Monitor calories and goals
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-gray-600">Meal Plans</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">0</div>
                <div className="text-sm text-gray-600">Diet Profiles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">0</div>
                <div className="text-sm text-gray-600">Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Days Tracked</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

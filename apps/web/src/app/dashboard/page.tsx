'use client';

import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName}!</h2>
          <div className="grid gap-4">
            <div>
              <span className="font-medium">Email:</span> {user?.email}
            </div>
            <div>
              <span className="font-medium">Role:</span>{' '}
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

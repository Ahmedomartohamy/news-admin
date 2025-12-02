import { Link } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../api/auth';
import { ROUTES } from '../utils/constants';
import { toast } from 'sonner';

export const Topbar = () => {
  const { user } = useAuthStore();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome back, {user?.name}</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>

          <Link
            to={ROUTES.CHANGE_PASSWORD}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

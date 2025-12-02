import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderTree,
  Tag,
  MessageSquare,
  Image as ImageIcon,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuthStore } from '../store/authStore';

const navigation = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'Users', href: ROUTES.USERS, icon: Users, adminOnly: true },
  { name: 'Articles', href: ROUTES.ARTICLES, icon: FileText },
  { name: 'Categories', href: ROUTES.CATEGORIES, icon: FolderTree },
  { name: 'Tags', href: ROUTES.TAGS, icon: Tag },
  { name: 'Comments', href: ROUTES.COMMENTS, icon: MessageSquare },
  { name: 'Media', href: ROUTES.MEDIA, icon: ImageIcon },
];

export const Sidebar = () => {
  const { user } = useAuthStore();

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user?.role === 'ADMIN'
  );

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">News Admin</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

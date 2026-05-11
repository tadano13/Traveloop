import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  MapPin, 
  Briefcase, 
  CheckSquare, 
  BookOpen, 
  Users, 
  CreditCard,
  LogOut,
  Plus
} from 'lucide-react';

import { supabase } from '../lib/supabase';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Discovery', icon: Search, path: '/discovery' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Trips', icon: MapPin, path: '/trips' },
    { name: 'Checklist', icon: CheckSquare, path: '/checklist' },
    { name: 'Journal', icon: BookOpen, path: '/journal' },
    { name: 'Community', icon: Users, path: '/community' },
    { name: 'Billing', icon: CreditCard, path: '/billing' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col p-6">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">✈️</div>
        <span className="text-xl font-bold brand text-blue-600">Traveloop</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="pt-6 border-t space-y-4">
        <button 
          onClick={() => navigate('/create-trip')}
          className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Trip
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
}

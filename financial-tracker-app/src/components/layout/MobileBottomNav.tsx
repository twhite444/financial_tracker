import { Home, Wallet, Calendar, Receipt } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/accounts', icon: Wallet, label: 'Accounts' },
  { path: '/payments', icon: Calendar, label: 'Payments' },
  { path: '/transactions', icon: Receipt, label: 'Transactions' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-card border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-gray-600 dark:text-gray-400 hover:text-accent-blue hover:bg-accent-blue/5'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

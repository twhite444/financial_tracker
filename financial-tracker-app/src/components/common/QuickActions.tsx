import { Plus, Receipt, Wallet, LinkIcon, Calendar, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: Receipt, label: 'Add Transaction', action: 'transaction', color: 'bg-blue-500 hover:bg-blue-600' },
  { icon: Wallet, label: 'Add Account', action: 'account', color: 'bg-green-500 hover:bg-green-600' },
  { icon: LinkIcon, label: 'Link Bank', action: 'plaid', color: 'bg-purple-500 hover:bg-purple-600' },
  { icon: Calendar, label: 'Add Payment', action: 'payment', color: 'bg-orange-500 hover:bg-orange-600' },
];

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (action: string) => {
    setIsOpen(false);
    // Navigate to the appropriate page - they'll handle modal opening
    switch (action) {
      case 'transaction':
        navigate('/transactions?action=add');
        break;
      case 'account':
        navigate('/accounts?action=add');
        break;
      case 'plaid':
        navigate('/accounts?action=link');
        break;
      case 'payment':
        navigate('/payments?action=add');
        break;
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-8 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((item, index) => (
          <button
            key={item.action}
            onClick={() => handleAction(item.action)}
            className={`${item.color} text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 transition-all duration-200 hover:shadow-xl hover:scale-105`}
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
            }}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-accent-blue text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

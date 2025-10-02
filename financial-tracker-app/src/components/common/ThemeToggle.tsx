import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="glass-button p-2 relative overflow-hidden group"
      aria-label="Toggle theme"
    >
      <div className={`transition-all duration-300 ${theme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0 absolute'}`}>
        <Moon className="h-5 w-5" />
      </div>
      <div className={`transition-all duration-300 ${theme === 'light' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 absolute'}`}>
        <Sun className="h-5 w-5" />
      </div>
    </button>
  );
}

import { Home, TrendingUp, Settings, AlertCircle, Target, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userName?: string;
  userEmail?: string;
}

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'weekly', icon: TrendingUp, label: 'Weekly Analysis' },
  { id: 'goals', icon: Target, label: 'Goals' },
  { id: 'logs', icon: AlertCircle, label: 'System Logs' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ activeView, onViewChange, userName, userEmail }: SidebarProps) {
  return (
    <div className="fixed left-0 top-14 flex h-[calc(100vh-3.5rem)] w-64 flex-col bg-[#00487C] p-6 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Brace Monitor</h1>
        <p className="text-sm text-white/70 mt-1">Treatment Dashboard</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              activeView === item.id
                ? "bg-white/20 font-medium"
                : "hover:bg-white/10"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{userName ?? 'User'}</p>
            <p className="text-xs text-white/70">{userEmail ?? 'No email'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

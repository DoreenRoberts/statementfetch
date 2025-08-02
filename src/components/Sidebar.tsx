import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  FileText, 
  Upload, 
  Settings, 
  CreditCard,
  Calendar,
  BarChart3,
  Sparkles,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { signOut, user } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'statements', label: 'Statements', icon: FileText },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'scheduler', label: 'Auto-Download', icon: Calendar },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Card className="h-full bg-gradient-to-b from-purple-600 via-purple-700 to-pink-700 border-0 rounded-none">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-white p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">StatementHub</h1>
            <p className="text-purple-200 text-xs">PDF Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-purple-700 shadow-lg hover:bg-gray-50' 
                    : 'text-purple-100 hover:bg-purple-500/50 hover:text-white'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="mt-8 space-y-3">
          <div className="p-4 bg-purple-800/50 rounded-lg">
            <div className="text-center">
              <FileText className="h-8 w-8 text-purple-200 mx-auto mb-2" />
              <p className="text-purple-200 text-sm font-medium">
                3 Statements
              </p>
              <p className="text-purple-300 text-xs">
                Ready to download
              </p>
            </div>
          </div>
          
          <div className="p-3 bg-purple-800/30 rounded-lg">
            <p className="text-purple-200 text-xs mb-2">Signed in as:</p>
            <p className="text-white text-sm font-medium truncate">
              {user?.email}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-purple-200 hover:bg-purple-500/50 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Sidebar;
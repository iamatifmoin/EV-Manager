
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Zap, Map, Plus } from "lucide-react";

interface SidebarProps {
  activeView: 'list' | 'map' | 'add';
  onViewChange: (view: 'list' | 'map' | 'add') => void;
  onAddNew: () => void;
}

export const Sidebar = ({ activeView, onViewChange, onAddNew }: SidebarProps) => {
  const menuItems = [
    { id: 'list' as const, label: 'Charging Stations', icon: Zap },
    { id: 'map' as const, label: 'Map View', icon: Map },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">EV Manager</h1>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        <Button
          onClick={onAddNew}
          className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Station
        </Button>
        
        <div className="pt-4 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                activeView === item.id && "bg-blue-50 text-blue-700 hover:bg-blue-50"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

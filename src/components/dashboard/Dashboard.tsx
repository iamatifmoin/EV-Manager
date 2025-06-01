
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StationList } from "@/components/stations/StationList";
import { MapView } from "@/components/map/MapView";
import { StationForm } from "@/components/stations/StationForm";
import { Station } from "@/hooks/useStations";

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeView, setActiveView] = useState<'list' | 'map' | 'add'>('list');
  const [editingStation, setEditingStation] = useState<Station | null>(null);

  const handleEditStation = (station: Station) => {
    setEditingStation(station);
    setActiveView('add');
  };

  const handleAddNewStation = () => {
    setEditingStation(null);
    setActiveView('add');
  };

  const handleFormClose = () => {
    setEditingStation(null);
    setActiveView('list');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        onAddNew={handleAddNewStation}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        <main className="flex-1 overflow-auto">
          {activeView === 'list' && (
            <StationList onEditStation={handleEditStation} />
          )}
          {activeView === 'map' && <MapView />}
          {activeView === 'add' && (
            <StationForm 
              station={editingStation}
              onClose={handleFormClose}
            />
          )}
        </main>
      </div>
    </div>
  );
};

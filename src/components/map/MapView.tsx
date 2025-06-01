
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Loader2 } from "lucide-react";
import { useStations, Station } from "@/hooks/useStations";

export const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const { data: stations = [], isLoading, error } = useStations();

  useEffect(() => {
    // This is a mock map implementation
    // In a real application, you would integrate with Google Maps, Mapbox, or OpenStreetMap
    if (mapContainer.current && stations.length > 0) {
      console.log("Map would be initialized here with the following stations:", stations);
    }
  }, [stations]);

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading map...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-red-600">Error loading stations</p>
          <p className="text-sm text-gray-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Charging Stations Map</span>
              </CardTitle>
              <CardDescription>
                Interactive map showing all your charging stations
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full pb-6">
              <div 
                ref={mapContainer} 
                className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
                    <p className="text-sm text-gray-600 max-w-sm">
                      This is where your interactive map would be displayed. 
                      Integrate with Google Maps, Mapbox, or OpenStreetMap API.
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {stations.length} stations would be shown as markers
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Station Details Panel */}
        <div className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Station Details</CardTitle>
              <CardDescription>
                Click on a map marker to view station information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedStation ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{selectedStation.name}</h3>
                    <Badge className={getStatusColor(selectedStation.status)}>
                      {selectedStation.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-3 w-3 mr-2" />
                      {selectedStation.location}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div>
                        <span className="text-gray-600">Power:</span>
                        <p className="font-medium">{selectedStation.power_output} kW</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Connector:</span>
                        <p className="font-medium">{selectedStation.connector_type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select a station on the map to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Station List */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">All Stations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{station.name}</h4>
                    <Badge 
                      className={`${getStatusColor(station.status)} text-xs`}
                    >
                      {station.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{station.location}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{station.power_output} kW</span>
                    <span>{station.connector_type}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash, MapPin, Filter, Loader2 } from "lucide-react";
import { useStations, useDeleteStation, Station } from "@/hooks/useStations";

interface StationListProps {
  onEditStation: (station: Station) => void;
}

export const StationList = ({ onEditStation }: StationListProps) => {
  const { data: stations = [], isLoading, error } = useStations();
  const deleteStation = useDeleteStation();
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [connectorFilter, setConnectorFilter] = useState<string>("all");

  // Filter stations based on search and filters
  useEffect(() => {
    let filtered = stations.filter(station =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(station => station.status === statusFilter);
    }

    if (connectorFilter !== "all") {
      filtered = filtered.filter(station => station.connector_type === connectorFilter);
    }

    setFilteredStations(filtered);
  }, [stations, searchTerm, statusFilter, connectorFilter]);

  const handleDeleteStation = (id: string) => {
    deleteStation.mutate(id);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading stations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-center space-y-2">
          <p className="text-red-600">Error loading stations</p>
          <p className="text-sm text-gray-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Charging Stations</h3>
          <p className="text-sm text-gray-600">{filteredStations.length} stations found</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={connectorFilter} onValueChange={setConnectorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by connector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Connectors</SelectItem>
                  <SelectItem value="CCS">CCS</SelectItem>
                  <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                  <SelectItem value="Tesla Supercharger">Tesla Supercharger</SelectItem>
                  <SelectItem value="Type 2">Type 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station) => (
          <Card key={station.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {station.location}
                  </div>
                </div>
                <Badge className={getStatusColor(station.status)}>
                  {station.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Power Output:</span>
                  <p className="font-medium">{station.power_output} kW</p>
                </div>
                <div>
                  <span className="text-gray-600">Connector:</span>
                  <p className="font-medium">{station.connector_type}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEditStation(station)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteStation(station.id)}
                  disabled={deleteStation.isPending}
                >
                  {deleteStation.isPending ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Trash className="h-3 w-3 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStations.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No charging stations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

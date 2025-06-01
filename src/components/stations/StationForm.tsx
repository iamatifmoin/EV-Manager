
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCreateStation, useUpdateStation, Station } from "@/hooks/useStations";

interface StationFormProps {
  station?: Station | null;
  onClose: () => void;
}

export const StationForm = ({ station, onClose }: StationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    latitude: 0,
    longitude: 0,
    status: "Active" as "Active" | "Inactive",
    power_output: 50,
    connector_type: "CCS"
  });

  const createStation = useCreateStation();
  const updateStation = useUpdateStation();

  const isLoading = createStation.isPending || updateStation.isPending;

  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name,
        location: station.location,
        latitude: station.latitude,
        longitude: station.longitude,
        status: station.status,
        power_output: station.power_output,
        connector_type: station.connector_type
      });
    }
  }, [station]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (station) {
        await updateStation.mutateAsync({
          id: station.id,
          ...formData
        });
      } else {
        await createStation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onClose} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stations
        </Button>
        <h3 className="text-2xl font-bold text-gray-900">
          {station ? "Edit Station" : "Add New Station"}
        </h3>
        <p className="text-gray-600">
          {station ? "Update the station information below." : "Fill in the details to add a new charging station."}
        </p>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Station Details</CardTitle>
          <CardDescription>
            Enter the charging station information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Station Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Downtown Charging Hub"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location Address</Label>
              <Input
                id="location"
                placeholder="e.g., 123 Main St, City Center"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 40.7128"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g., -74.0060"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="powerOutput">Power Output (kW)</Label>
                <Input
                  id="powerOutput"
                  type="number"
                  placeholder="e.g., 150"
                  value={formData.power_output}
                  onChange={(e) => handleInputChange('power_output', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="connectorType">Connector Type</Label>
                <Select 
                  value={formData.connector_type} 
                  onValueChange={(value) => handleInputChange('connector_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CCS">CCS</SelectItem>
                    <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                    <SelectItem value="Tesla Supercharger">Tesla Supercharger</SelectItem>
                    <SelectItem value="Type 2">Type 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {station ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  station ? "Update Station" : "Create Station"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

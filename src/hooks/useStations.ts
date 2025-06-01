
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Station {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'Active' | 'Inactive';
  power_output: number;
  connector_type: string;
  created_at?: string;
  updated_at?: string;
}

export const useStations = () => {
  return useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      console.log('Fetching stations from Supabase...');
      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stations:', error);
        throw error;
      }

      console.log('Stations fetched successfully:', data);
      return data as Station[];
    },
  });
};

export const useCreateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (station: Omit<Station, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating station:', station);
      const { data, error } = await supabase
        .from('stations')
        .insert([station])
        .select()
        .single();

      if (error) {
        console.error('Error creating station:', error);
        throw error;
      }

      console.log('Station created successfully:', data);
      return data as Station;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Station Created",
        description: "A new charging station has been added successfully.",
      });
    },
    onError: (error) => {
      console.error('Create station mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to create station. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...station }: Partial<Station> & { id: string }) => {
      console.log('Updating station:', id, station);
      const { data, error } = await supabase
        .from('stations')
        .update(station)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating station:', error);
        throw error;
      }

      console.log('Station updated successfully:', data);
      return data as Station;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Station Updated",
        description: "The charging station has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Update station mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to update station. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting station:', id);
      const { error } = await supabase
        .from('stations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting station:', error);
        throw error;
      }

      console.log('Station deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Station Deleted",
        description: "The charging station has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Delete station mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to delete station. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// types/index.ts
export interface Job {
  id: number;
  address: string;
  scheduledTime: string;
  wasteType: string;
  status: 'pending' | 'assigned' | 'assigned_to_picker' | 'completed';
  location: {
    lat: number;
    lng: number;
  };
}
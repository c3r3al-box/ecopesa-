import { ReactNode } from "react";

export interface Job {
  location: any;
  address: ReactNode;
  scheduledTime: string | number | Date;
  wasteType: ReactNode;
  id: string;
  job_type?: string;
  created_by: string;
  assigned_to?: string;
  description?: string;
  weight_verified?: number;
  geo_location?: string; // PostGIS POINT as WKT or GeoJSON
  is_verified?: boolean;
  verified_at?: string;
  created_at?: string;
  status?: string;
  picker_id?: string;
  request_id?: number;
  verification_data?: Record<string, any>;
}

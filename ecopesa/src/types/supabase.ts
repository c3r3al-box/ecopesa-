// types/supabase.ts

// 1. Define Insert shapes up front
export type PickupRequestsInsert = {
  address: string
  scheduled_time: string
  waste_type: string
  status?: 'pending'
  location: { lat: number; lng: number }
}

export type AssignedJobsInsert = {
  request_id: number
  collector_id: string
  status?: 'assigned'
  verification_data?: any | null
}

// 2. Use them inside Database
export interface Database {
  public: {
    Tables: {
      pickup_requests: {
        Row: {
          id: number
          address: string
          scheduled_time: string
          waste_type: string
          status: 'pending'
          location: { lat: number; lng: number }
        }
        Insert: PickupRequestsInsert
        Update: Partial<PickupRequestsInsert>
      }
      assigned_jobs: {
        Row: {
          id: number
          request_id: number
          collector_id: string
          status: 'assigned' | 'assigned_to_picker' | 'completed'
          verification_data: any | null
        }
        Insert: AssignedJobsInsert
        Update: Partial<AssignedJobsInsert>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

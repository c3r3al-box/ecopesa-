// app/dashboard/admin/page.tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>User Management</CardHeader>
          <CardContent>
            <p>Manage all system users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>System Settings</CardHeader>
          <CardContent>
            <p>Configure application settings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
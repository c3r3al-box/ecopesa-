// app/dashboard/collector/page.tsx
import { CollectionSchedule } from '@/components/collector components/collection-schedule';

export default function CollectorDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Collection Dashboard</h1>
      <CollectionSchedule />
      {/* Other collector-specific components */}
    </div>
  );
}
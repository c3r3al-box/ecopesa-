// components/dashboard-header.tsx
interface DashboardHeaderProps {
  title: string;
  userType: 'collector' | 'admin' | 'user';
}

export function DashboardHeader({ title, userType }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">Online</span>
        </div>
        <div className="border-l h-6"></div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium capitalize">{userType}</span>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
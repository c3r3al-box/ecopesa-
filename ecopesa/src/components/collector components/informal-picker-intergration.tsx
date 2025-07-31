// components/informal-picker-integration.tsx
import { Job } from '@/types/index';

interface InformalPickerIntegrationProps {
  jobs: Job[];
  onAssignToPicker: (pickerId: string, jobId: number) => void;
}

export function InformalPickerIntegration({ jobs, onAssignToPicker }: InformalPickerIntegrationProps) {
  const [availablePickers, setAvailablePickers] = useState([
    { id: 'picker1', name: 'Rajesh Kumar', rating: 4.5, vehicle: 'Cart' },
    { id: 'picker2', name: 'Sunita Devi', rating: 4.2, vehicle: 'Bicycle' },
    { id: 'picker3', name: 'Amit Singh', rating: 4.7, vehicle: 'Motorcycle' },
  ]);

  const [assignments, setAssignments] = useState<Record<number, string>>({});

  const handleAssignment = (jobId: number, pickerId: string) => {
    setAssignments(prev => ({ ...prev, [jobId]: pickerId }));
  };

  const confirmAssignment = (jobId: number) => {
    const pickerId = assignments[jobId];
    if (pickerId) {
      onAssignToPicker(pickerId, jobId);
      setAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[jobId];
        return newAssignments;
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Informal Picker Integration</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available for assignment</p>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4">
              <h3 className="font-medium">{job.address}</h3>
              <p className="text-sm text-gray-600">
                {new Date(job.scheduledTime).toLocaleTimeString()} - {job.wasteType}
              </p>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Picker:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {availablePickers.map((picker) => (
                    <div 
                      key={picker.id}
                      onClick={() => handleAssignment(job.id, picker.id)}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        assignments[job.id] === picker.id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <h4 className="font-medium">{picker.name}</h4>
                      <p className="text-sm text-gray-600">
                        {picker.vehicle} • ⭐{picker.rating}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {assignments[job.id] && (
                <button
                  onClick={() => confirmAssignment(job.id)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Confirm Assignment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
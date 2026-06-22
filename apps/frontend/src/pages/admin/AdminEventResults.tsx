import { useParams, Link } from 'react-router-dom';
import { useEvent } from '@/features/events/hooks/useEvents';
import { useEventRegistrations } from '@/features/registrations/hooks/useRegistrations';
import { useEventResults, useAssignResult, useUpdateResult, useDeleteResult } from '@/features/results/hooks/useResults';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { PositionEnum } from '@/features/results/types';

export const AdminEventResults = () => {
  const { id: eventId } = useParams<{ id: string }>();
  
  const { data: eventData, isLoading: isLoadingEvent } = useEvent(eventId!);
  const { data: registrationsData, isLoading: isLoadingRegs } = useEventRegistrations(eventId!, { limit: 500 });
  const { data: resultsData, isLoading: isLoadingResults } = useEventResults(eventId!, { limit: 500 });

  const { mutate: assignResult, isPending: isAssigning } = useAssignResult();
  const { mutate: updateResult, isPending: isUpdating } = useUpdateResult(eventId!);
  const { mutate: deleteResult, isPending: isDeleting } = useDeleteResult(eventId!);

  const isLoading = isLoadingEvent || isLoadingRegs || isLoadingResults;

  const event = eventData?.data;
  const registrations = registrationsData?.data?.data || [];
  const results = resultsData?.data?.data || [];

  const handleAssign = (studentId: string, position: any) => {
    assignResult({ eventId: eventId!, studentId, position });
  };

  const handleUpdate = (resultId: string, position: any) => {
    updateResult({ id: resultId, data: { position } });
  };

  const handleDelete = (resultId: string) => {
    deleteResult(resultId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center py-12">Event not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/admin/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to events
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Manage Results</h1>
        <p className="text-gray-500 mt-1">Assign achievements and certificates for <span className="font-semibold text-gray-800">{event.title}</span></p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Event Registrations ({registrations.length})</h2>
          <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            {results.length} results assigned
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No students have registered for this event yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Details</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Registered At</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Result</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((reg) => {
                  const student = reg.student;
                  if (!student) return null;
                  
                  const existingResult = results.find(r => r.studentId === student.id);
                  const isProcessing = isAssigning || isUpdating || isDeleting;

                  return (
                    <tr key={reg.id} className={existingResult ? 'bg-blue-50/30' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{student.fullName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{student.email} • {student.department} ({student.academicYear})</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reg.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {existingResult ? (
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded border
                              ${existingResult.position === 'WINNER' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 
                                existingResult.position === 'RUNNER_UP' ? 'bg-gray-100 text-gray-800 border-gray-200' : 
                                'bg-blue-50 text-blue-800 border-blue-200'}`}>
                              {existingResult.position.replace('_', ' ')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">None assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <select 
                            className="block w-40 pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border bg-white disabled:opacity-50"
                            value={existingResult?.position || ''}
                            onChange={(e) => {
                              const pos = e.target.value;
                              if (!pos) return;
                              if (existingResult) {
                                handleUpdate(existingResult.id, pos);
                              } else {
                                handleAssign(student.id, pos);
                              }
                            }}
                            disabled={isProcessing}
                          >
                            <option value="" disabled>Select Rank...</option>
                            {PositionEnum.options.map(pos => (
                              <option key={pos} value={pos}>{pos.replace('_', ' ')}</option>
                            ))}
                          </select>

                          {existingResult && (
                            <button
                              onClick={() => handleDelete(existingResult.id)}
                              disabled={isProcessing}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1.5 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-colors"
                              title="Remove Result"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

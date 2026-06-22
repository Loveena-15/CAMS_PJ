import { useState } from 'react';
import { useMyRegistrations, useCancelRegistration } from '@/features/registrations/hooks/useRegistrations';
import { Calendar, MapPin, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyRegistrations = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const [cancelId, setCancelId] = useState<string | null>(null);
  
  const { data, isLoading, error } = useMyRegistrations({ page, limit });
  const { mutate: cancelRegistration, isPending: isCancelling } = useCancelRegistration();

  const handleCancel = () => {
    if (cancelId) {
      cancelRegistration(cancelId, {
        onSuccess: () => setCancelId(null)
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Registrations</h1>
        <p className="text-gray-500 mt-1">View and manage the events you have registered for.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Failed to load registrations.</div>
        ) : data?.data?.data.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No registrations yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-4">You haven't registered for any events. Browse the catalog to find exciting events!</p>
            <Link to="/events" className="text-blue-600 font-medium hover:underline">Go to Event Catalog</Link>
          </div>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200">
              {data?.data?.data.map((reg) => {
                const event = reg.event;
                console.log(event);
                if (!event) return null;
                
                const isPast = new Date() > new Date(event.date);
                console.log('Current:', new Date());
                console.log('Deadline:', new Date(event.registrationDeadline));
                console.log('Status:', event.status);
                const canCancel = event.status === 'UPCOMING' && new Date() < new Date(event.registrationDeadline);

                return (
                  <li key={reg.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Link to={`/events/${event.id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                            {event.title}
                          </Link>
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border 
                            ${event.status === 'UPCOMING' ? 'bg-blue-50 text-blue-800 border-blue-200' : 
                              event.status === 'ONGOING' ? 'bg-green-50 text-green-800 border-green-200' : 
                              event.status === 'CANCELLED' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                            {event.status}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                            {event.venue}
                          </div>
                          <div className="text-gray-500 text-xs mt-1 sm:mt-0 font-medium bg-gray-100 px-2 py-1 rounded">
                            Registered on: {new Date(reg.registeredAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                        {canCancel ? (
                          <button
                            onClick={() => setCancelId(reg.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-200 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Cancel Registration
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 italic bg-gray-100 px-2 py-1 rounded">
                            {isPast ? 'Event ended' : 'Cancellation closed'}
                          </span>
                        )}
                        <Link to={`/events/${event.id}`} className="text-sm text-blue-600 hover:underline font-medium">
                          View details
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {data?.data?.pagination && data.data.pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 shadow-sm"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {data.data.pagination.page} of {data.data.pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(data.data.pagination.totalPages, p + 1))}
                  disabled={page === data.data.pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {cancelId && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => !isCancelling && setCancelId(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-200">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">Cancel Registration</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Are you sure you want to cancel your registration? This action will free up your spot for someone else.</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  disabled={isCancelling}
                  onClick={handleCancel}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel Registration'}
                </button>
                <button 
                  type="button" 
                  disabled={isCancelling}
                  onClick={() => setCancelId(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Keep Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

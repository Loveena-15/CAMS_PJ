import { useState } from 'react';
import { useMyResults } from '@/features/results/hooks/useResults';
import { Award, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyResults = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading, error } = useMyResults({ page, limit });

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Achievements</h1>
        <p className="text-gray-500 mt-1">View your event results and downloaded certificates.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Failed to load results.</div>
        ) : data?.data?.data.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No results yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-4">You don't have any event results recorded. Participate in more events to build your profile!</p>
            <Link to="/events" className="text-blue-600 font-medium hover:underline">Find Events</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Event Details</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Achievement</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Certificate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.data.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link to={`/events/${result.eventId}`} className="text-sm font-bold text-blue-600 hover:underline">
                        {result.event?.title || 'Unknown Event'}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {result.event?.venue}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {result.event?.date ? new Date(result.event.date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
                        ${result.position === 'WINNER' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 
                          result.position === 'RUNNER_UP' ? 'bg-gray-100 text-gray-800 border-gray-200' : 
                          'bg-blue-50 text-blue-800 border-blue-200'}`}>
                        {result.position === 'WINNER' ? '🏆 Winner' : 
                         result.position === 'RUNNER_UP' ? '🥈 Runner Up' : 
                         '🌟 Participant'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {result.certificateUrl ? (
                        <a href={result.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 inline-flex items-center bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors">
                          View Certificate <ChevronRight className="w-4 h-4 ml-1" />
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Processing...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {data?.data?.pagination && data.data.pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {data.data.pagination.page} of {data.data.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(data.data.pagination.totalPages, p + 1))}
              disabled={page === data.data.pagination.totalPages}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

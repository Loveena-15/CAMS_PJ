import { useState } from 'react';
import { useEvents } from '@/features/events/hooks/useEvents';
import { EventCard } from '@/features/events/components/EventCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';

export const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading, error } = useEvents({
    page,
    limit,
    search: debouncedSearch || undefined,
    category: category || undefined,
    status: status || undefined,
  });

  const categories = ['TECHNICAL', 'CULTURAL', 'SPORTS', 'WORKSHOP', 'SEMINAR', 'OTHER'];
  const statuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Event Catalog</h1>
          <p className="text-gray-600 max-w-2xl">Browse and discover upcoming events, workshops, and activities across the campus.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input 
            type="text" 
            placeholder="Search events by title..." 
            className="pl-10 h-10 bg-gray-50 border-gray-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset page on search
            }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            className="h-10 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            className="h-10 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-center border border-red-100">
          Failed to load events. Please try again later.
        </div>
      ) : data?.data?.data.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-lg border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any events matching your current search and filter criteria.</p>
          {(searchTerm || category || status) && (
            <button 
              onClick={() => { setSearchTerm(''); setCategory(''); setStatus(''); setPage(1); }}
              className="mt-4 text-blue-600 hover:underline font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {data?.data?.pagination && data.data.pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center px-4">
                <span className="text-sm text-gray-700">
                  Page <span className="font-semibold">{data.data.pagination.page}</span> of <span className="font-semibold">{data.data.pagination.totalPages}</span>
                </span>
              </div>
              <button 
                onClick={() => setPage(p => Math.min(data.data.pagination.totalPages, p + 1))}
                disabled={page === data.data.pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

import { useParams, Link, useNavigate } from 'react-router-dom';
import { EventForm } from '@/features/events/components/EventForm';
import { useUpdateEvent, useEvent } from '@/features/events/hooks/useEvents';
import { ArrowLeft } from 'lucide-react';

export const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading: isLoadingEvent, error } = useEvent(id!);
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent(id!);

  if (isLoadingEvent) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md text-center border border-red-100">
        Failed to load event details.
        <br />
        <Link to="/admin/events" className="text-blue-600 hover:underline mt-2 inline-block">Return to events</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/admin/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to events
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-gray-500 mt-1">Update details for "{data.data.title}"</p>
      </div>

      <EventForm 
        initialValues={data.data}
        onSubmit={(payload) => updateEvent(payload, {
          onSuccess: () => navigate('/admin/events')
        })}
        isLoading={isUpdating}
        submitText="Save Changes"
      />
    </div>
  );
};

import { Link, useNavigate } from 'react-router-dom';
import { EventForm } from '@/features/events/components/EventForm';
import { useCreateEvent } from '@/features/events/hooks/useEvents';
import { ArrowLeft } from 'lucide-react';

export const CreateEvent = () => {
  const navigate = useNavigate();
  const { mutate: createEvent, isPending } = useCreateEvent();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/admin/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to events
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to publish a new event to the catalog.</p>
      </div>

      <EventForm 
        onSubmit={(data) => createEvent(data, {
          onSuccess: () => navigate('/admin/events')
        })}
        isLoading={isPending}
        submitText="Publish Event"
      />
    </div>
  );
};

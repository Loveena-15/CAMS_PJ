import { useParams, Link } from 'react-router-dom';
import { useEvent } from '@/features/events/hooks/useEvents';
import { useRegisterForEvent } from '@/features/registrations/hooks/useRegistrations';
import { Calendar, MapPin, Tag, ArrowLeft, Clock, Info } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useEvent(id!);
  const { user } = useAuthStore();
  const { mutate: registerForEvent, isPending: isRegistering } = useRegisterForEvent();

  const handleRegister = () => {
    if (id) {
      registerForEvent({ eventId: id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center border border-red-100">
          <h3 className="text-lg font-medium mb-2">Event not found</h3>
          <p className="mb-4">The event you're looking for doesn't exist or an error occurred.</p>
          <Link to="/events" className="text-blue-600 hover:underline inline-flex items-center font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to events
          </Link>
        </div>
      </div>
    );
  }

  const event = data.data; 
  const isRegistrationOpen = new Date() < new Date(event.registrationDeadline);
  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to events
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {event.posterUrl ? (
          <div className="w-full h-[400px] relative bg-gray-900 border-b border-gray-200">
            <img 
              src={event.posterUrl} 
              alt={event.title} 
              className="w-full h-full object-contain" 
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-4xl font-bold text-white px-8 text-center drop-shadow-md">{event.title}</h1>
          </div>
        )}

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full shadow-sm">
              {event.status}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center shadow-sm">
              <Tag className="w-3 h-3 mr-1.5" /> {event.category}
            </span>
            {event.department && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full shadow-sm">
                {event.department}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">{event.title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">About the Event</h2>
                <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {event.description || "No description provided."}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Date & Time</h4>
                    <p className="text-gray-900 font-medium">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Venue</h4>
                    <p className="text-gray-900 font-medium">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Registration Deadline</h4>
                    <p className="text-gray-900 font-medium">{formatDate(event.registrationDeadline)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Registration</h3>
                
                {event.status !== 'UPCOMING' ? (
                  <div className="flex items-start bg-yellow-50 p-4 rounded-lg text-yellow-800 text-sm border border-yellow-100">
                    <Info className="w-5 h-5 mr-3 flex-shrink-0" />
                    <p>Registration is closed. The event is currently <span className="font-semibold">{event.status.toLowerCase()}</span>.</p>
                  </div>
                ) : !isRegistrationOpen ? (
                  <div className="flex items-start bg-red-50 p-4 rounded-lg text-red-800 text-sm border border-red-100">
                    <Info className="w-5 h-5 mr-3 flex-shrink-0" />
                    <p>The registration deadline has passed.</p>
                  </div>
                ) : user?.role === 'ADMIN' ? (
                  <div className="flex items-start bg-blue-50 p-4 rounded-lg text-blue-800 text-sm border border-blue-100">
                    <Info className="w-5 h-5 mr-3 flex-shrink-0" />
                    <p>Admins cannot register for events. Please use the admin dashboard to manage this event.</p>
                  </div>
                ) : !user ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">You must be logged in as a student to register.</p>
                    <Link to="/login" className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
                      Sign In to Register
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4 font-medium text-green-700 bg-green-50 p-3 rounded border border-green-100">Registration is open! Secure your spot now.</p>
                    <Button 
                      className="w-full py-2.5 rounded-lg shadow-sm" 
                      onClick={handleRegister} 
                      isLoading={isRegistering}
                    >
                      Register Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

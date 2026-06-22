import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventSchema, CreateEventPayload, EventCategoryEnum, EventStatusEnum } from '../types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface EventFormProps {
  initialValues?: Partial<CreateEventPayload>;
  onSubmit: (data: CreateEventPayload) => void;
  isLoading: boolean;
  submitText: string;
}

export const EventForm = ({ initialValues, onSubmit, isLoading, submitText }: EventFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventPayload>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      category: initialValues?.category || 'OTHER',
      department: initialValues?.department || '',
      venue: initialValues?.venue || '',
      date: initialValues?.date ? new Date(initialValues.date).toISOString().slice(0, 16) : '',
      registrationDeadline: initialValues?.registrationDeadline ? new Date(initialValues.registrationDeadline).toISOString().slice(0, 16) : '',
      posterUrl: initialValues?.posterUrl || '',
      status: initialValues?.status || 'UPCOMING',
    },
  });

  const handleFormSubmit = (data: CreateEventPayload) => {
    // Convert datetime-local to full ISO string
    const formattedData = {
      ...data,
      date: new Date(data.date).toISOString(),
      registrationDeadline: new Date(data.registrationDeadline).toISOString(),
    };
    
    if (!formattedData.posterUrl) {
      delete formattedData.posterUrl;
    }
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Title <span className="text-red-500">*</span></label>
          <Input 
            {...register('title')} 
            placeholder="E.g., Annual Tech Hackathon 2026" 
            error={errors.title?.message} 
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            placeholder="Provide a detailed description of the event..."
          />
          {errors.description && <span className="text-sm text-red-500 mt-1 block">{errors.description.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
          <select
            {...register('category')}
            className={`w-full h-10 rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
          >
            {EventCategoryEnum.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {errors.category && <span className="text-sm text-red-500 mt-1 block">{errors.category.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <Input 
            {...register('department')} 
            placeholder="E.g., Computer Science" 
            error={errors.department?.message} 
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue <span className="text-red-500">*</span></label>
          <Input 
            {...register('venue')} 
            placeholder="E.g., Main Auditorium" 
            error={errors.venue?.message} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Date & Time <span className="text-red-500">*</span></label>
          <Input 
            type="datetime-local"
            {...register('date')} 
            error={errors.date?.message} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline <span className="text-red-500">*</span></label>
          <Input 
            type="datetime-local"
            {...register('registrationDeadline')} 
            error={errors.registrationDeadline?.message} 
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL (Optional)</label>
          <Input 
            type="url"
            {...register('posterUrl')} 
            placeholder="https://cloudinary.com/..." 
            error={errors.posterUrl?.message} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            {...register('status')}
            className={`w-full h-10 rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
          >
            {EventStatusEnum.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {errors.status && <span className="text-sm text-red-500 mt-1 block">{errors.status.message}</span>}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-8">
          {submitText}
        </Button>
      </div>
    </form>
  );
};

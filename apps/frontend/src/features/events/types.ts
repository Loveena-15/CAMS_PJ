import { z } from 'zod';

export const EventCategoryEnum = z.enum(['TECHNICAL', 'CULTURAL', 'SPORTS', 'WORKSHOP', 'SEMINAR', 'OTHER']);
export const EventStatusEnum = z.enum(['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']);

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  category: EventCategoryEnum,
  department: z.string().optional(),
  venue: z.string().min(3, 'Venue is required'),
  date: z.string().min(1, 'Event date is required'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  posterUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  status: EventStatusEnum.default('UPCOMING'),
}).refine((data) => {
  return new Date(data.registrationDeadline) < new Date(data.date);
}, {
  message: "Registration deadline must be before the event date",
  path: ["registrationDeadline"],
});

export const updateEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().optional(),
  category: EventCategoryEnum.optional(),
  department: z.string().optional(),
  venue: z.string().min(3, 'Venue is required').optional(),
  date: z.string().min(1).optional(),
  registrationDeadline: z.string().min(1).optional(),
  posterUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  status: EventStatusEnum.optional(),
}).refine((data) => {
  if (data.registrationDeadline && data.date) {
    return new Date(data.registrationDeadline) < new Date(data.date);
  }
  return true;
}, {
  message: "Registration deadline must be before the event date",
  path: ["registrationDeadline"],
});

export type CreateEventPayload = z.infer<typeof createEventSchema>;
export type UpdateEventPayload = z.infer<typeof updateEventSchema>;

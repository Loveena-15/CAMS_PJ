import { z } from 'zod';

const EventCategoryEnum = z.enum(['TECHNICAL', 'CULTURAL', 'SPORTS', 'WORKSHOP', 'SEMINAR', 'OTHER']);
const EventStatusEnum = z.enum(['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']);

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    category: EventCategoryEnum,
    department: z.string().optional(),
    venue: z.string().min(3, 'Venue is required'),
    date: z.string().datetime({ message: 'Invalid ISO date string' }),
    registrationDeadline: z.string().datetime({ message: 'Invalid ISO date string' }),
    posterUrl: z.string().url('Invalid URL format').optional(),
    status: EventStatusEnum.default('UPCOMING'),
  }).refine((data) => {
    return new Date(data.registrationDeadline) < new Date(data.date);
  }, {
    message: "Registration deadline must be before the event date",
    path: ["registrationDeadline"],
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    category: EventCategoryEnum.optional(),
    department: z.string().optional(),
    venue: z.string().min(3).optional(),
    date: z.string().datetime().optional(),
    registrationDeadline: z.string().datetime().optional(),
    posterUrl: z.string().url().optional(),
    status: EventStatusEnum.optional(),
  }).refine((data) => {
    if (data.registrationDeadline && data.date) {
      return new Date(data.registrationDeadline) < new Date(data.date);
    }
    return true; // Partial updates might only pass one of the dates
  }, {
    message: "Registration deadline must be before the event date",
    path: ["registrationDeadline"],
  }),
});

export const getEventsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    category: EventCategoryEnum.optional(),
    department: z.string().optional(),
    status: EventStatusEnum.optional(),
  }),
});

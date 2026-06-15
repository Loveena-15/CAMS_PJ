import { z } from 'zod';

export const registerEventSchema = z.object({
  body: z.object({
    eventId: z.string().min(1, 'Event ID is required'),
  }),
});

export const getEventRegistrationsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const getMyRegistrationsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

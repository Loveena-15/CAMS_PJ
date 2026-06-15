import { z } from 'zod';

const PositionEnum = z.enum(['WINNER', 'RUNNER_UP', 'PARTICIPANT']);

export const assignResultSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    eventId: z.string().min(1, 'Event ID is required'),
    position: PositionEnum,
  }),
});

export const updateResultSchema = z.object({
  body: z.object({
    position: PositionEnum,
  }),
});

export const getResultsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

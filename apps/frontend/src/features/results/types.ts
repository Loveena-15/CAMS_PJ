import { z } from 'zod';

export const PositionEnum = z.enum(['WINNER', 'RUNNER_UP', 'PARTICIPANT']);

export const assignResultSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  eventId: z.string().min(1, 'Event ID is required'),
  position: PositionEnum,
});

export const updateResultSchema = z.object({
  position: PositionEnum,
});

export type AssignResultPayload = z.infer<typeof assignResultSchema>;
export type UpdateResultPayload = z.infer<typeof updateResultSchema>;

import { z } from 'zod';

export const registerEventSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
});

export type RegisterEventPayload = z.infer<typeof registerEventSchema>;

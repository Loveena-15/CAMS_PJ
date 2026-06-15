import { z } from 'zod';

export const generateCertificateSchema = z.object({
  body: z.object({
    resultId: z.string().min(1, 'Result ID is required'),
  }),
});

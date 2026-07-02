import { z } from 'zod';

export const categorySchema = z.object({
  type: z.enum(['income', 'expense']),
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(30, 'Title must be less than 30 characters'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

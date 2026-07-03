import { z } from 'zod';

export const categorySchema = z.object({
  type: z.enum(['income', 'expense']),
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(30, 'Title must be less than 30 characters'),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

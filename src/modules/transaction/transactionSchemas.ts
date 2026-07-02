import { z } from 'zod';

// We choose to validate the raw string in the form (representing rupees/decimal)
// and convert it to an integer (paise/cents) on submit before sending to the service.
// This keeps the form state exactly matching what the user sees and types,
// preventing weird cursor jumps or rounding issues while typing.
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(100, 'Description must be less than 100 characters').optional(),
  amountString: z
    .string()
    .min(1, 'Amount is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number with up to 2 decimal places')
    .refine((val) => parseFloat(val) > 0, 'Amount must be greater than 0'),
  date: z.number().int().min(1, 'Date is required'), // Unix timestamp
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

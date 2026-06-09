
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: number;
}

// Input type — for writing to Firebase
export type TransactionInput = Omit<Transaction, 'id'>;
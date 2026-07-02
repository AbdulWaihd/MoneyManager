export type Category = {
  id: string;
  type: 'income' | 'expense';
  title: string;
};

export type CategoryInput = Omit<Category, 'id'>;
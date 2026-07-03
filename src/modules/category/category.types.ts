export type Category = {
  id: string;
  type: 'income' | 'expense';
  title: string;
  icon?: string;
  color?: string;
};

export type CategoryInput = Omit<Category, 'id'>;

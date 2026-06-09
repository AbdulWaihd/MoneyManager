// Full type — for reading from Firebase
export type Category = {
  id: string;
  type: 'income' | 'expense';
  title: string;
}

// Input type — for writing to Firebase
export type CategoryInput = Omit<Category, 'id'>;
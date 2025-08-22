import { Category } from '../types/Category';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useFirestoreDocument } from './useFirestoreDocument';
import { useFirestoreMutations } from './useFirestoreMutations';

export function useCategories() {
  return useFirestoreCollection<Category>('category', {
    queries: []
  });
}

export function useCategory(id?: string) {
  return useFirestoreDocument<Category>(id ? `category/${id}` : '', {
    enabled: !!id
  });
}

export function useCategoryMutations() {
  const mutations = useFirestoreMutations();

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    return mutations.addDocument('category', categoryData);
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    return mutations.updateDocument(`category/${id}`, categoryData);
  };

  const deleteCategory = async (id: string) => {
    return mutations.updateDocument(`category/${id}`, { isActive: false });
  };

  return {
    addCategory,
    updateCategory,
    deleteCategory,
    ...mutations.state
  };
}
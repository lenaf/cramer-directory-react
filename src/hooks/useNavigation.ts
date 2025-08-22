import { NavigationItem } from '../types/Navigation';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useFirestoreDocument } from './useFirestoreDocument';

export function useNavigation() {
  return useFirestoreCollection<NavigationItem>('navigation', {
    queries: [{ field: 'isActive', operator: '==', value: true }],
    sorts: [{ field: 'weight', direction: 'asc' }]
  });
}

export function useNavigationItem(id?: string) {
  return useFirestoreDocument<NavigationItem>(id ? `navigation/${id}` : '', {
    enabled: !!id
  });
}
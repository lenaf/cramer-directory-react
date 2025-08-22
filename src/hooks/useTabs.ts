import { Tab } from '../types/Tab';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useFirestoreDocument } from './useFirestoreDocument';

export function useTabs() {
  return useFirestoreCollection<Tab>('tab', {
    queries: [{ field: 'isActive', operator: '==', value: true }],
    sorts: [{ field: 'weight', direction: 'asc' }]
  });
}

export function useTab(id?: string) {
  return useFirestoreDocument<Tab>(id ? `tab/${id}` : '', {
    enabled: !!id
  });
}
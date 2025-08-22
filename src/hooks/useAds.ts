import { useMemo } from 'react';
import { Ad, AdTypeTypes } from '../types/Ad';
import { useFirestoreCollection } from './useFirestoreCollection';

export function useAds() {
  return useFirestoreCollection<Ad>('ad', {
    queries: [{ field: 'isActive', operator: '==', value: true }],
    sorts: [{ field: 'name', direction: 'asc' }]
  });
}

export function useAdsByType(type: AdTypeTypes) {
  return useFirestoreCollection<Ad>('ad', {
    queries: [
      { field: 'isActive', operator: '==', value: true },
      { field: 'type', operator: '==', value: type }
    ],
    sorts: [{ field: 'name', direction: 'asc' }]
  });
}

export function useRandomAdByType(type: AdTypeTypes) {
  const { data: ads, loading, error } = useAdsByType(type);

  const randomAd = useMemo(() => {
    if (ads.length === 0) return null;
    return ads[Math.floor(Math.random() * ads.length)];
  }, [ads]);

  return { data: randomAd, loading, error };
}
import { useMemo } from 'react';
import { Community } from '../types/Community';
import { Pillar } from '../types/Pillar';
import { Resource } from '../types/Resource';
import { Tab } from '../types/Tab';
import { Ad, AdTypeTypes } from '../types/Ad';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useFirestoreDocument } from './useFirestoreDocument';
import { useFirestoreMutations } from './useFirestoreMutations';

// Community hooks
export function useCommunity() {
  return useFirestoreCollection<Community>('community', {
    queries: [{ field: 'isActive', operator: '==', value: true }],
    sorts: [{ field: 'weight', direction: 'asc' }]
  });
}

export function useCommunityItem(id?: string) {
  return useFirestoreDocument<Community>(id ? `community/${id}` : '', {
    enabled: !!id
  });
}

// Pillar hooks
export function usePillars() {
  return useFirestoreCollection<Pillar>('pillar', {
    queries: [{ field: 'isActive', operator: '==', value: true }],
    sorts: [{ field: 'weight', direction: 'asc' }]
  });
}

export function usePillar(id?: string) {
  return useFirestoreDocument<Pillar>(id ? `pillar/${id}` : '', {
    enabled: !!id
  });
}

// Resource hooks
export function useResources() {
  return useFirestoreCollection<Resource>('resource', {
    queries: [{ field: 'isActive', operator: '==', value: true }],
    sorts: [{ field: 'weight', direction: 'asc' }]
  });
}

export function useResource(id?: string) {
  return useFirestoreDocument<Resource>(id ? `resource/${id}` : '', {
    enabled: !!id
  });
}

// Tab hooks
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

// Ad hooks
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

// Content mutations hook (for all content types)
export function useContentMutations() {
  const mutations = useFirestoreMutations();

  // Community mutations
  const addCommunity = async (data: Omit<Community, 'id'>) => {
    return mutations.addDocument('community', data);
  };

  const updateCommunity = async (id: string, data: Partial<Community>) => {
    return mutations.updateDocument(`community/${id}`, data);
  };

  const deleteCommunity = async (id: string) => {
    return mutations.updateDocument(`community/${id}`, { isActive: false });
  };

  // Pillar mutations
  const addPillar = async (data: Omit<Pillar, 'id'>) => {
    return mutations.addDocument('pillar', data);
  };

  const updatePillar = async (id: string, data: Partial<Pillar>) => {
    return mutations.updateDocument(`pillar/${id}`, data);
  };

  const deletePillar = async (id: string) => {
    return mutations.updateDocument(`pillar/${id}`, { isActive: false });
  };

  // Resource mutations
  const addResource = async (data: Omit<Resource, 'id'>) => {
    return mutations.addDocument('resource', data);
  };

  const updateResource = async (id: string, data: Partial<Resource>) => {
    return mutations.updateDocument(`resource/${id}`, data);
  };

  const deleteResource = async (id: string) => {
    return mutations.updateDocument(`resource/${id}`, { isActive: false });
  };

  // Tab mutations
  const addTab = async (data: Omit<Tab, 'id'>) => {
    return mutations.addDocument('tab', data);
  };

  const updateTab = async (id: string, data: Partial<Tab>) => {
    return mutations.updateDocument(`tab/${id}`, data);
  };

  const deleteTab = async (id: string) => {
    return mutations.updateDocument(`tab/${id}`, { isActive: false });
  };

  // Ad mutations
  const addAd = async (data: Omit<Ad, 'id'>) => {
    return mutations.addDocument('ad', data);
  };

  const updateAd = async (id: string, data: Partial<Ad>) => {
    return mutations.updateDocument(`ad/${id}`, data);
  };

  const deleteAd = async (id: string) => {
    return mutations.updateDocument(`ad/${id}`, { isActive: false });
  };

  return {
    // Community
    addCommunity,
    updateCommunity,
    deleteCommunity,
    // Pillars
    addPillar,
    updatePillar,
    deletePillar,
    // Resources
    addResource,
    updateResource,
    deleteResource,
    // Tabs
    addTab,
    updateTab,
    deleteTab,
    // Ads
    addAd,
    updateAd,
    deleteAd,
    // Mutation state
    ...mutations.state
  };
}
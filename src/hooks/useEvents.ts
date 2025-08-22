import { useMemo } from 'react';
import { Event } from '../types/Event';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useFirestoreDocument } from './useFirestoreDocument';
import { useFirestoreMutations } from './useFirestoreMutations';

export function useEvents() {
  return useFirestoreCollection<Event>('event', {
    queries: [{ field: 'isActive', operator: '==', value: true }],
    sorts: [
      { field: 'weight', direction: 'asc' },
      { field: 'startDate', direction: 'asc' }
    ]
  });
}

export function useUpcomingEvents() {
  const currentDate = new Date().toISOString();
  
  return useFirestoreCollection<Event>('event', {
    queries: [
      { field: 'isActive', operator: '==', value: true },
      { field: 'startDate', operator: '>=', value: currentDate }
    ],
    sorts: [{ field: 'startDate', direction: 'asc' }]
  });
}

export function usePastEvents() {
  const currentDate = new Date().toISOString();
  
  return useFirestoreCollection<Event>('event', {
    queries: [
      { field: 'isActive', operator: '==', value: true },
      { field: 'endDate', operator: '<', value: currentDate }
    ],
    sorts: [{ field: 'startDate', direction: 'desc' }]
  });
}

export function useEventsByType(type?: string) {
  const queries = useMemo(() => {
    const baseQueries: Array<{ field: string; operator: any; value: unknown }> = [
      { field: 'isActive', operator: '==', value: true }
    ];
    if (type) {
      baseQueries.push({ field: 'type', operator: '==', value: type });
    }
    return baseQueries;
  }, [type]);

  return useFirestoreCollection<Event>('event', {
    queries,
    sorts: [
      { field: 'weight', direction: 'asc' },
      { field: 'startDate', direction: 'asc' }
    ],
    enabled: !!type
  });
}

export function useEvent(id?: string) {
  return useFirestoreDocument<Event>(id ? `event/${id}` : '', {
    enabled: !!id
  });
}

export function useEventMutations() {
  const mutations = useFirestoreMutations();

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    return mutations.addDocument('event', eventData);
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    return mutations.updateDocument(`event/${id}`, eventData);
  };

  const deleteEvent = async (id: string) => {
    return mutations.updateDocument(`event/${id}`, { isActive: false });
  };

  return {
    addEvent,
    updateEvent,
    deleteEvent,
    ...mutations.state
  };
}

export function useEventSearch(searchTerm: string = '') {
  const { data: events, loading, error } = useEvents();

  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;
    
    const term = searchTerm.toLowerCase();
    return events.filter(event =>
      event.title?.toLowerCase().includes(term) ||
      event.subtitle?.toLowerCase().includes(term) ||
      event.description?.toLowerCase().includes(term) ||
      event.type?.toLowerCase().includes(term)
    );
  }, [events, searchTerm]);

  return {
    data: filteredEvents,
    loading,
    error,
    totalCount: events.length
  };
}
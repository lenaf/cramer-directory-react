import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Person } from '../types/Person';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useFirestoreDocument } from './useFirestoreDocument';
import { useFirestoreMutations } from './useFirestoreMutations';

// Hook for all people
export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        setError(null);
        const personCollection = collection(db, 'contact');
        const snapshot = await getDocs(personCollection);
        const allPeople = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Person[];
        
        const activePeople = allPeople
          .filter(person => person.isActive !== false)
          .sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));
        
        setPeople(activePeople);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load people'));
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  return { data: people, loading, error };
}

// Hook for people by company
export function usePeopleByCompany(companyId?: string) {
  const queries = useMemo(() => {
    const baseQueries: Array<{ field: string; operator: any; value: unknown }> = [
      { field: 'isActive', operator: '==', value: true }
    ];
    if (companyId) {
      baseQueries.push({ field: 'companyId', operator: '==', value: companyId });
    }
    return baseQueries;
  }, [companyId]);

  return useFirestoreCollection<Person>('contact', {
    queries,
    sorts: [{ field: 'weight', direction: 'asc' }],
    enabled: !!companyId
  });
}

// Hook for a single person
export function usePerson(id?: string) {
  return useFirestoreDocument<Person>(id ? `contact/${id}` : '', {
    enabled: !!id
  });
}

// Hook for legacy contact collection support
export function useContacts() {
  return useFirestoreCollection<Person>('contact', {
    queries: [{ field: 'isActive', operator: '==', value: true }],
    sorts: [{ field: 'firstName', direction: 'asc' }]
  });
}

export function useContact(id?: string) {
  return useFirestoreDocument<Person>(id ? `contact/${id}` : '', {
    enabled: !!id
  });
}

// Hook for person mutations
export function usePersonMutations() {
  const mutations = useFirestoreMutations();

  const addPerson = async (personData: Omit<Person, 'id'>) => {
    return mutations.addDocument('contact', personData);
  };

  const updatePerson = async (id: string, personData: Partial<Person>) => {
    return mutations.updateDocument(`contact/${id}`, personData);
  };

  const deletePerson = async (id: string) => {
    // Soft delete by setting isActive to false
    return mutations.updateDocument(`contact/${id}`, { isActive: false });
  };

  const getPersonCount = async () => {
    return mutations.getCount('contact', [
      { field: 'isActive', operator: '==', value: true }
    ]);
  };

  const getPersonCountByCompany = async (companyId: string) => {
    return mutations.getCount('contact', [
      { field: 'isActive', operator: '==', value: true },
      { field: 'companyId', operator: '==', value: companyId }
    ]);
  };

  return {
    addPerson,
    updatePerson,
    deletePerson,
    getPersonCount,
    getPersonCountByCompany,
    ...mutations.state
  };
}

// Hook for searching people (client-side filtering)
export function usePersonSearch(searchTerm: string = '') {
  const { data: people, loading, error } = usePeople();

  const filteredPeople = useMemo(() => {
    if (!searchTerm.trim()) return people;
    
    const term = searchTerm.toLowerCase();
    return people.filter(person =>
      person.firstName?.toLowerCase().includes(term) ||
      person.lastName?.toLowerCase().includes(term) ||
      person.jobTitle?.toLowerCase().includes(term) ||
      person.about?.toLowerCase().includes(term) ||
      person.skills?.some(skill => skill?.toLowerCase().includes(term))
    );
  }, [people, searchTerm]);

  return {
    data: filteredPeople,
    loading,
    error,
    totalCount: people.length
  };
}
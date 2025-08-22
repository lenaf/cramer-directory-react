import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
  FirestoreError,
  WhereFilterOp,
  OrderByDirection
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface FirestoreQuery {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
}

export interface FirestoreSort {
  field: string;
  direction: OrderByDirection;
}

interface UseFirestoreCollectionOptions {
  queries?: FirestoreQuery[];
  sorts?: FirestoreSort[];
  limitTo?: number;
  enabled?: boolean;
}

interface UseFirestoreCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: FirestoreError | null;
  refetch: () => void;
}

export function useFirestoreCollection<T extends { id: string }>(
  collectionName: string,
  options: UseFirestoreCollectionOptions = {}
): UseFirestoreCollectionResult<T> {
  const {
    queries = [],
    sorts = [],
    limitTo = 1000,
    enabled = true
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Memoize query constraints to prevent infinite re-renders
  const queryConstraints = useMemo(() => {
    const constraints: QueryConstraint[] = [];
    
    queries.forEach(q => {
      constraints.push(where(q.field, q.operator, q.value));
    });
    
    sorts.forEach(s => {
      constraints.push(orderBy(s.field, s.direction));
    });
    
    if (limitTo && limitTo > 0) {
      constraints.push(limit(limitTo));
    }
    
    return constraints;
  }, [
    queries.length,
    sorts.length, 
    limitTo,
    ...queries.map(q => `${q.field}:${q.operator}:${JSON.stringify(q.value)}`),
    ...sorts.map(s => `${s.field}:${s.direction}`)
  ]);

  // Memoize the query to prevent unnecessary re-subscriptions
  const firestoreQuery = useMemo(() => {
    return query(collection(db, collectionName), ...queryConstraints);
  }, [collectionName, queryConstraints]);

  const refetch = useCallback(() => {
    if (!enabled) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    try {
      const unsubscribe = onSnapshot(
        firestoreQuery,
        {
          next: (snapshot) => {
            const documents = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as T[];
            
            setData(documents);
            setLoading(false);
            setError(null);
          },
          error: (err) => {
            console.error(`Error fetching ${collectionName}:`, err);
            setError(err);
            setLoading(false);
          }
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      console.error(`Error setting up listener for ${collectionName}:`, err);
      setError(err as FirestoreError);
      setLoading(false);
    }
  }, [enabled, firestoreQuery, collectionName]);

  useEffect(() => {
    refetch();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [refetch]);

  // Reset data when disabled
  useEffect(() => {
    if (!enabled) {
      setData([]);
      setLoading(false);
      setError(null);
    }
  }, [enabled]);

  return { data, loading, error, refetch };
}
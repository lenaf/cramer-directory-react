import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  doc,
  onSnapshot,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UseFirestoreDocumentOptions {
  enabled?: boolean;
}

interface UseFirestoreDocumentResult<T> {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
  refetch: () => void;
  exists: boolean;
}

export function useFirestoreDocument<T extends { id: string }>(
  path: string,
  options: UseFirestoreDocumentOptions = {}
): UseFirestoreDocumentResult<T> {
  const { enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [exists, setExists] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Memoize the document reference
  const docRef = useMemo(() => {
    if (!path) return null;
    return doc(db, path);
  }, [path]);

  const refetch = useCallback(() => {
    if (!enabled || !path || !docRef) {
      setData(null);
      setLoading(false);
      setExists(false);
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
        docRef,
        {
          next: (snapshot) => {
            if (snapshot.exists()) {
              const documentData = {
                id: snapshot.id,
                ...snapshot.data()
              } as T;
              
              setData(documentData);
              setExists(true);
            } else {
              setData(null);
              setExists(false);
            }
            setLoading(false);
            setError(null);
          },
          error: (err) => {
            console.error(`Error fetching document ${path}:`, err);
            setError(err);
            setLoading(false);
            setExists(false);
          }
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      console.error(`Error setting up listener for document ${path}:`, err);
      setError(err as FirestoreError);
      setLoading(false);
      setExists(false);
    }
  }, [enabled, path, docRef]);

  useEffect(() => {
    refetch();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [refetch]);

  // Reset data when disabled or path is empty
  useEffect(() => {
    if (!enabled || !path) {
      setData(null);
      setLoading(false);
      setExists(false);
      setError(null);
    }
  }, [enabled, path]);

  return { data, loading, error, refetch, exists };
}
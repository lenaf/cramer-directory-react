import { useState, useCallback } from 'react';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  getCountFromServer,
  query,
  where,
  QueryConstraint,
  WhereFilterOp,
  DocumentReference,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirestoreUtils } from '../utils/firestore';

interface MutationState {
  loading: boolean;
  error: Error | null;
}

interface QueryCondition {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
}

interface UseFirestoreMutationsResult {
  state: MutationState;
  addDocument: <T>(collectionName: string, data: Omit<T, 'id'>) => Promise<string>;
  setDocument: <T>(path: string, data: T) => Promise<void>;
  updateDocument: <T>(path: string, data: Partial<T>) => Promise<void>;
  deleteDocument: (path: string) => Promise<void>;
  getDocument: <T extends { id: string }>(path: string) => Promise<T | null>;
  addToArray: (path: string, field: string, value: unknown) => Promise<void>;
  removeFromArray: (path: string, field: string, value: unknown) => Promise<void>;
  getCount: (collectionName: string, conditions?: QueryCondition[]) => Promise<number>;
}

export function useFirestoreMutations(): UseFirestoreMutationsResult {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: Error | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const addDocument = useCallback(async <T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const ref = collection(db, collectionName);
      const docData = {
        ...FirestoreUtils.setUndefinedValuesToNull(data),
        createdOn: serverTimestamp(),
        modifiedOn: serverTimestamp(),
      };
      
      const docRef = await addDoc(ref, docData);
      setLoading(false);
      return docRef.id;
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, []);

  const setDocument = useCallback(async <T>(path: string, data: T): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, path);
      const docData = {
        ...FirestoreUtils.setUndefinedValuesToNull(data),
        createdOn: serverTimestamp(),
        modifiedOn: serverTimestamp(),
      };
      
      await setDoc(docRef, docData);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, []);

  const updateDocument = useCallback(async <T>(path: string, data: Partial<T>): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, path);
      const docData = {
        ...FirestoreUtils.setUndefinedValuesToNull(data),
        modifiedOn: serverTimestamp(),
      };
      
      await updateDoc(docRef, docData);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, []);

  const deleteDocument = useCallback(async (path: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, path);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, []);

  const getDocument = useCallback(async <T extends { id: string }>(path: string): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, path);
      const snapshot = await getDoc(docRef);
      setLoading(false);
      
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as T;
      }
      return null;
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, []);

  const addToArray = useCallback(async (path: string, field: string, value: unknown): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, path);
      await updateDoc(docRef, {
        [field]: arrayUnion(value),
        modifiedOn: serverTimestamp()
      });
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, []);

  const removeFromArray = useCallback(async (path: string, field: string, value: unknown): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, path);
      await updateDoc(docRef, {
        [field]: arrayRemove(value),
        modifiedOn: serverTimestamp()
      });
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, []);

  const getCount = useCallback(async (
    collectionName: string, 
    conditions: QueryCondition[] = []
  ): Promise<number> => {
    setLoading(true);
    setError(null);

    try {
      const constraints: QueryConstraint[] = conditions.map(c => 
        where(c.field, c.operator, c.value)
      );
      
      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getCountFromServer(q);
      
      setLoading(false);
      return snapshot.data().count;
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    state,
    addDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    addToArray,
    removeFromArray,
    getCount
  };
}
import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { useFirebase } from '../contexts/FirebaseContext';

export interface FirestoreQuery {
  property: string;
  operator: any;
  value: any;
}

export interface FirestoreOrder {
  property: string;
  direction: 'asc' | 'desc';
}

export const useFirestore = () => {
  const { db } = useFirebase();

  const useCollection = <T>(
    path: string,
    queryParams: FirestoreQuery[] = [{ property: 'isActive', operator: '==', value: true }],
    queryOrder: FirestoreOrder[] = [{ property: 'name', direction: 'asc' }],
    queryLimit: number = 1000
  ) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const queryParamsString = useMemo(() => JSON.stringify(queryParams), [queryParams]);
    const queryOrderString = useMemo(() => JSON.stringify(queryOrder), [queryOrder]);

    useEffect(() => {
      const buildQuery = () => {
        const constraints: QueryConstraint[] = [];
        
        queryParams.forEach(param => {
          constraints.push(where(param.property, param.operator, param.value));
        });
        
        queryOrder.forEach(order => {
          constraints.push(orderBy(order.property, order.direction));
        });
        
        constraints.push(limit(queryLimit));
        
        return query(collection(db, path), ...constraints);
      };

      const unsubscribe = onSnapshot(
        buildQuery(),
        (snapshot) => {
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(documents);
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }, [db, path, queryParamsString, queryOrderString, queryLimit]);

    return { data, loading, error };
  };

  const useDocument = <T>(path: string) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const unsubscribe = onSnapshot(
        doc(db, path),
        (snapshot) => {
          if (snapshot.exists()) {
            setData({ id: snapshot.id, ...snapshot.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }, [path]);

    return { data, loading, error };
  };

  const addDocument = async (path: string, data: any) => {
    const ref = collection(db, path);
    const docData = {
      ...setUndefinedValuesToNull(data),
      modifiedOn: serverTimestamp(),
      createdOn: serverTimestamp(),
    };
    return addDoc(ref, docData);
  };

  const setDocument = async (path: string, data: any) => {
    const ref = doc(db, path);
    const docData = {
      ...setUndefinedValuesToNull(data),
      modifiedOn: serverTimestamp(),
      createdOn: serverTimestamp(),
    };
    return setDoc(ref, docData);
  };

  const updateDocument = async (path: string, data: any) => {
    const ref = doc(db, path);
    const docData = {
      ...setUndefinedValuesToNull(data),
      modifiedOn: serverTimestamp()
    };
    return updateDoc(ref, docData);
  };

  const deleteDocument = async (path: string) => {
    const ref = doc(db, path);
    return deleteDoc(ref);
  };

  const getDocument = async (path: string) => {
    const ref = doc(db, path);
    return getDoc(ref);
  };

  const setUndefinedValuesToNull = (data: any) => {
    const result = { ...data };
    Object.keys(result).forEach(key => {
      if (result[key] === undefined) {
        result[key] = null;
      }
    });
    return result;
  };

  return {
    useCollection,
    useDocument,
    addDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    timestamp: serverTimestamp
  };
};

export default useFirestore;
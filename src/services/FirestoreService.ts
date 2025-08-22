import { 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    doc, 
    getDoc, 
    addDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    serverTimestamp,
    onSnapshot,
    getCountFromServer,
    arrayUnion,
    arrayRemove,
    Firestore,
    CollectionReference,
    DocumentData
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FirestoreQuery, FirestoreOrder } from '../types/Firestore';
import { FirestoreUtils } from '../utils/firestore';

export class FirestoreService {
    private _db: Firestore;

    constructor(firestore: Firestore) {
        this._db = firestore;
    }

    get timestamp() {
        return serverTimestamp();
    }

    createId(): string {
        return doc(collection(this._db, 'temp')).id;
    }

    col$<T>(
        path: string,
        queryParams: FirestoreQuery[] = [{ property: 'isActive', operator: '==', value: true }],
        queryOrder: FirestoreOrder[] = [{ property: 'name', direction: 'asc' }],
        queryLimit: number = 1000
    ): Observable<T[]> {
        return new Observable<T[]>((observer) => {
            const collectionRef = collection(this._db, path);
            const conditions = this._buildQueryList(queryParams);
            const orderConditions = this._buildOrder(queryOrder);
            
            const q = query(
                collectionRef,
                ...conditions,
                ...orderConditions,
                limit(queryLimit)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data: T[] = [];
                snapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as T);
                });
                observer.next(data);
            }, (error) => {
                observer.error(error);
            });

            return () => unsubscribe();
        });
    }

    doc$<T>(path: string): Observable<T> {
        return new Observable<T>((observer) => {
            const docRef = doc(this._db, path);

            const unsubscribe = onSnapshot(docRef, (snapshot) => {
                if (snapshot.exists()) {
                    observer.next({ id: snapshot.id, ...snapshot.data() } as T);
                } else {
                    observer.error(new Error('Document does not exist'));
                }
            }, (error) => {
                observer.error(error);
            });

            return () => unsubscribe();
        });
    }

    async count(path: string, queryParams: FirestoreQuery[] = [{ property: 'isActive', operator: '==', value: true }]): Promise<number> {
        const collectionRef = collection(this._db, path);
        const conditions = this._buildQueryList(queryParams);
        const q = query(collectionRef, ...conditions);
        
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    }

    add(path: string, data: any) {
        const collectionRef = collection(this._db, path);
        return addDoc(collectionRef, {
            ...FirestoreUtils.setUndefinedValuesToNull(data),
            modifiedOn: this.timestamp,
            createdOn: this.timestamp,
        });
    }

    set(path: string, data: any) {
        const docRef = doc(this._db, path);
        return setDoc(docRef, {
            ...FirestoreUtils.setUndefinedValuesToNull(data),
            modifiedOn: this.timestamp,
            createdOn: this.timestamp,
        });
    }

    get(path: string) {
        const docRef = doc(this._db, path);
        return getDoc(docRef);
    }

    update(path: string, data: any) {
        const docRef = doc(this._db, path);
        return updateDoc(docRef, {
            ...FirestoreUtils.setUndefinedValuesToNull(data),
            modifiedOn: this.timestamp
        });
    }

    delete(path: string) {
        const docRef = doc(this._db, path);
        return deleteDoc(docRef);
    }

    addToArray(path: string, field: string, value: any) {
        const docRef = doc(this._db, path);
        return updateDoc(docRef, {
            [field]: arrayUnion(value),
            modifiedOn: this.timestamp
        });
    }

    removeFromArray(path: string, field: string, value: any) {
        const docRef = doc(this._db, path);
        return updateDoc(docRef, {
            [field]: arrayRemove(value),
            modifiedOn: this.timestamp
        });
    }

    private _buildQueryList(list: FirestoreQuery[]) {
        return list.map((condition) => where(condition.property, condition.operator, condition.value));
    }

    private _buildOrder(order: FirestoreOrder[]) {
        return order.map((value) => orderBy(value.property, value.direction));
    }
}
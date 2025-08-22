import { OrderByDirection, WhereFilterOp } from 'firebase/firestore';

export interface FirestoreQuery {
    property: string;
    operator: WhereFilterOp;
    value: unknown;
}

export interface FirestoreOrder {
    property: string;
    direction: OrderByDirection;
}

export interface FirestoreDocument {
    id: string;
    isActive: boolean;
}
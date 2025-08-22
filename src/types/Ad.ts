import { Timestamp } from 'firebase/firestore';

export type AdTypeTypes = 
    | 'banner'
    | 'full';

export interface Ad {
    id: string;
    name: string;
    isActive: boolean;
    keywords?: string[];
    linkURL: string;
    imageURL?: string;
    startDate?: Timestamp;
    endDate?: Timestamp;
    type: AdTypeTypes;
}
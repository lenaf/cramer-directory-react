import { Timestamp } from 'firebase/firestore';

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  type?: string;
  description: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
  imageURL: string;
  location: {
    name: string;
    city: string;
    state: string;
    zipcode: string;
  };
  actions: { label: string; linkURL: string; fill?: boolean; color?: string }[];
  isActive: boolean;
  weight: number;
}
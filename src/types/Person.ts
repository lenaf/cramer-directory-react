import { Company } from "./Company";

export interface PersonContactEmailAddress {
  label: string;
  name: string;
  weight: number;
}

export interface PersonContactPhoneNumber {
  label: string;
  phoneNumber: string;
  weight: number;
}

export interface PersonContactPostalAddress {
  label: string;
  street: string;
  street_2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PersonContactLink {
  label: string;
  type: string;
  url: string;
}

export interface PersonExperience {
  title: string;
  companyId: string;
  weight: number;
}

export interface Person {
  id: string;
  objectID?: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  about?: string;
  skills?: string[];
  experience?: PersonExperience[];
  responsibilities?: string;
  photoURL?: string;
  imageName?: string;
  imageURL?: string;

  // Relationship
  companyIds?: string[];
  companyId?: string;

  // Lookup
  companies?: Company[] | null;
  company?: Company | null;

  emailAddresses?: PersonContactEmailAddress[];
  phoneNumbers?: PersonContactPhoneNumber[];
  postalAddresses?: PersonContactPostalAddress[];
  links?: PersonContactLink[];

  tags?: any[];
}

export interface PersonAlgolia extends Person {
  objectID: string;
  _highlightResult: Record<
    keyof Person,
    { value: any; matchLevel: string; matchedWords: string[] }
  >;
}

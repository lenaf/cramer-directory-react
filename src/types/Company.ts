export interface Company {
  id: string;
  objectID?: string;
  isActive: boolean;
  name: string;
  description: string;
  categoryIds: any[];
  imageName?: string;
  markURL: string;
  logoURL?: string;
  websiteUrl: string;
  postalAddress: {
    label: string;
    street: string;
    street_2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
}

export interface CompanyAlgolia extends Company {
  _highlightResult: Record<string, { value: any; matchLevel: string; matchedWords: string[] }>;
}
export interface Category {
    id: string;
    objectID?: string;
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
}

export interface CategoryAlgolia extends Category {
    _highlightResult: Record<keyof Category, {value: any, matchLevel: string, matchedWords: string[]}>;
}
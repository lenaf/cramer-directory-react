export interface Tab {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    advertisement?: TabAdvertisement;
    isActive?: boolean;
    weight?: number;
}

export interface TabAdvertisement {
    frequency: number;
}
export interface NavigationItem {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    icon?: string;
    link: string;
    isExternalLink: boolean;
    isActive: boolean;
    weight: number;
}
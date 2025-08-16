import React, { createContext, useContext, useState } from 'react';

export interface NavigationItem {
  id: string;
  title: string;
  link: string;
  icon?: string;
  isExternalLink?: boolean;
}

interface NavigationContextType {
  navigation: NavigationItem[];
  setNavigation: (items: NavigationItem[]) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  navigation: [],
  setNavigation: () => {}
});

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationItem[]>([
    { id: '1', title: 'Home', link: '/tabs/home', icon: 'home-outline' },
    { id: '2', title: 'Companies', link: '/tabs/company', icon: 'business-outline' },
    { id: '3', title: 'People', link: '/tabs/people', icon: 'people-outline' },
    { id: '4', title: 'Categories', link: '/tabs/category', icon: 'grid-outline' },
    { id: '5', title: 'Profile', link: '/tabs/profile', icon: 'person-outline' }
  ]);

  return (
    <NavigationContext.Provider value={{ navigation, setNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};
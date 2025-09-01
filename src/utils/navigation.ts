import { History } from 'history';
import { getCachedEntityName } from './cache';

export const getPreviousRouteName = (history: History) => {
  const state = history.location.state as any;
  const previousPath = state?.from || '/people';
  
  // If we have a specific name from the previous route, use it
  if (state?.fromName) return state.fromName;
  
  // Check if previous path is a specific person or company detail page
  const personMatch = previousPath.match(/\/people\/([^/]+)/);
  const companyMatch = previousPath.match(/\/company\/([^/]+)/);
  
  if (personMatch) {
    const cachedName = getCachedEntityName(personMatch[1]);
    if (cachedName) return cachedName;
  }
  
  if (companyMatch) {
    const cachedName = getCachedEntityName(companyMatch[1]);
    if (cachedName) return cachedName;
  }
  
  // Otherwise use generic route names
  if (previousPath.includes('/company')) return 'Companies';
  if (previousPath.includes('/people')) return 'People';
  if (previousPath.includes('/home')) return 'Home';
  return 'Back';
};
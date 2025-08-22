# React Firestore Hooks

This directory contains the Firestore implementation following React best practices.

## Architecture Overview

### 🔥 Core Firebase Setup (`/src/lib/firebase.ts`)
- Direct Firebase initialization without React Context
- Static exports for `db`, `auth`, `storage`, and `functions`
- Centralized emulator configuration

### 🪝 Base Hooks

#### `useFirestoreCollection<T>(collection, options)`
- Generic hook for real-time collection queries
- Supports filtering, sorting, and limiting
- Automatic loading states and error handling
- Optimized with `useCallback` and `useRef` for performance

#### `useFirestoreDocument<T>(path, options)`  
- Generic hook for real-time document subscription
- Existence checking built-in
- Automatic cleanup on unmount

#### `useFirestoreMutations()`
- All CRUD operations in one hook
- Automatic timestamp management
- Array operations (`addToArray`, `removeFromArray`)
- Count operations with filtering
- Centralized error handling

### 🎯 Entity-Specific Hooks

Each entity type has dedicated, focused hooks:

| Entity | Hooks Available |
|--------|----------------|
| **Companies** | `useCompanies()`, `useCompaniesByCategory()`, `useCompany()`, `useCompanyMutations()`, `useCompanySearch()` |
| **People** | `usePeople()`, `usePeopleByCompany()`, `usePerson()`, `usePersonMutations()`, `usePersonSearch()` |
| **Categories** | `useCategories()`, `useCategory()`, `useCategoryMutations()` |
| **Events** | `useEvents()`, `useUpcomingEvents()`, `usePastEvents()`, `useEventsByType()`, `useEvent()`, `useEventMutations()` |
| **Content** | `useCommunity()`, `usePillars()`, `useResources()`, `useTabs()`, `useAds()`, `useRandomAdByType()` |
| **Users** | `useUser()`, `useFavorites()`, `useFavoriteCompanies()`, `useFavoritePeople()`, `useUserMutations()` |

## Usage Examples

### Basic Collection Query
\`\`\`tsx
import { useCompanies } from '../hooks/useCompanies';

function CompanyList() {
  const { data: companies, loading, error, refetch } = useCompanies();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {companies.map(company => (
        <div key={company.id}>{company.name}</div>
      ))}
    </div>
  );
}
\`\`\`

### Search with Client-side Filtering
\`\`\`tsx
import { useCompanySearch } from '../hooks/useCompanies';

function CompanySearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: results, loading } = useCompanySearch(searchTerm);
  
  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search companies..."
      />
      {results.map(company => (
        <div key={company.id}>{company.name}</div>
      ))}
    </div>
  );
}
\`\`\`

### CRUD Operations
\`\`\`tsx
import { useCompanyMutations } from '../hooks/useCompanies';

function CompanyForm() {
  const { addCompany, updateCompany, loading } = useCompanyMutations();
  
  const handleSubmit = async (companyData) => {
    try {
      await addCompany(companyData);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={loading} type="submit">
        {loading ? 'Saving...' : 'Save Company'}
      </button>
    </form>
  );
}
\`\`\`

### Favorites Management
\`\`\`tsx
import { useFavorites } from '../hooks/useUser';

function FavoriteButton({ itemId }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  return (
    <button onClick={() => toggleFavorite(itemId)}>
      {isFavorite(itemId) ? '❤️' : '🤍'}
    </button>
  );
}
\`\`\`

## Benefits of This Approach

### ✅ **React Best Practices**
- Direct Firebase imports (no unnecessary context)
- Proper hook composition and reusability
- Built-in loading states and error handling
- Optimized re-renders with `useMemo` and `useCallback`

### ✅ **Performance** 
- Automatic subscription cleanup
- Efficient query caching
- Client-side filtering for search
- Minimal re-renders

### ✅ **Type Safe**
- Full TypeScript coverage
- Generic hooks with proper typing
- Compile-time error checking

### ✅ **Developer Experience**
- Focused, single-purpose hooks
- Consistent API patterns
- Built-in error handling
- Clear loading states

### ✅ **Maintainable**
- Separation of concerns
- Easy to test
- No complex service layers
- Standard React patterns

## Migration Guide

### Old Pattern (Service + Context)
\`\`\`tsx
// ❌ Old way - complex service layer
const { firestoreService } = useServices();
const [companies, setCompanies] = useState([]);

useEffect(() => {
  const sub = firestoreService.col$<Company>('company').subscribe(setCompanies);
  return () => sub.unsubscribe();
}, []);
\`\`\`

### New Pattern (Optimized Hooks)
\`\`\`tsx
// ✅ New way - simple, focused hooks
const { data: companies, loading, error } = useCompanies();
\`\`\`

The new approach eliminates:
- Complex service layer abstraction
- Unnecessary contexts
- Manual subscription management  
- Boilerplate state management
- RxJS dependencies for simple cases

## Legacy Support

The old service-based approach is still available for backwards compatibility, but new code should use the optimized hooks pattern.
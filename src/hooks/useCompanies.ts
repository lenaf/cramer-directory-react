import { useMemo } from 'react';
import { Company } from '../types/Company';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useFirestoreDocument } from './useFirestoreDocument';
import { useFirestoreMutations } from './useFirestoreMutations';

// Hook for all companies
export function useCompanies() {
  return useFirestoreCollection<Company>('company', {
    queries: [{ field: 'isActive', operator: '==', value: true }],
    sorts: [{ field: 'name', direction: 'asc' }]
  });
}

// Hook for companies by category
export function useCompaniesByCategory(categoryId?: string) {
  const queries = useMemo(() => {
    const baseQueries: Array<{ field: string; operator: any; value: unknown }> = [
      { field: 'isActive', operator: '==', value: true }
    ];
    if (categoryId) {
      baseQueries.push({ field: 'categoryIds', operator: 'array-contains', value: categoryId });
    }
    return baseQueries;
  }, [categoryId]);

  return useFirestoreCollection<Company>('company', {
    queries,
    sorts: [{ field: 'name', direction: 'asc' }],
    enabled: !!categoryId
  });
}

// Hook for a single company
export function useCompany(id?: string) {
  return useFirestoreDocument<Company>(id ? `company/${id}` : '', {
    enabled: !!id
  });
}

// Hook for company mutations
export function useCompanyMutations() {
  const mutations = useFirestoreMutations();

  const addCompany = async (companyData: Omit<Company, 'id'>) => {
    return mutations.addDocument('company', companyData);
  };

  const updateCompany = async (id: string, companyData: Partial<Company>) => {
    return mutations.updateDocument(`company/${id}`, companyData);
  };

  const deleteCompany = async (id: string) => {
    // Soft delete by setting isActive to false
    return mutations.updateDocument(`company/${id}`, { isActive: false });
  };

  const getCompanyCount = async () => {
    return mutations.getCount('company', [
      { field: 'isActive', operator: '==', value: true }
    ]);
  };

  return {
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyCount,
    ...mutations.state
  };
}

// Hook for searching companies (client-side filtering)
export function useCompanySearch(searchTerm: string = '') {
  const { data: companies, loading, error } = useCompanies();

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return companies;
    
    const term = searchTerm.toLowerCase();
    return companies.filter(company =>
      company.name?.toLowerCase().includes(term) ||
      company.description?.toLowerCase().includes(term) ||
      company.postalAddress?.city?.toLowerCase().includes(term) ||
      company.postalAddress?.state?.toLowerCase().includes(term)
    );
  }, [companies, searchTerm]);

  return {
    data: filteredCompanies,
    loading,
    error,
    totalCount: companies.length
  };
}
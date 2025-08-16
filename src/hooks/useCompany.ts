import { useState, useCallback } from 'react';
import { Company } from '../types/Company';
import useFirestore from './useFirestore';

export const useCompany = () => {
  const { useDocument } = useFirestore();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const getCompanyById = useCallback((id: string) => {
    return useDocument<Company>(`/company/${id}`);
  }, [useDocument]);

  const selectCompany = useCallback((company: Company | null) => {
    setSelectedCompany(company);
  }, []);

  return {
    selectedCompany,
    getCompanyById,
    selectCompany
  };
};
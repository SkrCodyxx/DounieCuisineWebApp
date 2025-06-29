import React, { createContext, useContext, useEffect, useState } from 'react';
import { Company } from '../types';
import { supabase } from '../lib/supabase';

interface CompanyContextType {
  company: Company | null;
  loading: boolean;
  updateCompany: (data: Partial<Company>) => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany doit être utilisé dans un CompanyProvider');
  }
  return context;
}

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCompany(data);
      } else {
        // Créer une entrée par défaut si aucune n'existe
        const defaultCompany = {
          name: 'Dounie Cuisine Pro',
          slogan: 'Saveurs authentiques des Caraïbes',
          address: '123 Rue Saint-Laurent',
          city: 'Montréal',
          province: 'QC',
          postal_code: 'H2X 2T3',
          phone: '(514) 123-4567',
          email: 'info@dounieculsinepro.com',
          business_hours: {
            lundi: { open: '09:00', close: '18:00', closed: false },
            mardi: { open: '09:00', close: '18:00', closed: false },
            mercredi: { open: '09:00', close: '18:00', closed: false },
            jeudi: { open: '09:00', close: '18:00', closed: false },
            vendredi: { open: '09:00', close: '20:00', closed: false },
            samedi: { open: '10:00', close: '20:00', closed: false },
            dimanche: { open: '10:00', close: '17:00', closed: false },
          },
          social_media: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
          },
          tps_rate: 5.0,
          tvq_rate: 9.975,
        };

        const { data: newCompany, error: createError } = await supabase
          .from('companies')
          .insert(defaultCompany)
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        setCompany(newCompany);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de l\'entreprise:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (data: Partial<Company>) => {
    try {
      if (!company) return;

      const { data: updatedCompany, error } = await supabase
        .from('companies')
        .update(data)
        .eq('id', company.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCompany(updatedCompany);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
      throw error;
    }
  };

  const value = {
    company,
    loading,
    updateCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}
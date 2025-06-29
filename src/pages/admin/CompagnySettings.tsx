import React from 'react';
import { useForm } from 'react-hook-form';
import { Save, Upload, MapPin, Phone, Mail, Globe, Clock } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import toast from 'react-hot-toast';

interface CompanyForm {
  name: string;
  slogan: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
  email: string;
  website: string;
  tax_number: string;
  tps_rate: number;
  tvq_rate: number;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
}

export default function CompanySettings() {
  const { company, updateCompany } = useCompany();
  const { register, handleSubmit, formState: { errors } } = useForm<CompanyForm>({
    defaultValues: {
      name: company?.name || '',
      slogan: company?.slogan || '',
      address: company?.address || '',
      city: company?.city || '',
      province: company?.province || '',
      postal_code: company?.postal_code || '',
      phone: company?.phone || '',
      email: company?.email || '',
      website: company?.website || '',
      tax_number: company?.tax_number || '',
      tps_rate: company?.tps_rate || 5.0,
      tvq_rate: company?.tvq_rate || 9.975,
      facebook: company?.social_media?.facebook || '',
      instagram: company?.social_media?.instagram || '',
      twitter: company?.social_media?.twitter || '',
      linkedin: company?.social_media?.linkedin || '',
    }
  });

  const onSubmit = async (data: CompanyForm) => {
    try {
      await updateCompany({
        name: data.name,
        slogan: data.slogan,
        address: data.address,
        city: data.city,
        province: data.province,
        postal_code: data.postal_code,
        phone: data.phone,
        email: data.email,
        website: data.website,
        tax_number: data.tax_number,
        tps_rate: data.tps_rate,
        tvq_rate: data.tvq_rate,
        social_media: {
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
          linkedin: data.linkedin,
        },
      });
      toast.success('Paramètres mis à jour avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const daysOfWeek = [
    { key: 'lundi', label: 'Lundi' },
    { key: 'mardi', label: 'Mardi' },
    { key: 'mercredi', label: 'Mercredi' },
    { key: 'jeudi', label: 'Jeudi' },
    { key: 'vendredi', label: 'Vendredi' },
    { key: 'samedi', label: 'Samedi' },
    { key: 'dimanche', label: 'Dimanche' },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Paramètres de l'entreprise
        </h1>
        <p className="text-gray-600">
          Configurez les informations de votre entreprise
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations générales */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations générales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Le nom est requis' })}
                className="input-field"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan
              </label>
              <input
                type="text"
                {...register('slogan')}
                className="input-field"
                placeholder="Votre slogan"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de l'entreprise
            </label>
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-primary-100 rounded-lg flex items-center justify-center">
                {company?.logo_url ? (
                  <img src={company.logo_url} alt="Logo" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <span className="text-primary-600 font-bold text-2xl">D</span>
                )}
              </div>
              <button
                type="button"
                className="btn-outline flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Télécharger un logo
              </button>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Adresse
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <input
                type="text"
                {...register('address', { required: 'L\'adresse est requise' })}
                className="input-field"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  {...register('city', { required: 'La ville est requise' })}
                  className="input-field"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province *
                </label>
                <select
                  {...register('province', { required: 'La province est requise' })}
                  className="input-field"
                >
                  <option value="">Sélectionner</option>
                  <option value="QC">Québec</option>
                  <option value="ON">Ontario</option>
                  <option value="BC">Colombie-Britannique</option>
                  <option value="AB">Alberta</option>
                  <option value="MB">Manitoba</option>
                  <option value="SK">Saskatchewan</option>
                  <option value="NS">Nouvelle-Écosse</option>
                  <option value="NB">Nouveau-Brunswick</option>
                  <option value="NL">Terre-Neuve-et-Labrador</option>
                  <option value="PE">Île-du-Prince-Édouard</option>
                </select>
                {errors.province && (
                  <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal *
                </label>
                <input
                  type="text"
                  {...register('postal_code', { required: 'Le code postal est requis' })}
                  className="input-field"
                  placeholder="H2X 2T3"
                />
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations de contact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Téléphone *
              </label>
              <input
                type="tel"
                {...register('phone', { required: 'Le téléphone est requis' })}
                className="input-field"
                placeholder="(514) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email invalide'
                  }
                })}
                className="input-field"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4 inline mr-1" />
                Site web
              </label>
              <input
                type="url"
                {...register('website')}
                className="input-field"
                placeholder="https://www.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro fiscal
              </label>
              <input
                type="text"
                {...register('tax_number')}
                className="input-field"
                placeholder="123456789"
              />
            </div>
          </div>
        </div>

        {/* Taxes */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Configuration des taxes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux TPS (%) *
              </label>
              <input
                type="number"
                step="0.001"
                {...register('tps_rate', { 
                  required: 'Le taux TPS est requis',
                  min: { value: 0, message: 'Le taux doit être positif' }
                })}
                className="input-field"
              />
              {errors.tps_rate && (
                <p className="mt-1 text-sm text-red-600">{errors.tps_rate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux TVQ (%) *
              </label>
              <input
                type="number"
                step="0.001"
                {...register('tvq_rate', { 
                  required: 'Le taux TVQ est requis',
                  min: { value: 0, message: 'Le taux doit être positif' }
                })}
                className="input-field"
              />
              {errors.tvq_rate && (
                <p className="mt-1 text-sm text-red-600">{errors.tvq_rate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Réseaux sociaux
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                {...register('facebook')}
                className="input-field"
                placeholder="https://facebook.com/votrepage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                {...register('instagram')}
                className="input-field"
                placeholder="https://instagram.com/votrepage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                {...register('twitter')}
                className="input-field"
                placeholder="https://twitter.com/votrepage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                {...register('linkedin')}
                className="input-field"
                placeholder="https://linkedin.com/company/votrepage"
              />
            </div>
          </div>
        </div>

        {/* Horaires d'ouverture */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Horaires d'ouverture
          </h2>
          
          <div className="space-y-4">
            {daysOfWeek.map((day) => {
              const dayHours = company?.business_hours?.[day.key] || { open: '09:00', close: '18:00', closed: false };
              
              return (
                <div key={day.key} className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700">{day.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={!dayHours.closed}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Ouvert</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      defaultValue={dayHours.open}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <span className="text-sm text-gray-600">à</span>
                    <input
                      type="time"
                      defaultValue={dayHours.close}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Sauvegarder les modifications
          </button>
        </div>
      </form>
    </div>
  );
}
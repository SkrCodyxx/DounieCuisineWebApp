import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Users, Clock, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReservationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  eventType: string;
  venue: string;
  specialRequests: string;
}

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ReservationForm>();

  const eventTypes = [
    'Mariage',
    'Anniversaire',
    'Événement corporatif',
    'Baptême/Communion',
    'Graduation',
    'Réunion de famille',
    'Autre',
  ];

  const onSubmit = async (data: ReservationForm) => {
    try {
      // Ici, vous intégreriez avec Supabase pour sauvegarder la réservation
      console.log('Données de réservation:', data);
      toast.success('Votre demande de réservation a été envoyée avec succès !');
      // Rediriger ou réinitialiser le formulaire
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la réservation');
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Réservation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Planifions ensemble votre événement mémorable
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de réservation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Indicateur d'étapes */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          step >= stepNumber
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div
                          className={`flex-1 h-1 mx-4 ${
                            step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Informations personnelles</span>
                  <span>Détails de l'événement</span>
                  <span>Confirmation</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Étape 1: Informations personnelles */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Vos informations
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          {...register('firstName', { required: 'Le prénom est requis' })}
                          className="input-field"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          {...register('lastName', { required: 'Le nom est requis' })}
                          className="input-field"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Le téléphone est requis' })}
                        className="input-field"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}

                {/* Étape 2: Détails de l'événement */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Détails de votre événement
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de l'événement *
                        </label>
                        <input
                          type="date"
                          {...register('eventDate', { required: 'La date est requise' })}
                          className="input-field"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.eventDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.eventDate.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heure de l'événement *
                        </label>
                        <input
                          type="time"
                          {...register('eventTime', { required: 'L\'heure est requise' })}
                          className="input-field"
                        />
                        {errors.eventTime && (
                          <p className="mt-1 text-sm text-red-600">{errors.eventTime.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre d'invités *
                        </label>
                        <input
                          type="number"
                          min="1"
                          {...register('guestCount', { 
                            required: 'Le nombre d\'invités est requis',
                            min: { value: 1, message: 'Minimum 1 invité' }
                          })}
                          className="input-field"
                        />
                        {errors.guestCount && (
                          <p className="mt-1 text-sm text-red-600">{errors.guestCount.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type d'événement *
                        </label>
                        <select
                          {...register('eventType', { required: 'Le type d\'événement est requis' })}
                          className="input-field"
                        >
                          <option value="">Sélectionner un type</option>
                          {eventTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.eventType && (
                          <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lieu de l'événement
                      </label>
                      <input
                        type="text"
                        {...register('venue')}
                        placeholder="Adresse ou nom du lieu"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Demandes spéciales
                      </label>
                      <textarea
                        {...register('specialRequests')}
                        rows={4}
                        placeholder="Allergies, préférences alimentaires, demandes particulières..."
                        className="input-field"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-outline"
                      >
                        Précédent
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}

                {/* Étape 3: Confirmation */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Confirmation de votre réservation
                    </h2>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Récapitulatif
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nom :</span>
                          <span className="font-medium">{watch('firstName')} {watch('lastName')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email :</span>
                          <span className="font-medium">{watch('email')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Téléphone :</span>
                          <span className="font-medium">{watch('phone')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date :</span>
                          <span className="font-medium">{watch('eventDate')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Heure :</span>
                          <span className="font-medium">{watch('eventTime')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invités :</span>
                          <span className="font-medium">{watch('guestCount')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type :</span>
                          <span className="font-medium">{watch('eventType')}</span>
                        </div>
                        {watch('venue') && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lieu :</span>
                            <span className="font-medium">{watch('venue')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Note :</strong> Cette demande de réservation sera examinée par notre équipe. 
                        Nous vous contacterons dans les 24 heures pour confirmer les détails et discuter du menu.
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-outline"
                      >
                        Précédent
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                      >
                        Confirmer la réservation
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Besoin d'aide ?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium">(514) 123-4567</p>
                    <p className="text-sm text-gray-600">Lun-Ven 9h-18h</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium">info@dounieculsinepro.com</p>
                    <p className="text-sm text-gray-600">Réponse sous 24h</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                Pourquoi nous choisir ?
              </h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Cuisine authentique haïtienne et caribéenne
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Service personnalisé et professionnel
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Ingrédients frais et de qualité
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Plus de 15 ans d'expérience
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import toast from 'react-hot-toast';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { company } = useCompany();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    try {
      // Ici, vous intégreriez avec Supabase pour sauvegarder le message
      console.log('Message de contact:', data);
      toast.success('Votre message a été envoyé avec succès !');
      reset();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const businessHours = company?.business_hours || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous sommes là pour répondre à toutes vos questions et vous accompagner dans vos projets
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                Nos coordonnées
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Adresse</h3>
                    <p className="text-gray-600 mt-1">
                      {company?.address}<br />
                      {company?.city}, {company?.province} {company?.postal_code}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Téléphone</h3>
                    <p className="text-gray-600 mt-1">
                      <a href={`tel:${company?.phone}`} className="hover:text-primary-600 transition-colors duration-200">
                        {company?.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600 mt-1">
                      <a href={`mailto:${company?.email}`} className="hover:text-primary-600 transition-colors duration-200">
                        {company?.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Heures d'ouverture</h3>
                    <div className="text-gray-600 mt-1 space-y-1">
                      {Object.entries(businessHours).map(([day, hours]: [string, any]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize">{day} :</span>
                          <span>
                            {hours?.closed ? 'Fermé' : `${hours?.open} - ${hours?.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte (placeholder) */}
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Carte interactive (à intégrer)</p>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
              Envoyez-nous un message
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Le nom est requis' })}
                  className="input-field"
                  placeholder="Votre nom complet"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="input-field"
                    placeholder="(514) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <select
                  {...register('subject', { required: 'Le sujet est requis' })}
                  className="input-field"
                >
                  <option value="">Sélectionner un sujet</option>
                  <option value="devis">Demande de devis</option>
                  <option value="reservation">Réservation</option>
                  <option value="information">Demande d'information</option>
                  <option value="reclamation">Réclamation</option>
                  <option value="autre">Autre</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message', { required: 'Le message est requis' })}
                  rows={6}
                  className="input-field"
                  placeholder="Décrivez votre demande en détail..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Envoyer le message
              </button>
            </form>
          </div>
        </div>

        {/* Section FAQ */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Combien de temps à l'avance dois-je réserver ?
              </h3>
              <p className="text-gray-600">
                Nous recommandons de réserver au moins 2 semaines à l'avance pour les petits événements 
                et 1 mois pour les grands événements comme les mariages.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Proposez-vous des menus végétariens ?
              </h3>
              <p className="text-gray-600">
                Oui, nous proposons des options végétariennes et pouvons adapter nos plats 
                selon vos besoins alimentaires spécifiques.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Livrez-vous partout à Montréal ?
              </h3>
              <p className="text-gray-600">
                Nous livrons dans tout le Grand Montréal. Des frais de livraison peuvent 
                s'app liquer selon la distance.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Comment obtenir un devis ?
              </h3>
              <p className="text-gray-600">
                Vous pouvez demander un devis en ligne via notre formulaire de réservation 
                ou en nous contactant directement par téléphone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
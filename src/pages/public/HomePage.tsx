import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Calendar, Award } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';

export default function HomePage() {
  const { company } = useCompany();

  const features = [
    {
      icon: Star,
      title: 'Cuisine Authentique',
      description: 'Saveurs traditionnelles haïtiennes et caribéennes préparées avec passion',
    },
    {
      icon: Users,
      title: 'Service Personnalisé',
      description: 'Équipe professionnelle dédiée à faire de votre événement un succès',
    },
    {
      icon: Calendar,
      title: 'Tous Événements',
      description: 'Mariages, anniversaires, événements corporatifs et célébrations privées',
    },
    {
      icon: Award,
      title: 'Qualité Premium',
      description: 'Ingrédients frais et de qualité supérieure pour des plats exceptionnels',
    },
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      event: 'Mariage',
      text: 'Un service exceptionnel ! Les saveurs étaient authentiques et nos invités ont adoré.',
      rating: 5,
    },
    {
      name: 'Jean-Pierre Laurent',
      event: 'Événement corporatif',
      text: 'Professionnalisme et qualité au rendez-vous. Je recommande vivement !',
      rating: 5,
    },
    {
      name: 'Sophie Martin',
      event: 'Anniversaire',
      text: 'Une expérience culinaire mémorable. Merci pour cette belle soirée !',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Section Hero */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="relative min-h-screen flex items-center bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                Saveurs Authentiques des Caraïbes
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
                Service traiteur haut de gamme spécialisé dans la cuisine haïtienne et caribéenne. 
                Nous créons des expériences culinaires mémorables pour tous vos événements à Montréal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  Découvrir notre menu
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/reservation"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Réserver maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Caractéristiques */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Pourquoi choisir Dounie Cuisine Pro ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre expertise et notre passion pour la cuisine caribéenne font de nous le partenaire idéal pour vos événements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                Une tradition culinaire d'excellence
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Depuis notre création, nous nous engageons à préserver et partager les saveurs authentiques 
                de la cuisine haïtienne et caribéenne. Chaque plat est préparé avec des ingrédients frais 
                et de qualité supérieure, dans le respect des traditions culinaires ancestrales.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Notre équipe de chefs expérimentés met tout son savoir-faire au service de vos événements, 
                qu'il s'agisse de mariages, d'anniversaires, d'événements corporatifs ou de célébrations privées.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center btn-primary"
              >
                En savoir plus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Chef préparant un plat traditionnel"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">15+</div>
                    <div className="text-sm text-gray-600">Années d'expérience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">500+</div>
                    <div className="text-sm text-gray-600">Événements réussis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de ceux qui nous ont fait confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-24 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Prêt à créer votre événement mémorable ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour discuter de vos besoins et recevoir un devis personnalisé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reservation"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Faire une réservation
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
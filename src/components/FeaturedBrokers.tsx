"use client";
import Link from 'next/link';
import Image from 'next/image'; // Ensure Image is imported
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Broker {
  id: string;
  name: string;
  logo_url: string | null; // Changed from logo to logo_url to match DB
  rating: number;
  bonus: string;
  features: string[];
  risk_note: string; // Changed from riskNote to risk_note
  active?: boolean;
  is_featured?: boolean;
}

// Funktion zur Generierung eines Slugs aus einem String
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Leerzeichen durch Bindestriche ersetzen
    .replace(/[^\w-]+/g, '') // Alle Nicht-Wort-Zeichen entfernen
    .replace(/--+/g, '-') // Mehrere Bindestriche durch einen ersetzen
    .replace(/^-+/, '') // Bindestriche am Anfang entfernen
    .replace(/-+$/, ''); // Bindestriche am Ende entfernen
};

export function FeaturedBrokers() {
  const [brokers, setBrokers] = useState<Broker[]>([]);

  useEffect(() => {
    const fetchBrokers = async () => {
      const { data, error } = await supabase
        .from('brokers')
        // Select specific columns including the logo URL
        .select('id, name, logo_url, rating, bonus, features, risk_note, is_featured, active')
        .eq('active', true)
        .eq('is_featured', true)
        .order('rating', { ascending: false }); // Assuming you want highest rated featured first

      console.log('Geladene Featured Broker:', data); // Log fetched data

      if (error) {
        console.error('Fehler beim Laden der Featured Broker:', error);
      } else {
        // Ensure data conforms to the Broker interface, especially logo_url and risk_note
        const formattedData = data?.map(broker => ({
          ...broker,
          logo_url: broker.logo_url, // Ensure mapping if needed
          risk_note: broker.risk_note || 'N/A', // Provide default if null
          features: broker.features || [], // Provide default if null
          bonus: broker.bonus || 'N/A', // Provide default if null
          slug: slugify(broker.name) // Slug generieren
        })) || [];
        setBrokers(formattedData);
      }
    };

    fetchBrokers();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && halfStar) {
        // Represent half star as full for simplicity, adjust if needed
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-gray-700">{rating ? rating.toFixed(1) : 'N/A'}</span> {/* Handle potential null rating */}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <span className="text-yellow-400 text-2xl mr-2">★</span>
          <h2 className="text-3xl font-bold">Featured Brokers</h2>
        </div>
        <p className="text-gray-600 mb-12">Our handpicked selection of top online brokers with exclusive bonuses</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brokers.map((broker) => (
            <div key={broker.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"> {/* Added flex flex-col */}
              <div className="p-6 flex-grow"> {/* Added flex-grow */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 mr-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                    {/* Display Logo using next/image or fallback */}
                    <div className="relative w-full h-full rounded-md overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
                      {broker.logo_url ? (
                        <Image
                          src={broker.logo_url}
                          alt={`${broker.name} Logo`}
                          layout="fill" // Use fill layout
                          objectFit="contain" // Ensure logo fits within bounds
                          unoptimized={process.env.NODE_ENV === 'development'} // Consider optimization in production
                        />
                      ) : (
                        // Fallback to initials if no logo URL
                        <span>{broker.name.split(' ').map(word => word[0]).join('')}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{broker.name}</h3>
                    {renderStars(broker.rating)}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-blue-700 font-medium">{broker.bonus}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  {broker.features?.slice(0, 4).map((feature, index) => ( // Added optional chaining and slice
                    <div key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span> {/* Adjusted text size */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer section of the card */}
              <div className="p-6 pt-0 mt-auto"> {/* Added mt-auto to push to bottom */}
                <Link
                  href={`/broker/${broker.id}`} // Use slug if available and preferred
                  className="block w-full bg-[#145588] hover:bg-[#0e3e66] text-white text-center py-3 rounded-md font-medium transition duration-200"
                >
                  Visit Broker
                </Link>

                <p className="text-gray-400 text-xs text-center mt-2">
                  (Risk note: {broker.risk_note})
                </p>

                <Link
                  href={`/cfd-brokers/${slugify(broker.name)}`} // Link auf /cfd-brokers/[slug] geändert
                  className="block w-full text-center text-blue-600 hover:text-blue-800 mt-4 font-medium"
                >
                  Read Review →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
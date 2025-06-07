// src/components/BrokerCard.tsx - Updated version with Risk Note function
import Link from 'next/link';
import Image from 'next/image';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getRiskWarningSync } from '@/lib/riskWarning'; // NEU importieren

// Interface for the props the BrokerCard component expects
interface BrokerCardProps {
  id: number | string;
  name: string;
  slug: string;
  logo_url: string | null;
  rating: number;
  bonus?: string | null;
  features?: string | string[] | null;
  regulation?: string | null;
  risk_note?: string | number | null; // Updated to accept number or string
  search_result_text?: string | null;
}

export const BrokerCard: React.FC<BrokerCardProps> = ({
  id, name, slug, logo_url, rating, bonus, features, regulation, risk_note, search_result_text
}) => {
  // NEU: Risk Warning aus der Datenbank holen (synchron für Client-Komponenten)
  const riskWarning = getRiskWarningSync(risk_note, 'cfd', 'en');

  return (
    <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row">
        {/* Logo und Name */}
        <div className="md:w-1/4 flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div className="relative w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 mb-4 overflow-hidden">
            {logo_url ? (
              <Image
                src={logo_url}
                alt={`${name} Logo`}
                fill
                style={{ objectFit: 'contain' }}
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            ) : (
              <span>{name.split(' ').map(word => word[0]).join('')}</span>
            )}
          </div>
          <h3 className="text-xl font-bold">{name}</h3>
          {renderStars(rating)}
        </div>

        {/* Beschreibung und Bonus */}
        <div className="md:w-2/4 md:px-6">
          {bonus && (
            <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm">
              <div className="flex items-start">
                <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-700 font-medium">{bonus}</span>
              </div>
            </div>
          )}

          {/* Display Search Result Text */}
          <p className="text-gray-600 mb-4 text-sm">{search_result_text || 'No short description available.'}</p>

          <div className="grid grid-cols-2 gap-2">
            {renderFeatures(features)}
          </div>

          <div className="mt-4 flex items-center">
            <ShieldCheck className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
            {renderLicenses(regulation)}
          </div>
        </div>

        {/* Buttons */}
        <div className="md:w-1/4 flex flex-col justify-center items-center mt-4 md:mt-0">
          <Link
            href={`/cfd-brokers/${slug}`}
            className="w-full text-center py-3 rounded-md font-medium transition duration-200 mb-2 hover:opacity-90"
            style={{backgroundColor: '#145588', color: 'white'}}
          >
            Visit Broker
          </Link>

          <p className="text-gray-400 text-xs text-center mb-4">
            (Risk note: {riskWarning})
          </p>

          <Link
            href={`/cfd-brokers/${slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read Review →
          </Link>
        </div>
      </div>
    </div>
  );
};
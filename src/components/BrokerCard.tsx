// src/components/BrokerCard.tsx - Fixed version with Risk Warning
import Link from 'next/link';
import Image from 'next/image';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getRiskWarningSync } from '@/lib/riskWarning';

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
  risk_note?: string | number | null;
  search_result_text?: string | null;
}

// Helper function to render star ratings
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <Star key="half" className="h-4 w-4 text-yellow-400 fill-current opacity-50" />
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
    );
  }

  return (
    <div className="flex items-center">
      {stars}
      <span className="ml-2 text-sm text-gray-600">({rating})</span>
    </div>
  );
};

// Helper function to render features
const renderFeatures = (features: string | string[] | null | undefined) => {
  if (!features) return null;

  const featuresArray = Array.isArray(features) ? features : [features];
  
  return featuresArray.slice(0, 4).map((feature, index) => (
    <div key={index} className="flex items-center text-sm text-gray-600">
      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
      <span className="truncate">{feature}</span>
    </div>
  ));
};

// Helper function to render regulation/licenses
const renderLicenses = (regulation: string | null | undefined) => {
  if (!regulation) {
    return <span className="text-xs text-gray-500">Regulation info not available</span>;
  }

  const licenses = regulation.split(',').map(license => license.trim()).filter(Boolean);
  const displayLimit = 8;
  const displayedLicenses = licenses.slice(0, displayLimit);
  const remainingCount = licenses.length - displayLimit;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {displayedLicenses.map((license, index) => (
        <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {license}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 font-medium">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export const BrokerCard: React.FC<BrokerCardProps> = ({
  id, name, slug, logo_url, rating, bonus, features, regulation, risk_note, search_result_text
}) => {
  // Get risk warning from the database (sync for client components)
  // Convert undefined to null to match the expected type
  const normalizedRiskNote = risk_note === undefined ? null : risk_note;
  const riskWarning = getRiskWarningSync(normalizedRiskNote, 'cfd', 'en');

  return (
    <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row">
        {/* Logo and Name */}
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

        {/* Description and Bonus */}
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
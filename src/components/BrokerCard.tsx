import Link from 'next/link';
import Image from 'next/image';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react'; // Import necessary icons

// Interface for the props the BrokerCard component expects
interface BrokerCardProps {
  id: number | string; // Can be number or string depending on source
  name: string;
  slug: string;
  logo_url: string | null;
  rating: number;
  bonus?: string | null;
  features?: string | string[] | null; // Can be string or array
  regulation?: string | null; // Regulation string
  risk_note?: string | null;
  search_result_text?: string | null; // Short description text
}

// Helper function to render stars (can be moved to utils if used elsewhere)
const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars && halfStar) {
        stars.push(<Star key={`half-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-200" />); // Example half star
      } else {
        stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
      }
    }
    return <div className="flex items-center">{stars}<span className="ml-1 text-xs text-gray-600">({rating ? rating.toFixed(1) : 'N/A'})</span></div>;
};

// Helper function to render licenses (Regulation)
const renderLicenses = (regulationString: string | undefined | null) => {
    if (!regulationString) return <span className="text-gray-500 text-sm">N/A</span>;
    const licenses = regulationString.split(',').map(s => s.trim()).filter(Boolean);
    const count = licenses.length;
    const displayLimit = 5;
    if (count === 0) return <span className="text-gray-500 text-sm">N/A</span>;
    const displayedLicenses = licenses.slice(0, displayLimit).join(', ');
    const remainingCount = count - displayLimit;
    return (
      <span className="text-gray-500 text-sm">
        Licensed by {displayedLicenses}
        {remainingCount > 0 && ` +${remainingCount}`}
      </span>
    );
};

// Helper function to render features
const renderFeatures = (features: string | string[] | undefined | null) => {
    let featuresArray: string[] = [];
    if (typeof features === 'string') {
      featuresArray = features.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(features)) {
      featuresArray = features;
    }
    if (featuresArray.length === 0) return null;
    return featuresArray.slice(0, 4).map((feature, index) => (
      <div key={index} className="flex items-center">
        <CheckCircle2 className="h-4 w-4 mr-1 text-green-600 flex-shrink-0" />
        <span className="text-gray-700 text-sm">{feature}</span>
      </div>
    ));
};


export const BrokerCard: React.FC<BrokerCardProps> = ({
  id, name, slug, logo_url, rating, bonus, features, regulation, risk_note, search_result_text
}) => {
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
                layout="fill"
                objectFit="contain"
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
            {/* Corrected features rendering */}
            {renderFeatures(features)}
          </div>

          <div className="mt-4 flex items-center">
            <ShieldCheck className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
            {/* Render Licenses */}
            {renderLicenses(regulation)}
          </div>
        </div>

        {/* Buttons */}
        <div className="md:w-1/4 flex flex-col justify-center items-center mt-4 md:mt-0">
          <Link
            href={`/broker/${slug}`} // Use slug for link
            className="w-full bg-[#145588] hover:bg-[#0e3e66] text-white text-center py-3 rounded-md font-medium transition duration-200 mb-2"
          >
            Visit Broker
          </Link>

          <p className="text-gray-400 text-xs text-center mb-4">
            (Risk note: {risk_note || 'N/A'})
          </p>

          <Link
            href={`/review/${slug}`} // Use slug for link
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read Review →
          </Link>
        </div>
      </div>
    </div>
  );
};
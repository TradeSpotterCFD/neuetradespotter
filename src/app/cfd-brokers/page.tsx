import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Shield,
  Users,
  Phone,
  Banknote,
  GraduationCap,
  Award,
  BarChart3,
  CreditCard,
  Star,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';

interface BrokerDetailPageProps {
  params: {
    slug: string;
  };
}

// Fetch broker data from database
async function getBrokerBySlug(slug: string) {
  const { data: broker, error } = await supabase
    .from('brokers')
    .select(`
      *,
      broker_translations (*)
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error || !broker) {
    return null;
  }

  // Organize translations by language
  const translationsByLang: { [key: string]: any } = {};
  if (broker.broker_translations) {
    broker.broker_translations.forEach((translation: any) => {
      translationsByLang[translation.language_code] = translation;
    });
  }

  return {
    ...broker,
    translations: translationsByLang
  };
}

// Related Brokers Component
async function getRelatedBrokers(currentBrokerId: number) {
  const { data, error } = await supabase
    .from('brokers')
    .select('id, name, slug, logo_url, rating, bonus')
    .eq('active', true)
    .eq('broker_type', 'cfd')
    .neq('id', currentBrokerId)
    .order('rating', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Error fetching related brokers:', error);
    return [];
  }

  return data || [];
}

interface RelatedBrokersProps {
  currentBrokerId: number;
}

async function RelatedBrokers({ currentBrokerId }: RelatedBrokersProps) {
  const relatedBrokers = await getRelatedBrokers(currentBrokerId);

  if (relatedBrokers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
        Top Rated CFD Brokers
      </h4>
      
      <div className="space-y-4">
        {relatedBrokers.map((relatedBroker, index) => (
          <div key={relatedBroker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              {/* Rank */}
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              
              {/* Logo */}
              <div className="flex-shrink-0 w-8 h-8 bg-white rounded border flex items-center justify-center">
                {relatedBroker.logo_url ? (
                  <Image
                    src={relatedBroker.logo_url}
                    alt={`${relatedBroker.name} logo`}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xs font-semibold text-gray-500">
                    {relatedBroker.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              
              {/* Name & Rating */}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-gray-800 truncate">
                  {relatedBroker.name}
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-xs text-gray-600">{relatedBroker.rating}</span>
                </div>
              </div>
            </div>
            
            {/* Visit Button */}
            <a
              href={`/cfd-brokers/${relatedBroker.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded transition-colors"
            >
              View
            </a>
          </div>
        ))}
      </div>
      
      {/* See All Link */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a
          href="/cfd-brokers"
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
        >
          See All CFD Brokers
        </a>
      </div>
    </div>
  );
}

export default async function BrokerDetailPage({ params }: BrokerDetailPageProps) {
  const broker = await getBrokerBySlug(params.slug);

  if (!broker) {
    notFound();
  }

  // Get current language translation (defaulting to English)
  const currentTranslation = broker.translations?.en || {};
  const brokerName = broker.name || 'Unknown Broker';

  // Convert features string to array
  const features = broker.features || [];
  const displayFeatures = features.slice(0, 4); // Show first 4 features

  // Convert markets, platforms, etc. to arrays
  const markets = broker.markets ? broker.markets.split(', ').filter(Boolean) : [];
  const tradingPlatforms = broker.trading_platforms ? broker.trading_platforms.split(', ').filter(Boolean) : [];
  const depositMethods = broker.deposit_methods ? broker.deposit_methods.split(', ').filter(Boolean) : [];
  const educationTools = broker.education_tools ? broker.education_tools.split(', ').filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {brokerName} - Online CFD Broker Review 2025
              </h1>
              
              {/* Features with Checkmarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {displayFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-sm lg:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(Number(broker.rating)) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xl font-semibold">{broker.rating}</span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-lg opacity-90 leading-relaxed">
                  {currentTranslation.search_result_text || 
                   `In this ${brokerName} review, you'll discover why this broker stands out with its extensive trading offerings, diverse asset selection, and high security standards.`}
                </p>
              </div>

              {/* Visit Broker Button */}
              <a
                href={broker.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
              >
                Visit Broker
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>

            {/* Right Content - Preview & Bonus */}
            <div className="space-y-6">
              {/* Broker Preview/Screenshot */}
              <div className="bg-white rounded-lg p-4 shadow-lg">
                {broker.logo_url ? (
                  <div className="relative h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image
                      src={broker.logo_url}
                      alt={`${brokerName} platform preview`}
                      width={200}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">
                      {brokerName} Platform
                    </span>
                  </div>
                )}
              </div>

              {/* Bonus Box */}
              <div className="bg-green-500 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">
                  {broker.bonus || 'Welcome Bonus Available'}
                </div>
                <button className="bg-white text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  Start Trading
                </button>
                <p className="text-xs mt-3 opacity-90">
                  +18+. {broker.risk_note || 'Trading involves risk. Your capital may be at risk.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* At a Glance Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left - At a Glance Details */}
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">{brokerName} at a Glance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company */}
                {broker.company && (
                  <div className="flex items-start space-x-3">
                    <Building className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Company:</div>
                      <div className="text-gray-600">{broker.company}</div>
                    </div>
                  </div>
                )}

                {/* Headquarters */}
                {broker.headquarters && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Headquarters:</div>
                      <div className="text-gray-600">{broker.headquarters}</div>
                    </div>
                  </div>
                )}

                {/* Founded Year */}
                {broker.founded_year && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Online since:</div>
                      <div className="text-gray-600">{broker.founded_year}</div>
                    </div>
                  </div>
                )}

                {/* Min Deposit */}
                {broker.min_deposit && (
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Min. Deposit:</div>
                      <div className="text-gray-600">${broker.min_deposit}</div>
                    </div>
                  </div>
                )}

                {/* Max Leverage */}
                {broker.max_leverage && (
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Max. Leverage:</div>
                      <div className="text-gray-600">{broker.max_leverage}</div>
                    </div>
                  </div>
                )}

                {/* Spreads From */}
                {broker.spreads_from && (
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Spreads From:</div>
                      <div className="text-gray-600">{broker.spreads_from}</div>
                    </div>
                  </div>
                )}

                {/* Markets */}
                {markets.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Markets:</div>
                      <div className="text-gray-600">{markets.length} Markets Available</div>
                    </div>
                  </div>
                )}

                {/* Trading Platforms */}
                {tradingPlatforms.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <Award className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Trading Platforms:</div>
                      <div className="text-gray-600">{tradingPlatforms.join(', ')}</div>
                    </div>
                  </div>
                )}

                {/* Deposit Methods */}
                {depositMethods.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <CreditCard className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Deposit Methods:</div>
                      <div className="text-gray-600">{depositMethods.length} Methods Available</div>
                    </div>
                  </div>
                )}

                {/* Withdrawal Fees */}
                {broker.withdrawal_fees && (
                  <div className="flex items-start space-x-3">
                    <Banknote className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Withdrawal Fees:</div>
                      <div className="text-gray-600">{broker.withdrawal_fees}</div>
                    </div>
                  </div>
                )}

                {/* Customer Support */}
                {broker.customer_support && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Customer Service:</div>
                      <div className="text-gray-600">{broker.customer_support}</div>
                    </div>
                  </div>
                )}

                {/* User Base */}
                {broker.user_base && (
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">User Base:</div>
                      <div className="text-gray-600">{broker.user_base}</div>
                    </div>
                  </div>
                )}

                {/* Fund Security */}
                {broker.fund_security && (
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Fund Security:</div>
                      <div className="text-gray-600">{broker.fund_security}</div>
                    </div>
                  </div>
                )}

                {/* Education Tools */}
                {educationTools.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <GraduationCap className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-700">Education Tools:</div>
                      <div className="text-gray-600">{educationTools.length} Tools Available</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Text */}
              {currentTranslation.introduction_1 && (
                <div className="mt-8 prose prose-gray max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentTranslation.introduction_1 }} />
                </div>
              )}
            </div>

            {/* Right Sidebar - Broker Card & Related Brokers */}
            <div className="lg:w-1/3 space-y-6">
              {/* Main Broker Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{brokerName}</h3>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(Number(broker.rating)) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{broker.rating}/5</span>
                </div>

                {/* Bonus */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="font-bold text-green-800 mb-2">
                      {broker.bonus || 'Welcome Bonus'}
                    </div>
                    <div className="text-sm text-green-600">
                      {broker.bonus || 'Available for new traders'}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={broker.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
                >
                  Start Trading
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>

                {/* Risk Warning */}
                <p className="text-xs text-gray-500 mt-4 text-center">
                  +18+. {broker.risk_note || 'Trading involves risk. Your capital may be at risk.'}
                </p>
              </div>

              {/* Related Brokers Card */}
              <RelatedBrokers currentBrokerId={broker.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Table of Contents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="#overview" className="flex items-center text-blue-600 hover:text-blue-800">
                <Star className="h-4 w-4 mr-2" />
                {brokerName} Overview
              </a>
              <a href="#at-a-glance" className="flex items-center text-blue-600 hover:text-blue-800">
                <Award className="h-4 w-4 mr-2" />
                At a Glance
              </a>
              <a href="#trading" className="flex items-center text-blue-600 hover:text-blue-800">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trading Conditions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
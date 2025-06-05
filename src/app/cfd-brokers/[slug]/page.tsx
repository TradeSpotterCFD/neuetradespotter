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
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              
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
            
            <a
              href={`/cfd-brokers/${relatedBroker.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded transition-colors"
            >
              View
            </a>
          </div>
        ))}
      </div>
      
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
  const brokerName = broker.name || 'eToro';

  // EXTENSIVE DEBUG - Check what's actually happening
  console.log('=== BROKER DEBUG START ===');
  console.log('Raw broker object:', broker);
  console.log('broker.company:', broker.company);
  console.log('broker.max_leverage:', broker.max_leverage);
  console.log('typeof max_leverage:', typeof broker.max_leverage);
  console.log('Is max_leverage null?', broker.max_leverage === null);
  console.log('Is max_leverage undefined?', broker.max_leverage === undefined);
  console.log('Is max_leverage empty string?', broker.max_leverage === '');
  console.log('=== BROKER DEBUG END ===');

  // NO FALLBACKS AT ALL - Show exactly what's in database
  const brokerData = {
    name: broker.name,
    company: broker.company, // Should show "eToro Group" not "eToro Group Ltd"
    headquarters: broker.headquarters,
    founded_year: broker.founded_year,
    min_deposit: broker.min_deposit,
    max_leverage: broker.max_leverage, // Should be null/empty and show as empty
    spreads_from: broker.spreads_from,
    rating: broker.rating,
    regulation: broker.regulation,
    fund_security: broker.fund_security,
    trading_platforms: broker.trading_platforms,
    customer_support: broker.customer_support,
    user_base: broker.user_base,
    withdrawal_fees: broker.withdrawal_fees,
    deposit_methods: broker.deposit_methods,
    website_url: broker.website_url,
    bonus: broker.bonus,
    risk_note: broker.risk_note
  };

  const depositMethodsArray = typeof brokerData.deposit_methods === 'string'
    ? brokerData.deposit_methods.split(',').map(m => m.trim()).filter(Boolean)
    : Array.isArray(brokerData.deposit_methods)
    ? brokerData.deposit_methods
    : [];

  const depositMethodsDisplay = depositMethodsArray.slice(0, 4).join(', ') +
    (depositMethodsArray.length > 4 ? ` +${depositMethodsArray.length - 4}` : '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white" style={{background: 'linear-gradient(to right, #15578b, #1e6ba8)'}}>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {brokerData.name} - Online CFD Broker Review 2025
              </h1>
              
              {/* Features with Checkmarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm lg:text-base">Mobile Compatible</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm lg:text-base">Demo Account</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm lg:text-base">Fast Payouts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm lg:text-base">Regulated and Secure</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </div>
                <span className="text-xl font-semibold">{brokerData.rating}</span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-lg opacity-90 leading-relaxed">
                  {currentTranslation.search_result_text || 
                   `In this ${brokerData.name} review, you'll discover why this broker stands out with its extensive trading offerings, diverse asset selection, and high security standards.`}
                </p>
              </div>

              {/* Visit Broker Button */}
              <a
                href={brokerData.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
                style={{backgroundColor: '#703d98'}}
              >
                Visit Broker
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>

            {/* Right Content - Preview only */}
            <div className="space-y-6">
              {/* Broker Preview/Screenshot - Größere Box */}
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="rounded-lg flex items-center justify-center" style={{height: '400px', backgroundColor: '#f3f4f6'}}>
                  <span className="text-gray-500 text-lg font-medium">
                    {brokerData.name} Platform
                  </span>
                </div>
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
            <div className="lg:w-2/3 lg:pr-6 lg:border-r lg:border-gray-300">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">{brokerData.name} at a Glance</h2>

              <div className="border border-gray-200 rounded-lg shadow-md p-6 relative grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-gray-200" />
                {/* Company - DIRECT FROM DB */}
                <div className="flex items-start space-x-3">
                  <Building className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Company:</div>
                    <div className="text-gray-600">{broker.company || 'No company data'}</div>
                  </div>
                </div>

                {/* Headquarters - DIRECT FROM DB */}
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Headquarters:</div>
                    <div className="text-gray-600">{broker.headquarters || 'No headquarters data'}</div>
                  </div>
                </div>

                {/* Founded Year - DIRECT FROM DB */}
                <div className="flex items-start space-x-3">
                  <Calendar className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Online since:</div>
                    <div className="text-gray-600">{broker.founded_year || 'No founding year data'}</div>
                  </div>
                </div>

                {/* Min Deposit - DIRECT FROM DB */}
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Min. Deposit:</div>
                    <div className="text-gray-600">${broker.min_deposit || 'No min deposit data'}</div>
                  </div>
                </div>

                {/* Max Leverage - DIRECT FROM DATABASE */}
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Max. Leverage:</div>
                    <div className="text-gray-600">{broker.max_leverage || 'No leverage data'}</div>
                  </div>
                </div>

                {/* Spreads From */}
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Spreads From:</div>
                    <div className="text-gray-600">{brokerData.spreads_from}</div>
                  </div>
                </div>

                {/* Trading Platforms */}
                <div className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Trading Platforms:</div>
                    <div className="text-gray-600">{brokerData.trading_platforms}</div>
                  </div>
                </div>

                {/* Deposit Methods */}
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Deposit Methods:</div>
                    <div className="text-gray-600">{brokerData.deposit_methods}</div>
                  </div>
                </div>

                {/* Withdrawal Fees - FIXED DUPLICATE */}
                <div className="flex items-start space-x-3">
                  <Banknote className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Withdrawal Fees:</div>
                    <div className="text-gray-600">{brokerData.withdrawal_fees}</div>
                  </div>
                </div>

                {/* Customer Support */}
                <div className="flex items-start space-x-3">
                  <Phone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Customer Service:</div>
                    <div className="text-gray-600">{brokerData.customer_support}</div>
                  </div>
                </div>

                {/* User Base */}
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">User Base:</div>
                    <div className="text-gray-600">{brokerData.user_base}</div>
                  </div>
                </div>

                {/* Fund Security */}
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-700">Fund Security:</div>
                    <div className="text-gray-600">{brokerData.fund_security}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Quick Facts */}
            <div className="lg:w-1/3 space-y-6">
              {/* Quick Facts Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  Quick Facts
                </h3>
                
                <div className="space-y-5">
                  {/* Founded */}
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">Founded:</span>
                    <span className="font-bold text-gray-800">{brokerData.founded_year}</span>
                  </div>

                  {/* Headquarters */}
                  <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">Headquarters:</span>
                    <span className="font-bold text-gray-800 text-right text-sm leading-tight max-w-32">
                      {brokerData.headquarters}
                    </span>
                  </div>

                  {/* Min Deposit */}
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">Min. Deposit:</span>
                    <span className="font-bold text-green-600 text-lg">${brokerData.min_deposit}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">Rating:</span>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <span className="font-bold text-gray-800">{brokerData.rating}/5</span>
                    </div>
                  </div>

                  {/* Regulators */}
                  <div className="pt-2">
                    <div className="text-gray-600 font-medium mb-3">Regulators:</div>
                    <div className="text-xs font-semibold leading-relaxed text-gray-700 bg-gray-50 p-3 rounded-lg">
                      BaFin, AMF, CONSOB, CNMV, FCA, FINMA, FSC, HANFA, NBS, ASF, CBI, MFSA, KNF, MNB, CNB, CySEC, FI, HCMC, CMVM, FIN-FSA, FSA, AFM, FSMA, FMA
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={brokerData.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center text-lg"
                >
                  Start Trading
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>

                {/* Risk Warning */}
                <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
                  +18+. {brokerData.risk_note}
                </p>
              </div>

              {/* Table of Contents Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Table of Contents
                </h4>
                
                <div className="space-y-3">
                  <a href="#overview" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50">
                    <Star className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="font-medium">{brokerData.name} Overview</span>
                  </a>
                  <a href="#at-a-glance" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50">
                    <Award className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="font-medium">At a Glance</span>
                  </a>
                  <a href="#trading" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50">
                    <TrendingUp className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="font-medium">Trading Conditions</span>
                  </a>
                  <a href="#platforms" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50">
                    <Building className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="font-medium">Trading Platforms</span>
                  </a>
                  <a href="#security" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50">
                    <Shield className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="font-medium">Security & Regulation</span>
                  </a>
                </div>
              </div>

              {/* Related Brokers Card */}
              <RelatedBrokers currentBrokerId={broker.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section - Clean and Simple */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Related Brokers Section */}
          <RelatedBrokers currentBrokerId={broker.id} />
        </div>
      </section>
    </div>
  );
}
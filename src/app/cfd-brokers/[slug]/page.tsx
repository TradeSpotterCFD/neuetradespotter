// src/app/cfd-brokers/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getRiskWarning } from '@/lib/riskWarning';
import {
  Building, MapPin, DollarSign, TrendingUp, Calendar, Shield, Users, Phone, Banknote,
  Award, BarChart3, CreditCard, Star, CheckCircle, ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { Footer } from '@/components/Footer';

interface BrokerDetailPageProps {
  params: { slug: string };
}

// Broker mit Übersetzungen holen
async function getBrokerBySlug(slug: string) {
  const { data: broker, error } = await supabase
    .from('brokers')
    .select(`*, broker_translations (*)`)
    .eq('slug', slug)
    .eq('active', true)
    .single();
  if (error || !broker) return null;

  const translationsByLang: { [key: string]: any } = {};
  if (broker.broker_translations) {
    broker.broker_translations.forEach((translation: any) => {
      translationsByLang[translation.language_code] = translation;
    });
  }

  return { ...broker, translations: translationsByLang };
}

const renderDepositMethods = (depositMethodsString: string | undefined | null, limit: number = 4) => {
  if (!depositMethodsString) return <span className="text-gray-600">N/A</span>;
  const methods = depositMethodsString.split(',').map(m => m.trim()).filter(Boolean);
  if (!methods.length) return <span className="text-gray-600">N/A</span>;
  const displayedMethods = methods.slice(0, limit);
  const remainingCount = methods.length - limit;
  return <span className="text-gray-600">{displayedMethods.join(', ')}{remainingCount > 0 && ` +${remainingCount}`}</span>;
};

async function getRelatedBrokers(currentBrokerId: number) {
  const { data, error } = await supabase
    .from('brokers')
    .select('id, name, slug, logo_url, rating, bonus')
    .eq('active', true)
    .eq('broker_type', 'cfd')
    .neq('id', currentBrokerId)
    .order('rating', { ascending: false })
    .limit(4);
  if (error) return [];
  return data || [];
}

async function RelatedBrokers({ currentBrokerId }: { currentBrokerId: number }) {
  const relatedBrokers = await getRelatedBrokers(currentBrokerId);
  if (!relatedBrokers.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />Top Rated CFD Brokers
      </h4>
      <div className="space-y-4">
        {relatedBrokers.map((relatedBroker, idx) => (
          <div key={relatedBroker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{idx + 1}</div>
              <div className="flex-shrink-0 w-8 h-8 bg-white rounded border flex items-center justify-center">
                {relatedBroker.logo_url ? (
                  <Image src={relatedBroker.logo_url} alt={`${relatedBroker.name} logo`} width={24} height={24} className="object-contain" />
                ) : (
                  <span className="text-xs font-semibold text-gray-500">{relatedBroker.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-gray-800 truncate">{relatedBroker.name}</div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-xs text-gray-600">{relatedBroker.rating}</span>
                </div>
              </div>
            </div>
            <a href={`/cfd-brokers/${relatedBroker.slug}`} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded transition-colors">View</a>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a href="/cfd-brokers" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-center block">See All CFD Brokers</a>
      </div>
    </div>
  );
}

export default async function BrokerDetailPage({ params }: BrokerDetailPageProps) {
  const { slug } = params;
  const broker = await getBrokerBySlug(slug);
  if (!broker) notFound();

  // Erkenne Sprache aus aktiver URL oder Default (z.B. 'en')
  // Falls du locale aus params bekommst: const lang = params.locale || 'en';
  const lang = 'en'; // oder dynamisch!

  const brokerType = broker.broker_type || "cfd";
  const riskPercentageFromDB = broker.risk_note;
  const riskWarning = await getRiskWarning(riskPercentageFromDB, brokerType, lang);

  const currentTranslation = broker.translations?.[lang] || {};
  const brokerName = broker.name || 'eToro';

  // Holt den Buttontext aus Übersetzung (Datenbank)
  const buttonText = currentTranslation.button_text || 'Visit Broker';

  const brokerData = {
    name: brokerName,
    company: broker.company || 'eToro Group Ltd',
    headquarters: broker.headquarters || 'Tel Aviv, Limassol, London',
    founded_year: broker.founded_year || '2007',
    min_deposit: broker.min_deposit || '50',
    max_leverage: broker.max_leverage || '1:30',
    spreads_from: broker.spreads_from || '1 pip',
    rating: broker.rating || '4.8',
    regulation: broker.regulation || 'BaFin, AMF, CONSOB +21',
    fund_security: broker.fund_security || 'ICF €20,000 in Europe',
    trading_platforms: broker.trading_platforms || 'eToro WebTrader',
    customer_support: broker.customer_support || 'Live-Chat 24/5, Support-Tickets',
    user_base: broker.user_base || '3.5 million active traders',
    withdrawal_fees: broker.withdrawal_fees || '5 USD per payout',
    deposit_methods: broker.deposit_methods || 'Visa, MasterCard, Skrill, Neteller, Wire Transfer, Bitcoin (BTC), Litecoin (LTC)',
    website_url: broker.website_url || '#',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white" style={{ background: 'linear-gradient(to right, #15578b, #1e6ba8)' }}>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {brokerData.name} - Online CFD Broker Review 2025
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" /><span className="text-sm lg:text-base">Mobile Compatible</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" /><span className="text-sm lg:text-base">Demo Account</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" /><span className="text-sm lg:text-base">Fast Payouts</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" /><span className="text-sm lg:text-base">Regulated and Secure</span></div>
              </div>
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (<Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />))}
                <span className="text-xl font-semibold">{brokerData.rating}</span>
              </div>
              <div className="mb-8">
                <p className="text-lg opacity-90 leading-relaxed">
                  {currentTranslation.search_result_text ||
                    `In this ${brokerData.name} review, you'll discover why this broker stands out with its extensive trading offerings, diverse asset selection, and high security standards.`}
                </p>
              </div>
              {/* --- Visit Broker Button + Risk --- */}
          <div className="flex flex-col items-start w-full mb-2">
{buttonText && (
<a
  href={brokerData.website_url}
  target="_blank"
  rel="noopener noreferrer"
  className="
    flex items-center justify-center
    min-w-[340px] w-[260px] 
    text-center
    text-white font-semibold 
    py-4 px-8 rounded-lg 
    transition-colors duration-200
    bg-[#703d98] mt-4
    "
>
  {buttonText}
  <ExternalLink className="ml-2 h-5 w-5" />
</a>

)}


  {/* Risiko-Hinweis: 2 Zeilen, gleiche Breite wie Button, linksbündig */}
  <p
    className="text-xs text-gray-100 mt-2 leading-snug"
    style={{
      width: "350px",
      maxWidth: "100%",
      whiteSpace: "pre-line",
      textAlign: "left",
      wordBreak: "break-word",
      lineHeight: "1.4",
    }}
  >
    {`+18+. ${riskWarning}`.replace(/(.{45,75})\s/, "$1\n")}
  </p>
</div>

            </div>
            {/* Right Content - Preview only */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="rounded-lg flex items-center justify-center" style={{ height: '400px', backgroundColor: '#f3f4f6' }}>
                  <span className="text-gray-500 text-lg font-medium">{brokerData.name} Platform</span>
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
            <div className="lg:w-3/4">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">{brokerData.name} at a Glance</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="space-y-6 pr-6">
                    <div className="flex items-start space-x-3"><Building className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Company:</div><div className="text-gray-600">{brokerData.company}</div></div></div>
                    <div className="flex items-start space-x-3"><Calendar className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Online since:</div><div className="text-gray-600">{brokerData.founded_year}</div></div></div>
                    <div className="flex items-start space-x-3"><TrendingUp className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Max. Leverage:</div><div className="text-gray-600">{brokerData.max_leverage}</div></div></div>
                    <div className="flex items-start space-x-3"><Award className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Trading Platforms:</div><div className="text-gray-600">{brokerData.trading_platforms}</div></div></div>
                    <div className="flex items-start space-x-3"><Banknote className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Withdrawal Fees:</div><div className="text-gray-600">{brokerData.withdrawal_fees}</div></div></div>
                    <div className="flex items-start space-x-3"><Users className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">User Base:</div><div className="text-gray-600">{brokerData.user_base}</div></div></div>
                  </div>
                  <div className="space-y-6 border-l border-gray-200 pl-6">
                    <div className="flex items-start space-x-3"><MapPin className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Headquarters:</div><div className="text-gray-600">{brokerData.headquarters}</div></div></div>
                    <div className="flex items-start space-x-3"><DollarSign className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Min. Deposit:</div><div className="text-gray-600">${brokerData.min_deposit}</div></div></div>
                    <div className="flex items-start space-x-3"><BarChart3 className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Spreads From:</div><div className="text-gray-600">{brokerData.spreads_from}</div></div></div>
                    <div className="flex items-start space-x-3"><CreditCard className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Deposit Methods:</div><div className="text-gray-600">{renderDepositMethods(brokerData.deposit_methods, 4)}</div></div></div>
                    <div className="flex items-start space-x-3"><Phone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Customer Service:</div><div className="text-gray-600">{brokerData.customer_support}</div></div></div>
                    <div className="flex items-start space-x-3"><Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" /><div><div className="font-semibold text-gray-700">Fund Security:</div><div className="text-gray-600">{brokerData.fund_security}</div></div></div>
                  </div>
                  <div className="lg:hidden col-span-full border-t border-gray-200 my-4"></div>
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <div className="lg:w-1/4 space-y-6">
              {/* Trading Summary Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />Trading Summary
                </h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3"><span className="text-gray-600 font-medium">Min. Deposit:</span><span className="font-bold text-green-600 text-lg">${brokerData.min_deposit}</span></div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3"><span className="text-gray-600 font-medium">Max. Leverage:</span><span className="font-bold text-orange-600">{brokerData.max_leverage}</span></div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3"><span className="text-gray-600 font-medium">Spreads From:</span><span className="font-bold text-blue-600">{brokerData.spreads_from}</span></div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">Our Rating:</span>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />))}
                      </div>
                      <span className="font-bold text-gray-800">{brokerData.rating}/5</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="text-gray-600 font-medium mb-3">Regulation:</div>
                    <div className="flex items-center text-sm"><Shield className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /><span className="font-medium text-green-700">Fully Regulated</span></div>
                    <div className="text-xs text-gray-500 mt-1">Licensed by FCA, CySEC & more</div>
                  </div>
                </div>
                <a
                  href={brokerData.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-6 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center text-lg hover:opacity-90"
                  style={{ backgroundColor: '#703d98' }}
                >
                  Start Trading
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
                {/* Dynamischer Risiko-Hinweis */}
                <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
                  +18+. {riskWarning}
                </p>
                {currentTranslation.search_result_text && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center leading-relaxed">{currentTranslation.search_result_text}</p>
                  </div>
                )}
              </div>
              <RelatedBrokers currentBrokerId={broker.id} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}


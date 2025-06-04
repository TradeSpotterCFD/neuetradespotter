"use client";
// src/components/TopBrokersSection.tsx
import Link from 'next/link';

export function TopBrokersSection() {
  // Beispieldaten - in einer echten Anwendung würden diese aus einer API oder Datenbank kommen
  const brokers = [
    {
      id: 'alpha-trading',
      name: 'Alpha Trading',
      logo: '/images/alpha-trading-logo.png', // Platzhalter - ersetze mit echtem Pfad
      rating: 4.8,
      description: 'Alpha Trading is known for its advanced trading platform, low spreads, and excellent customer service.',
      bonus: '100% deposit match up to $1,000',
      features: [
        'Mobile Compatible',
        'Trading Tools',
        'Fast Payouts',
        'VIP Program'
      ],
      licenses: ['FCA', 'ASIC', 'CySEC'],
      riskNote: '69% of retail investor accounts lose money when trading CFDs with this provider'
    },
    {
      id: 'beta-investments',
      name: 'Beta Investments',
      logo: '/images/beta-investments-logo.png', // Platzhalter - ersetze mit echtem Pfad
      rating: 4.7,
      description: 'Beta Investments offers a wide range of trading instruments with competitive spreads and advanced charting tools.',
      bonus: 'Welcome bonus up to $500 + 50 free trades',
      features: [
        'Mobile Compatible',
        'Low Fees',
        'Demo Account',
        'Beginner Friendly'
      ],
      licenses: ['FCA', 'ASIC'],
      riskNote: '69% of retail investor accounts lose money when trading CFDs with this provider'
    },
    {
      id: 'epsilon-exchange',
      name: 'Epsilon Exchange',
      logo: '/images/epsilon-exchange-logo.png', // Platzhalter - ersetze mit echtem Pfad
      rating: 4.7,
      description: 'Epsilon Exchange offers a complete suite of trading services with a focus on user experience and security.',
      bonus: 'Up to $2,000 welcome package + 75 free trades',
      features: [
        'Mobile Compatible',
        'Trading Tools',
        'Fast Payouts',
        'Demo Account'
      ],
      licenses: ['FCA', 'ASIC', 'JFSA'],
      riskNote: '69% of retail investor accounts lose money when trading CFDs with this provider'
    },
    {
      id: 'gamma-markets',
      name: 'Gamma Markets',
      logo: '/images/gamma-markets-logo.png', // Platzhalter - ersetze mit echtem Pfad
      rating: 4.6,
      description: 'Gamma Markets is a leading broker for cryptocurrency trading with industry-low fees and innovative features.',
      bonus: '100% bonus up to $300 + 20 free trades',
      features: [
        'Mobile Compatible',
        'Fast Payouts',
        'Demo Account',
        'Low Fees'
      ],
      licenses: ['CySEC', 'FSA'],
      riskNote: '69% of retail investor accounts lose money when trading CFDs with this provider'
    },
    {
      id: 'delta-futures',
      name: 'Delta Futures',
      logo: '/images/delta-futures-logo.png', // Platzhalter - ersetze mit echtem Pfad
      rating: 4.5,
      description: 'Delta Futures specializes in futures trading with high leverage options and powerful analysis tools.',
      bonus: '100% match up to $1,000',
      features: [
        'High Leverage',
        'Trading Tools',
        'VIP Program',
        'Mobile Compatible'
      ],
      licenses: ['FCA', 'FINMA'],
      riskNote: '69% of retail investor accounts lose money when trading CFDs with this provider'
    }
  ];

 // Funktion zum Rendern der Sterne basierend auf der Bewertung
const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && halfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-gray-700">{rating}</span>
      </div>
    );
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Top Rated Brokers</h2>
          <Link href="/all-brokers" className="text-blue-600 hover:text-blue-800 flex items-center">
            View All Top Brokers →
          </Link>
        </div>
        <p className="text-gray-600 mb-12">The highest-rated online brokers based on expert reviews and trader feedback</p>
        
        <div className="space-y-8">
          {brokers.map((broker) => (
            <div key={broker.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row">
                {/* Logo und Name */}
                <div className="md:w-1/4 flex flex-col items-center md:items-start mb-6 md:mb-0">
                  {/* Platzhalter für das Logo - ersetze mit echtem Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 mb-4">
                    {broker.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold">{broker.name}</h3>
                  {renderStars(broker.rating)}
                </div>
                
                {/* Beschreibung und Bonus */}
                <div className="md:w-2/4 md:px-6">
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-blue-700 font-medium">{broker.bonus}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{broker.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {broker.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-gray-500 text-sm">Licensed by {broker.licenses.join(', ')}</span>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="md:w-1/4 flex flex-col justify-center items-center">
                  <Link 
                    href={`/broker/${broker.id}`} 
                    className="w-full bg-[#145588] hover:bg-[#0e3e66] text-white text-center py-3 rounded-md font-medium transition duration-200 mb-2"
                  >
                    Visit Broker
                  </Link>
                  
                  <p className="text-gray-400 text-xs text-center mb-4">
                    (Risk note: {broker.riskNote})
                  </p>
                  
                  <Link 
                    href={`/review/${broker.id}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read Review →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
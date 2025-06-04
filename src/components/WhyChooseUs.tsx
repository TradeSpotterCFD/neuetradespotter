// src/components/WhyChooseUs.tsx
import { Award, Users, Shield, Clock } from 'lucide-react';

export function WhyChooseUs() {
  const features = [
    {
      icon: <Award className="h-10 w-10 text-blue-500" />,
      title: 'Expert Reviews',
      description: 'Detailed analysis by our team of trading experts'
    },
    {
      icon: <Users className="h-10 w-10 text-blue-500" />,
      title: 'Exclusive Bonuses',
      description: 'Special offers available only through our site'
    },
    {
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      title: 'Trusted Operations',
      description: 'We only recommend licensed and regulated brokers'
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-500" />,
      title: 'Updated Daily',
      description: 'Fresh broker information and new promotions'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Why Choose TradeSpotter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Broker?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Compare the best online brokers based on bonuses, trading selection, payment methods, and more.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/compare-brokers" 
              className="bg-[#145588] hover:bg-[#0e3e66] text-white py-3 px-6 rounded-md font-medium"
            >
              Compare Top Brokers
            </a>
            <a 
              href="/trading-guides" 
              className="bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 rounded-md font-medium"
            >
              Read Trading Guides
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
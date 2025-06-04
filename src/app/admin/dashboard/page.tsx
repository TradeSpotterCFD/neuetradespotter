"use client";
export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Globe,
  CreditCard,
  Tag,
  BarChart4,
  TrendingUp,
  DollarSign,
  Percent
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  console.log('>>> [AdminDashboard] Component rendering...'); // Log 1: Komponente wird gerendert

  const [stats, setStats] = useState({
    brokers: 0,
    countries: 0,
    paymentMethods: 0,
    brokerTypes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('>>> [AdminDashboard useEffect] useEffect running...'); // Log 1: useEffect Start

    async function fetchStats() {
      console.log('>>> [AdminDashboard fetchStats] Fetching stats...'); // Log 2: Datenabruf Start
      setLoading(true);

      try {
        // Fetch broker count
        console.log('>>> [AdminDashboard fetchStats] Fetching brokers count...'); // Log 3: Broker Count Start
        const { count: brokerCount, error: brokerError } = await supabase
          .from('brokers')
          .select('*', { count: 'exact', head: true });
        console.log('>>> [AdminDashboard fetchStats] Brokers count response:', { count: brokerCount, error: brokerError }); // Log 4: Broker Count Antwort

        // Fetch country count
        console.log('>>> [AdminDashboard fetchStats] Fetching countries count...'); // Log 5: Country Count Start
        const { count: countryCount, error: countryError } = await supabase
          .from('countries')
          .select('*', { count: 'exact', head: true });
        console.log('>>> [AdminDashboard fetchStats] Countries count response:', { count: countryCount, error: countryError }); // Log 6: Country Count Antwort

        // Fetch payment method count
        console.log('>>> [AdminDashboard fetchStats] Fetching payment methods count...'); // Log 7: Payment Method Count Start
        const { count: paymentMethodCount, error: paymentMethodError } = await supabase
          .from('payment_methods')
          .select('*', { count: 'exact', head: true });
        console.log('>>> [AdminDashboard fetchStats] Payment Methods count response:', { count: paymentMethodCount, error: paymentMethodError }); // Log 8: Payment Method Count Antwort

        // Fetch broker type count
        // console.log('>>> [AdminDashboard fetchStats] Fetching broker types count...'); // Log 9: Broker Type Count Start
        // const { count: brokerTypeCount, error: brokerTypeError } = await supabase
        //   .from('broker_types')
        //   .select('*', { count: 'exact', head: true });
        // console.log('>>> [AdminDashboard fetchStats] Broker Types count response:', { count: brokerTypeCount, error: brokerTypeError }); // Log 10: Broker Type Count Antwort


        if (brokerError || countryError || paymentMethodError) {
            console.error('>>> [AdminDashboard fetchStats] Error fetching one or more stats:', { brokerError, countryError, paymentMethodError }); // Log 11: Fehler beim Abrufen
        }


        setStats({
          brokers: brokerCount || 0,
          countries: countryCount || 0,
          paymentMethods: paymentMethodCount || 0,
          brokerTypes: 0 // Set to 0 as we are not fetching it
        });
        console.log('>>> [AdminDashboard fetchStats] Stats state updated:', { brokers: stats.brokers, countries: stats.countries, paymentMethods: stats.paymentMethods, brokerTypes: stats.brokerTypes }); // Log 12: Stats aktualisiert - Using state directly might show previous values, log fetched counts instead
        console.log('>>> [AdminDashboard fetchStats] Stats state updated with fetched counts:', { brokers: brokerCount || 0, countries: countryCount || 0, paymentMethods: paymentMethodCount || 0, brokerTypes: 0 }); // Log 13: Stats aktualisiert mit abgerufenen Zählungen


      } catch (error) {
        console.error('>>> [AdminDashboard fetchStats] Caught error fetching stats:', error); // Log 14: Fehler im Catch
      } finally {
        setLoading(false);
        console.log('>>> [AdminDashboard fetchStats] Loading set to false.'); // Log 15: Loading beendet
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Brokers',
      value: stats.brokers,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      link: '/admin/brokers',
      color: 'bg-blue-50'
    },
    {
      title: 'Countries',
      value: stats.countries,
      icon: <Globe className="w-8 h-8 text-green-500" />,
      link: '/admin/countries',
      color: 'bg-green-50'
    },
    {
      title: 'Payment Methods',
      value: stats.paymentMethods,
      icon: <CreditCard className="w-8 h-8 text-purple-500" />,
      link: '/admin/payment-methods',
      color: 'bg-purple-50'
    },
    {
      title: 'Broker Types',
      value: stats.brokerTypes,
      icon: <Tag className="w-8 h-8 text-orange-500" />,
      link: '/admin/broker-types',
      color: 'bg-orange-50'
    }
  ];

  const performanceCards = [
    {
      title: 'Visits Today',
      value: '1,245',
      change: '+12.5%',
      isPositive: true,
      icon: <BarChart4 className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Broker Clicks',
      value: '342',
      change: '+8.2%',
      isPositive: true,
      icon: <TrendingUp className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Revenue',
      value: '$1,432',
      change: '+15.3%',
      isPositive: true,
      icon: <DollarSign className="w-6 h-6 text-purple-500" />
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.4%',
      isPositive: false,
      icon: <Percent className="w-6 h-6 text-orange-500" />
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the TradeSpotter admin dashboard</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <Link
              key={card.title}
              href={card.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 font-medium">{card.title}</h3>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceCards.map((card) => (
            <div key={card.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-500 font-medium">{card.title}</h3>
                {card.icon}
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
              <div className={`mt-2 flex items-center ${card.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                <span>{card.change}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 ${!card.isPositive && 'transform rotate-180'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500 text-sm ml-1">vs last week</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart4 className="w-6 h-6 text-[#145588] mr-2" />
            <h2 className="text-xl font-bold">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center py-2 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">New broker added: {i === 1 ? 'XYZ Trading' : i === 2 ? 'Crypto Master' : i === 3 ? 'FX Pro' : i === 4 ? 'Trade Expert' : 'Global Invest'}</p>
                  <p className="text-sm text-gray-500">{i === 1 ? '5 minutes ago' : i === 2 ? '2 hours ago' : i === 3 ? 'Yesterday, 15:30' : i === 4 ? 'Yesterday, 12:15' : '2 days ago'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-[#145588] mr-2" />
            <h2 className="text-xl font-bold">Top Performing Brokers</h2>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Alpha Trading', clicks: 342, conversion: '4.8%' },
              { name: 'Beta Investments', clicks: 287, conversion: '3.9%' },
              { name: 'Gamma Markets', clicks: 245, conversion: '3.5%' },
              { name: 'Delta Futures', clicks: 198, conversion: '3.2%' },
              { name: 'Epsilon Exchange', clicks: 176, conversion: '2.8%' }
            ].map((broker, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-xs font-bold text-blue-600">
                    {i + 1}
                  </div>
                  <span className="font-medium">{broker.name}</span>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">Clicks</p>
                    <p className="font-medium">{broker.clicks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conv.</p>
                    <p className="font-medium">{broker.conversion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

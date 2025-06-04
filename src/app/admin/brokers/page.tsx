
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  StarOff,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import { BrokerEditModal, BrokerData } from '@/app/admin/BrokerEditModal'; 
// import NextImage from 'next/image'; // Entfernt

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<BrokerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('sort_order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedBrokerType, setSelectedBrokerType] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrokerId, setSelectedBrokerId] = useState<number | undefined>(undefined);
  const [selectedBroker, setSelectedBroker] = useState<BrokerData | undefined>(undefined);

  // Refs for dropdown menus
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchBrokers = useCallback(async () => {
    console.log('>>> [BrokersPage] fetchBrokers started');
    setLoading(true);
    try {
      let query = supabase
        .from('brokers')
        .select(`
          id,
          name, 
          slug,
          logo_url,
          rating,
          broker_type,
          sort_order,
          is_featured,
          active,
          company,
          website_url,
          risk_note,
          founded_year,
          headquarters,
          min_deposit,
          max_leverage,
          regulation,
          audit_compliance,
          spreads_from,
          markets,
          trading_platforms,
          deposit_methods,
          withdrawal_fees,
          customer_support,
          user_base,
          fund_security,
          education_tools,
          features,
          bonus
        `) // Erweiterte Abfrage mit allen BrokerData Feldern
        .order(sortField, { ascending: sortDirection === 'asc' });

      console.log('>>> [BrokersPage] Executing Supabase query...');
      const { data, error } = await query;
      console.log('>>> [BrokersPage] Supabase query result:', { data, error });

      if (error) {
        console.error('>>> [BrokersPage] Error fetching brokers raw:', error);
        throw error;
      }

      const brokersData = data || [];
      console.log('>>> [BrokersPage] Raw brokers data:', brokersData);

      // Manuell Übersetzungen abrufen für jeden Broker
      console.log('>>> [BrokersPage] Fetching translations...');
      const brokersWithTranslations = await Promise.all(
        brokersData.map(async (broker) => {
          // Lade alle Übersetzungen für diesen Broker
          const { data: translations, error: translationError } = await supabase
            .from('broker_translations')
            .select('*')
            .eq('broker_id', broker.id);

          if (translationError) {
            console.error(`>>> [BrokersPage] Error fetching translations for broker ${broker.id}:`, translationError);
          }

          // Organisiere Übersetzungen nach Sprache
          const translationsByLang: { [key: string]: any } = {};
          if (translations) {
            translations.forEach(translation => {
              translationsByLang[translation.language_code] = translation;
            });
          }

          // Erstelle vollständiges BrokerData Objekt
          const completeBroker: BrokerData = {
            id: broker.id,
            name: broker.name || '',
            slug: broker.slug || '',
            company: broker.company || '',
            logo_url: broker.logo_url || null,
            rating: broker.rating || 0,
            broker_type: broker.broker_type || 'cfd',
            website_url: broker.website_url || '',
            risk_note: broker.risk_note || '',
            founded_year: broker.founded_year || '',
            headquarters: broker.headquarters || '',
            min_deposit: broker.min_deposit || '',
            max_leverage: broker.max_leverage || '',
            regulation: broker.regulation || '',
            audit_compliance: broker.audit_compliance || '',
            spreads_from: broker.spreads_from || '',
            markets: broker.markets || '',
            trading_platforms: broker.trading_platforms || '',
            deposit_methods: broker.deposit_methods || '',
            withdrawal_fees: broker.withdrawal_fees || '',
            customer_support: broker.customer_support || '',
            user_base: broker.user_base || '',
            fund_security: broker.fund_security || '',
            education_tools: broker.education_tools || '',
            features: broker.features || null,
            translations: translationsByLang,
            bonus: broker.bonus || '',
            // Felder die in der Tabelle angezeigt werden, aber nicht in BrokerData sind
            sort_order: broker.sort_order || 0,
            is_featured: broker.is_featured || false,
            active: broker.active || true
          } as any; // Type assertion um die zusätzlichen Felder zu erlauben

          console.log(`>>> [BrokersPage] Complete broker ${broker.id}:`, completeBroker);
          return completeBroker;
        })
      );
      
      console.log('>>> [BrokersPage] Brokers with translations:', brokersWithTranslations);
      setBrokers(brokersWithTranslations);
      console.log('>>> [BrokersPage] Brokers state updated.');

    } catch (error: any) {
      console.error('>>> [BrokersPage] Caught error in fetchBrokers:', error);
      setBrokers([]); // Setze auf leeres Array im Fehlerfall
    } finally {
      setLoading(false);
      console.log('>>> [BrokersPage] fetchBrokers finished. Loading set to false.');
    }
  }, [sortField, sortDirection, selectedBrokerType]);

  useEffect(() => {
    fetchBrokers();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Close any open dropdowns
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      console.log(">>> [BrokersPage] Component unmounted. Cleaning up.");
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fetchBrokers]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleFeatured = async (id: number, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('brokers')
        .update({ is_featured: !currentValue })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setBrokers(brokers.map(broker =>
        broker.id === id ? { ...broker, is_featured: !currentValue } as any : broker
      ));
    } catch (error: any) {
      console.error('Error updating broker:', error);
    }
  };

  const toggleActive = async (id: number, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('brokers')
        .update({ active: !currentValue })
        .eq('id', id);
      
      if (error) {
        throw error;
      }

      setBrokers(brokers.map(broker =>
        broker.id === id ? { ...broker, active: !currentValue } as any : broker
      ));
    } catch (error: any) {
      console.error('Error updating broker:', error);
    }
  };

  const openEditModal = (brokerId?: number) => {
    setSelectedBrokerId(brokerId);
    const broker = brokerId ? brokers.find(b => b.id === brokerId) : undefined; 
    setSelectedBroker(broker); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBrokerId(undefined);
    setSelectedBroker(undefined); 
    fetchBrokers();
  };

  const deleteBroker = async (id: number) => {
    if (!confirm('Are you sure you want to delete this broker? This action cannot be undone.')) {
      return;
    }

    try {
      const { data: broker } = await supabase
        .from('brokers')
        .select('logo_url')
        .eq('id', id)
        .single();

      const { error: translationsError } = await supabase
        .from('broker_translations')
        .delete()
        .eq('broker_id', id);

      if (translationsError) throw translationsError;

      const { error } = await supabase
        .from('brokers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (broker?.logo_url) {
        try {
          const url = new URL(broker.logo_url);
          const pathParts = url.pathname.split('/');
          const filename = pathParts[pathParts.length - 1];

          if (filename) {
            await supabase.storage
              .from('broker-logos')
              .remove([filename]);
          }
        } catch (storageError: any) {
          console.error('Error deleting logo from storage:', storageError);
        }
      }
      setBrokers(brokers.filter(broker => broker.id !== id));
    } catch (error: any) {
      console.error('Error deleting broker:', error);
      alert('Failed to delete broker. Please try again.');
    }
  };

  const filteredBrokers = brokers.filter(broker =>
    (broker.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (broker.slug || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const brokerTypeOptions = [
    { value: null, label: 'All Broker Types' },
    { value: 'cfd', label: 'CFD Brokers' },
    { value: 'forex', label: 'Forex Brokers' },
    { value: 'crypto', label: 'Crypto Exchanges' },
    { value: 'stock', label: 'Stock Brokers' },
    { value: 'futures', label: 'Futures Brokers' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Brokers</h1>
          <p className="text-gray-600">Manage your brokers</p>
        </div>
        <Button
          className="bg-[#145588] hover:bg-[#0e3e66]"
          onClick={() => openEditModal()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Broker
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search brokers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full md:w-auto">
              <select
                value={selectedBrokerType || ''}
                onChange={(e) => setSelectedBrokerType(e.target.value || null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                {brokerTypeOptions.map(option => (
                  <option key={option.value || 'all'} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center"
                    onClick={() => handleSort('id')}
                  >
                    ID
                    <ArrowUpDown size={14} className="ml-1" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    <ArrowUpDown size={14} className="ml-1" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center"
                    onClick={() => handleSort('broker_type')}
                  >
                    Type
                    <ArrowUpDown size={14} className="ml-1" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center"
                    onClick={() => handleSort('rating')}
                  >
                    Rating
                    <ArrowUpDown size={14} className="ml-1" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center"
                    onClick={() => handleSort('sort_order')}
                  >
                    Order
                    <ArrowUpDown size={14} className="ml-1" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                    Loading brokers...
                  </td>
                </tr>
              ) : filteredBrokers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                    No brokers found
                  </td>
                </tr>
              ) : (
                filteredBrokers.map((broker) => (
                  <tr key={broker.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                          {broker.logo_url ? (
                            <img
                              src={broker.logo_url}
                              alt={`${broker.name || 'Broker'} logo`}
                              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                            />
                          ) : (
                            <span className="text-gray-500 text-xs">
                              {(broker.name || 'N/A').substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{broker.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{broker.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.broker_type === 'cfd' ? 'CFD Broker' :
                       broker.broker_type === 'forex' ? 'Forex Broker' :
                       broker.broker_type === 'crypto' ? 'Crypto Exchange' :
                       broker.broker_type === 'stock' ? 'Stock Broker' :
                       broker.broker_type === 'futures' ? 'Futures Broker' :
                       broker.broker_type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.rating}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(broker as any).sort_order}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleFeatured(broker.id!, (broker as any).is_featured)}
                        className={`p-1 rounded-full ${(broker as any).is_featured ? 'text-yellow-500 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        {(broker as any).is_featured ? <Star size={18} /> : <StarOff size={18} />}
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(broker.id!, (broker as any).active)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          (broker as any).active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {(broker as any).active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a href={`/broker/${broker.slug}`} target="_blank" rel="noopener noreferrer">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye size={18} />
                          </button>
                        </a>
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => openEditModal(broker.id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => deleteBroker(broker.id!)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <BrokerEditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          brokerId={selectedBrokerId}
          brokerType={selectedBrokerType || undefined}
          onSave={closeModal}
          existingBrokerData={selectedBroker}
        />
      )}
    </div>
  );
}
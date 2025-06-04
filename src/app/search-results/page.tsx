"use client";

import { useState, useRef, useEffect } from 'react'; // ChangeEvent entfernt
import { Input } from "@/components/ui/input";
import { Search, Check, Globe } from "lucide-react"; // Star entfernt
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase'; // Import Supabase client
import { BrokerCard } from '@/components/BrokerCard'; // Import the new BrokerCard component

// Updated interface to match actual broker data structure from DB
interface BrokerData {
  id: number;
  name: string;
  logo_url: string | null;
  features?: string | string[];
  bonus?: string;
  regulation?: string;
  rating: number;
  slug: string;
  risk_note?: string;
  broker_type?: string;
  broker_translations?: { search_result_text?: string | null } | null; // Keep this for search result text
}

// Define the list of broker types including "All Types"
const brokerTypesList = [
  "All Types", "CFD Brokers", "Forex Brokers", "Crypto Exchanges", "Stock Brokers", "Future Brokers"
];

// Interface für Länderdaten
interface CountryData {
  code: string;
  en: string;
  de: string;
  [key: string]: string; // Erlaubt zusätzliche Sprachcodes
}


export default function SearchResults() {
  const [sortBy, setSortBy] = useState('default');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isBrokerTypeDropdownOpen, setIsBrokerTypeDropdownOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All Payment Methods');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [selectedBrokerType, setSelectedBrokerType] = useState<string>(brokerTypesList[0]);

  const [allBrokers, setAllBrokers] = useState<BrokerData[]>([]);
  const [filteredBrokers, setFilteredBrokers] = useState<BrokerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentDropdownRef = useRef<HTMLDivElement>(null); // Typisierung hinzugefügt
  const countryDropdownRef = useRef<HTMLDivElement>(null); // Typisierung hinzugefügt
  const brokerTypeDropdownRef = useRef<HTMLDivElement>(null); // Typisierung hinzugefügt

  // --- Fetch Brokers Data ---
  useEffect(() => {
    const fetchBrokers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Select necessary columns, including broker_type and search_result_text from translations
        const { data, error: dbError } = await supabase
          .from('brokers')
          .select(`
            id, name, slug, logo_url, rating, bonus, features, regulation, risk_note, broker_type,
            broker_translations ( search_result_text )
          `)
          .eq('active', true)
          .eq('broker_translations.language_code', 'en'); // Fetch English translation

        if (dbError) {
          throw dbError;
        }

        // Flatten translation data
        const formattedData = (data || []).map(broker => ({
            ...broker,
            broker_translations: broker.broker_translations && Array.isArray(broker.broker_translations) && broker.broker_translations.length > 0
                ? broker.broker_translations[0]
                : null
        }));

        setAllBrokers(formattedData);
        setFilteredBrokers(formattedData);

      } catch (err: unknown) { // Typisierung korrigiert
        console.error("Error fetching brokers:", err);
        if (err instanceof Error) {
          setError(`Failed to load brokers: ${err.message}`);
        } else {
          setError("Failed to load brokers: An unknown error occurred.");
        }
        setAllBrokers([]);
        setFilteredBrokers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  // --- Filter Brokers based on searchTerm and selectedBrokerType ---
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = allBrokers.filter(broker => {
      const nameMatch = broker.name.toLowerCase().includes(lowerCaseSearchTerm);
      let dbBrokerType = '';
      if (selectedBrokerType === "CFD Brokers") dbBrokerType = 'cfd';
      else dbBrokerType = selectedBrokerType;

      const typeMatch = selectedBrokerType === "All Types" || broker.broker_type === dbBrokerType;
      return nameMatch && typeMatch;
    });
    setFilteredBrokers(filtered);
  }, [searchTerm, allBrokers, selectedBrokerType]);


  // Zahlungsmethoden (Beispiel, ggf. aus DB laden)
  const paymentMethods: { [key: string]: string[] } = {
    "Credit and Debit Cards": ["Visa", "MasterCard", "Maestro"],
    "Bank Transfers": ["Wire Transfer", "SEPA (Europe)", "ACH Transfer (US)", "Faster Payments (UK)"],
    "E-Wallets": ["PayPal", "Skrill", "Neteller", "ecoPayz", "WebMoney"],
    // ... other methods
  };

  // Länder (Beispiel, ggf. aus DB laden)
  const countries: CountryData[] = [ // Typisierung hinzugefügt
    { code: 'US', en: 'United States', de: 'Vereinigte Staaten', /* ... */ },
    { code: 'GB', en: 'United Kingdom', de: 'Vereinigtes Königreich', /* ... */ },
    // ... other countries
  ];

  // Removed renderStars, renderLicenses, renderFeatures as they are in BrokerCard.tsx

  // Funktion, um zu prüfen, ob eine Kategorie oder ihre Methoden dem Suchbegriff entsprechen
  const matchesSearch = (category: string, methods: string[] | undefined): boolean => {
    if (!paymentSearchTerm) return true; // Show all if no search term
    const lowerSearch = paymentSearchTerm.toLowerCase();
    if (category.toLowerCase().includes(lowerSearch)) return true;
    if (methods && methods.some(method => method.toLowerCase().includes(lowerSearch))) return true;
    return false;
  };

  // Funktion, um zu prüfen, ob eine bestimmte Methode dem Suchbegriff entspricht
  const methodMatchesSearch = (method: string): boolean => {
    if (!paymentSearchTerm) return true;
    return method.toLowerCase().includes(paymentSearchTerm.toLowerCase());
  };

  // Funktion, um zu prüfen, ob ein Land dem Suchbegriff entspricht
  const countryMatchesSearch = (country: CountryData): boolean => { // Typisierung korrigiert
    if (!countrySearchTerm) return true;
    const lowerSearch = countrySearchTerm.toLowerCase();
    // Suche in allen Sprachversionen des Ländernamens
    return (
      country.en.toLowerCase().includes(lowerSearch) ||
      country.de.toLowerCase().includes(lowerSearch) ||
      // Fügen Sie hier weitere Sprachcodes hinzu, falls vorhanden
      false // Standardwert, falls keine Übereinstimmung gefunden wird
    );
  };

  // Schließen der Dropdowns beim Klicken außerhalb
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) { // Typisierung korrigiert
        setIsPaymentDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) { // Typisierung korrigiert
        setIsCountryDropdownOpen(false);
      }
      if (brokerTypeDropdownRef.current && !brokerTypeDropdownRef.current.contains(event.target as Node)) { // Typisierung korrigiert
        setIsBrokerTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Aktuelle Sprache (für die Anzeige der Ländernamen)
  const currentLanguage = 'en'; // Hier später die tatsächliche Sprache aus dem Kontext verwenden

  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold">Broker Results</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Linker Filter-Bereich */}
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Filter Brokers</h2>

                {/* Suchfeld */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Broker Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="search"
                      placeholder="Broker title, keywords..."
                      className="pl-10 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state
                    />
                  </div>
                </div>

                {/* Country Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select your country of residency
                  </label>
                  <div className="relative" ref={countryDropdownRef}>
                    <button
                      className="flex items-center justify-between w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    >
                      <div className="flex items-center">
                        {selectedCountry ? (
                          <>
                            <Globe className="h-4 w-4 mr-2 text-gray-500" />
                            {countries.find(c => c.code === selectedCountry)?.[currentLanguage as keyof CountryData] || 'Select Country'} {/* Typisierung korrigiert */}
                          </>
                        ) : (
                          <>
                            <Globe className="h-4 w-4 mr-2 text-gray-500" />
                            Select Country
                          </>
                        )}
                      </div>
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-120">
                        <div className="px-3 py-2 border-b">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              type="search"
                              placeholder="Search countries..."
                              className="pl-10 w-full"
                              value={countrySearchTerm}
                              onChange={(e) => setCountrySearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {countries
                            .filter(country => countrySearchTerm === '' || countryMatchesSearch(country))
                            .map((country) => (
                              <button
                                key={country.code}
                                className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 ${selectedCountry === country.code ? 'bg-blue-50 text-blue-600' : ''}`}
                                onClick={() => {
                                  setSelectedCountry(country.code);
                                  setIsCountryDropdownOpen(false);
                                }}
                              >
                                {selectedCountry === country.code && (
                                  <Check className="h-4 w-4 mr-2 text-blue-500" />
                                )}
                                <span className={selectedCountry === country.code ? 'ml-6' : 'ml-0'}>
                                  {country[currentLanguage as keyof CountryData]} {/* Typisierung korrigiert */}
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Broker Types Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Broker Types</label>
                  <div className="relative" ref={brokerTypeDropdownRef}>
                    <button
                      className="flex items-center justify-between w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setIsBrokerTypeDropdownOpen(!isBrokerTypeDropdownOpen)}
                    >
                      {/* Display selected type */}
                      <span>{selectedBrokerType}</span>
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {isBrokerTypeDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                        {/* Use brokerTypesList which includes "All Types" */}
                        {brokerTypesList.map((type) => (
                          <button
                            key={type}
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 ${selectedBrokerType === type ? 'bg-blue-50 text-blue-600' : ''}`}
                            onClick={() => {
                              setSelectedBrokerType(type); // Set selected type state
                              setIsBrokerTypeDropdownOpen(false); // Close dropdown
                            }}
                          >
                             {selectedBrokerType === type && (
                                <Check className="h-4 w-4 mr-2 text-blue-500" />
                              )}
                             <span className={selectedBrokerType === type ? 'ml-6' : 'ml-0'}>
                                {type}
                             </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Methods Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Methods</label>
                  <div className="relative" ref={paymentDropdownRef}>
                    <button
                      className="flex items-center justify-between w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                    >
                      <span>{selectedPaymentMethod}</span>
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {isPaymentDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-120">
                        <div className="px-3 py-2 border-b">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              type="search"
                              placeholder="Search payment methods..."
                              className="pl-10 w-full"
                              value={paymentSearchTerm}
                              onChange={(e) => setPaymentSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          <button
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 ${selectedPaymentMethod === 'All Payment Methods' ? 'bg-blue-50 text-blue-600' : ''}`}
                            onClick={() => {
                              setSelectedPaymentMethod('All Payment Methods');
                              setIsPaymentDropdownOpen(false);
                            }}
                          >
                            {selectedPaymentMethod === 'All Payment Methods' && (
                              <Check className="h-4 w-4 mr-2 text-blue-500" />
                            )}
                            <span className={selectedPaymentMethod === 'All Payment Methods' ? 'ml-6' : 'ml-0'}>
                               All Payment Methods
                            </span>
                          </button>

                          {Object.entries(paymentMethods)
                            .filter(([category, methods]) =>
                              paymentSearchTerm === '' || matchesSearch(category, methods)
                            )
                            .map(([category, methods]) => (
                              <div key={category}>
                                {(paymentSearchTerm === '' || category.toLowerCase().includes(paymentSearchTerm.toLowerCase())) && (
                                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                                    {category}
                                  </div>
                                )}

                                {methods
                                  .filter(method => paymentSearchTerm === '' || methodMatchesSearch(method))
                                  .map((method) => (
                                    <button
                                      key={method}
                                      className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 ${selectedPaymentMethod === method ? 'bg-blue-50 text-blue-600' : ''}`}
                                      onClick={() => {
                                        setSelectedPaymentMethod(method);
                                        setIsPaymentDropdownOpen(false);
                                      }}
                                    >
                                      {selectedPaymentMethod === method && (
                                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                                      )}
                                      <span className={selectedPaymentMethod === method ? 'ml-6' : 'ml-0'}>
                                        {method}
                                      </span>
                                    </button>
                                  ))}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bonus Range Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Range</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
                    <option>All Bonuses</option>
                    <option>$0 - $500</option>
                    <option>$500 - $1000</option>
                    <option>$1000+</option>
                  </select>
                </div>

                {/* Apply Filters Button */}
                <button className="w-full bg-[#145588] hover:bg-[#0e3e66] text-white py-2 rounded-md font-medium">
                  Find Brokers
                </button>
              </div>
            </div>

            {/* Rechter Inhaltsbereich */}
            <div className="md:w-3/4">
              {/* Sortier- und Anzeigeoptionen */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Sort By:</span>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">(Default)</option>
                      <option value="rating-high">Rating: High to Low</option>
                      <option value="rating-low">Rating: Low to High</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Show:</span>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(e.target.value)}
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Broker-Karten */}
              {loading && <p>Loading brokers...</p>}
              {error && <p className="text-red-600">{error}</p>}
              {!loading && !error && (
                <div className="space-y-6">
                  {filteredBrokers.length > 0 ? (
                    filteredBrokers.map((broker) => (
                      // Use BrokerCard component, passing necessary props
                      <BrokerCard
                        key={broker.id}
                        id={broker.id}
                        name={broker.name}
                        slug={broker.slug}
                        logo_url={broker.logo_url}
                        rating={broker.rating}
                        bonus={broker.bonus}
                        features={broker.features}
                        regulation={broker.regulation}
                        risk_note={broker.risk_note}
                        search_result_text={broker.broker_translations?.search_result_text}
                      />
                    ))
                  ) : (
                    <p>No brokers found matching your criteria.</p>
                  )}
                </div>
              )}
              {/* Pagination Placeholder */}
              <div className="flex justify-center mt-8">
                <nav className="flex items-center">
                  <button className="px-3 py-1 border rounded-l-md hover:bg-gray-100">Previous</button>
                  <button className="px-3 py-1 border-t border-b bg-[#145588] text-white">1</button>
                  <button className="px-3 py-1 border-t border-b border-l hover:bg-gray-100">2</button>
                  <button className="px-3 py-1 border-t border-b border-l hover:bg-gray-100">3</button>
                  <button className="px-3 py-1 border rounded-r-md border-l hover:bg-gray-100">Next</button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";
// src/components/BrokerSearchFilter.tsx
import { useState, useEffect, useRef, ChangeEvent } from "react"; // Added ChangeEvent
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from 'next/link'; 

export function BrokerSearchFilter() {
  const [searchInputValue, setSearchInputValue] = useState(""); // Renamed state for clarity
  const [paymentSearchTerm, setPaymentSearchTerm] = useState(""); // Specific search term for payments
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("All Payment Methods");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Select Broker Type");
  
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  const brokerTypes = [
    "Select Broker Type",
    "CFD Brokers",
    "Forex Brokers",
    "Crypto Exchanges",
    "Stock Brokers",
    "Future Brokers" // Ensure Future Brokers is here
  ];

  const paymentMethods: { [key: string]: string[] | null } = { // Added type annotation
    "All Payment Methods": null,
    "Credit and Debit Cards": [
      "Visa",
      "MasterCard",
      "Maestro"
    ],
    "Bank Transfers": [
      "Wire Transfer",
      "SEPA (Europe)",
      "ACH Transfer (US)",
      "Faster Payments (UK)",
      "SWIFT"
    ],
    "E-Wallets": [
      "PayPal",
      "Skrill",
      "Neteller",
      "WebMoney",
      "ecoPayz"
    ],
    "Online Banking": [
      "Trustly",
      "Sofort",
      "Giropay",
      "Klarna",
      "iDEAL"
    ],
    "Region-Specific": [
      "Interac (Canada)",
      "POLi (Australia/NZ)",
      "EPS (Austria)"
    ]
  };

  // Event-Handler für Klicks außerhalb der Dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Schließe Payment Method Dropdown, wenn außerhalb geklickt wird
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setIsPaymentMethodOpen(false);
      }
      
      // Schließe Broker Type Dropdown, wenn außerhalb geklickt wird
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false);
      }
    }

    // Event-Listener hinzufügen, wenn ein Dropdown geöffnet ist
    if (isPaymentMethodOpen || isTypeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Event-Listener entfernen, wenn die Komponente unmounted oder beide Dropdowns geschlossen werden
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPaymentMethodOpen, isTypeOpen]); // Dependencies are correct

  // Funktion, um zu prüfen, ob eine Kategorie oder ihre Methoden dem Suchbegriff entsprechen
  const matchesSearch = (category: string, methods: string[] | null): boolean => { // Added return type
    if (category.toLowerCase().includes(paymentSearchTerm.toLowerCase())) return true;
    if (methods && methods.some((method: string) => method.toLowerCase().includes(paymentSearchTerm.toLowerCase()))) return true;
    return false;
  };

  // Funktion, um zu prüfen, ob eine bestimmte Methode dem Suchbegriff entspricht
  const methodMatchesSearch = (method: string): boolean => { // Added return type
    return method.toLowerCase().includes(paymentSearchTerm.toLowerCase());
  };

  return (
    <div className="py-8 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="search" 
                placeholder="Search for brokers, stocks, trading types..." // Platzhalter geändert
                className="pl-10 w-full"
                value={searchInputValue} // Controlled input
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInputValue(e.target.value)} // Added onChange
              />
            </div>
          </div>
          
          {/* Broker Type Dropdown */}
          <div className="w-full md:w-64 relative" ref={typeDropdownRef}>
            <button
              onClick={() => {
                setIsTypeOpen(!isTypeOpen);
                setIsPaymentMethodOpen(false); // Close other dropdown
              }}
              className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-left h-10" // Added fixed height h-10
            >
              <span>{selectedType}</span>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isTypeOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {brokerTypes.map((type) => (
                  <button
                    key={type}
                    className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-blue-50"
                    onClick={() => {
                      setSelectedType(type);
                      setIsTypeOpen(false);
                    }}
                  >
                    <span>{type}</span>
                    {selectedType === type && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Payment Method Dropdown with Search */}
          <div className="w-full md:w-64 relative" ref={paymentDropdownRef}>
            <button
              onClick={() => {
                setIsPaymentMethodOpen(!isPaymentMethodOpen);
                setIsTypeOpen(false); // Close other dropdown
              }}
              className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-left h-10" // Added fixed height h-10
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10H21M7 15H17M12 3V21M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{selectedPaymentMethod}</span>
              </div>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isPaymentMethodOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search payment methods..."
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md text-sm"
                      value={paymentSearchTerm} // Use specific state
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentSearchTerm(e.target.value)} // Use specific setter
                    />
                  </div>
                </div>
                
                <div className="py-1">
                  {/* All Payment Methods option */}
                  {(paymentSearchTerm === "" || "all payment methods".includes(paymentSearchTerm.toLowerCase())) && (
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-blue-50"
                      onClick={() => {
                        setSelectedPaymentMethod("All Payment Methods");
                        setIsPaymentMethodOpen(false);
                        setPaymentSearchTerm(""); // Reset specific search term
                      }}
                    >
                      <span>All Payment Methods</span>
                      {selectedPaymentMethod === "All Payment Methods" && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </button>
                  )}
                  
                  {/* Categories and their methods */}
                  {Object.entries(paymentMethods).map(([category, methods]) => {
                    if (category === "All Payment Methods") return null;
                    
                    // Skip categories that don't match search
                    if (paymentSearchTerm && !matchesSearch(category, methods)) {
                      return null;
                    }
                    
                    // Wenn wir nach etwas suchen, zeigen wir nur die Kategorien und Methoden an, die übereinstimmen
                    const showCategory = paymentSearchTerm === "" || category.toLowerCase().includes(paymentSearchTerm.toLowerCase());
                    const matchingMethods = methods?.filter(method => methodMatchesSearch(method)) || [];
                    
                    // Don't render category if no methods match search term
                    if (paymentSearchTerm && matchingMethods.length === 0 && !category.toLowerCase().includes(paymentSearchTerm.toLowerCase())) {
                        return null;
                    }

                    return (
                      <div key={category}>
                        {/* Category */}
                        {showCategory && (
                          <div className="px-4 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                            {category}
                          </div>
                        )}
                        
                        {/* Methods under this category */}
                        {matchingMethods.map(method => (
                          <button
                            key={method}
                            className="flex items-center justify-between w-full px-8 py-2 text-left hover:bg-blue-50"
                            onClick={() => {
                              setSelectedPaymentMethod(method);
                              setIsPaymentMethodOpen(false);
                              setPaymentSearchTerm(""); // Reset specific search term
                            }}
                          >
                            <span>{method}</span>
                            {selectedPaymentMethod === method && (
                              <Check className="h-4 w-4 text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Find Brokers Button */}
         {/* Find Brokers Button */}
<div>
  <Link 
    href="/search-results" 
    className="inline-flex items-center justify-center h-10 w-full md:w-auto bg-[#145588] hover:bg-[#0e3e66] text-white py-3 px-6 rounded-md font-medium h-10 border border-transparent"
  >
    Find Brokers
  </Link>
</div>
        </div>
      </div>
    </div>
  );
}
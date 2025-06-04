"use client";
// src/components/Header.tsx
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

export function Header() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'gb', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'br', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'pt', name: 'Português (Portugal)', flag: '🇵🇹' }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  // Event-Handler für Klicks außerhalb des Dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    }

    // Event-Listener hinzufügen, wenn der Dropdown geöffnet ist
    if (isLanguageOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Event-Listener entfernen, wenn die Komponente unmounted oder der Dropdown geschlossen wird
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageOpen]);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-blue-600 font-bold text-xl">
          TradeSpotter
        </Link>

        {/* Hauptnavigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/brokers" className="text-gray-600 hover:text-gray-900">
            Brokers
          </Link>
          <Link href="/trading-types" className="text-gray-600 hover:text-gray-900">
            Trading Types
          </Link>
          <Link href="/order-types" className="text-gray-600 hover:text-gray-900">
            Order Types in Trading
          </Link>
          <Link href="/stocks" className="text-gray-600 hover:text-gray-900">
            Stocks
          </Link>
          <Link href="/guides" className="text-gray-600 hover:text-gray-900">
            Guides
          </Link>
        </div>

        {/* Rechte Seite: Sprache, Vergleichen, Admin */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Sprachauswahl Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center text-gray-600 hover:text-gray-900"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              <Globe className="h-5 w-5 mr-1" />
              {selectedLanguage.name}
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            
            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-blue-50"
                    onClick={() => {
                      setSelectedLanguage(language);
                      setIsLanguageOpen(false);
                    }}
                  >
                    <span className="mr-2">{language.flag}</span>
                    <span>{language.name}</span>
                    {selectedLanguage.code === language.code && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/compare-brokers" className="flex items-center text-gray-600 hover:text-gray-900">
            Compare Brokers
          </Link>
          <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
            Admin
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            {/* Hamburger Icon */}
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
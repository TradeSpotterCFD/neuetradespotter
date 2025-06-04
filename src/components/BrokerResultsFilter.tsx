// src/components/BrokerResultsFilter.tsx
"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// Link import entfernt, da unbenutzt

export function BrokerResultsFilter() {
  // selectedType, setSelectedType, selectedPaymentMethod, setSelectedPaymentMethod entfernt, da unbenutzt

  const brokerTypes = [
    "All Types",
    "CFD Brokers",
    "Forex Brokers",
    "Crypto Exchanges",
    "Stock Brokers"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-screen overflow-y-auto p-4">

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder="Broker title, keywords..."
          className="pl-10 w-full"
        />
      </div>

      {/* Location Dropdown */}
      <div className="relative">
        <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
          <option>All Locations</option>
          <option>Europe</option>
          <option>North America</option>
          <option>Asia</option>
          <option>Australia</option>
          <option>Africa</option>
        </select>
      </div>

      {/* Categories Dropdown */}
      <div className="relative">
        <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
          <option>All Categories</option>
          <option>CFD Trading</option>
          <option>Forex Trading</option>
          <option>Crypto Trading</option>
          <option>Stock Trading</option>
        </select>
      </div>

      {/* Broker Types Dropdown */}
      <div className="relative">
        <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
          {brokerTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Bonus Range Slider */}
      <div className="relative">
        <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
          <option>Bonus Range: $0 - $1000</option>
          <option>$0 - $500</option>
          <option>$500 - $1000</option>
          <option>$1000+</option>
        </select>
      </div>

      {/* Payment Methods Dropdown */}
      <div className="relative">
        <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
          <option>All Payment Methods</option>
          <option>Credit Cards</option>
          <option>Bank Transfer</option>
          <option>E-Wallets</option>
          <option>Crypto</option>
          <option>Visa</option>
          <option>MasterCard</option>
          <option>Skrill</option>
          <option>Neteller</option>
          <option>Bitcoin</option>
          <option>Ethereum</option>
        </select>
      </div>

      {/* Apply Filters Button */}
      <div className="col-span-1 md:col-span-3 mt-2">
        <button className="w-full bg-[#145588] hover:bg-[#0e3e66] text-white py-2 rounded-md font-medium">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
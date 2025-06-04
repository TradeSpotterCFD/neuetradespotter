"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
// Removed Checkbox import as it's not used here directly anymore
// import { Checkbox } from "@/components/ui/checkbox";
// Select, SelectTrigger, SelectContent, SelectItem, SelectValue Importe entfernt, da unbenutzt

interface BrokerFormProps {
  brokerData: { // Spezifischere Typisierung
    name: string;
    slug: string;
    rating: number | string;
    website_url?: string;
    risk_note?: string;
    company?: string;
    headquarters?: string;
    min_deposit?: number | string;
    max_leverage?: string;
    audit_compliance?: string;
    spreads_from?: string;
    withdrawal_fees?: string;
    customer_support?: string;
    user_base?: string;
    fund_security?: string;
    founded_year?: number | string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsRegulationModalOpen: (open: boolean) => void; // Added back modal setter
  setIsMarketsModalOpen: (open: boolean) => void;
  selectedRegulations: string[];
  // setSelectedRegulations: React.Dispatch<React.SetStateAction<string[]>>; // Removed setter, handled by modal
  selectedMarkets: string[];
  selectedDepositMethods: string[];
  setIsDepositMethodsModalOpen: (open: boolean) => void;
  selectedTradingPlatforms: string[];
  setIsTradingPlatformsModalOpen: (open: boolean) => void;
  selectedEducationTools: string[];
  setIsEducationToolsModalOpen: (open: boolean) => void;
}

// Removed regulatorOptions constant, assuming it's defined in the modal or passed differently

const BrokerForm: React.FC<BrokerFormProps> = ({
  brokerData,
  handleInputChange,
  setIsRegulationModalOpen, // Added back
  setIsMarketsModalOpen,
  selectedRegulations,
  // setSelectedRegulations, // Removed
  selectedMarkets,
  selectedDepositMethods,
  setIsDepositMethodsModalOpen,
  selectedTradingPlatforms,
  setIsTradingPlatformsModalOpen,
  selectedEducationTools,
  setIsEducationToolsModalOpen,
}) => {

  // Removed handleRegulationChange handler

  return (
    <fieldset className="space-y-4 border p-4 rounded-md">
      <legend className="text-sm font-medium px-1">Basic Information</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Broker Name*</Label>
          <Input id="name" name="name" value={brokerData.name} onChange={handleInputChange} required placeholder="Broker Name" />
        </div>
        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" name="slug" value={brokerData.slug} onChange={handleInputChange} placeholder="auto-generated-if-empty" />
        </div>
        <div>
          <Label htmlFor="rating">Overall Rating (0-5)*</Label>
          <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" value={brokerData.rating} onChange={handleInputChange} required placeholder="e.g., 4.8" />
        </div>
        {/* Broker Type Select Removed */}
        <div>
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" name="website_url" type="url" value={brokerData.website_url || ''} onChange={handleInputChange} placeholder="https://broker-website.com" />
        </div>
        <div>
          <Label htmlFor="risk_note">Risk Note</Label>
          <Input id="risk_note" name="risk_note" value={brokerData.risk_note || ''} onChange={handleInputChange} placeholder="e.g., 75% of retail accounts lose money..." />
        </div>
      </div>

      <div className="w-full border-t border-gray-300 my-6"></div>
      <h3 className="text-lg font-semibold mb-4">At a glance</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" value={brokerData.company || ''} onChange={handleInputChange} placeholder="e.g., CFD Trading Ltd." />
        </div>
        <div>
          <Label htmlFor="headquarters">Headquarters</Label>
          <Input id="headquarters" name="headquarters" value={brokerData.headquarters || ''} onChange={handleInputChange} placeholder="e.g., London, UK" />
        </div>
        <div>
          <Label htmlFor="min_deposit">Min. Deposit ($)</Label>
          <Input id="min_deposit" name="min_deposit" type="number" value={brokerData.min_deposit || ''} onChange={handleInputChange} placeholder="e.g., 100" />
        </div>
        <div>
          <Label htmlFor="max_leverage">Max. Leverage</Label>
          <Input id="max_leverage" name="max_leverage" value={brokerData.max_leverage || ''} onChange={handleInputChange} placeholder="e.g., 1:30 (Retail)" />
        </div>
        <div>
          <Label htmlFor="founded_year">Founded Year</Label>
          <Input id="founded_year" name="founded_year" type="number" value={brokerData.founded_year || ''} onChange={handleInputChange} placeholder="e.g., 2010" />
        </div>
         {/* Restored Regulation Button */}
         <div>
          <Label>Regulation</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsRegulationModalOpen(true)}
          >
            {selectedRegulations?.length > 0
              ? `${selectedRegulations.length} Regulations Selected`
              : 'Select Regulations'}
          </Button>
        </div>
        <div>
          <Label>Markets</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsMarketsModalOpen(true)}
          >
            {selectedMarkets?.length > 0
              ? `${selectedMarkets.length} Markets Selected`
              : 'Select Markets'}
          </Button>
        </div>
        <div>
          <Label htmlFor="audit_compliance">Audit / Compliance</Label>
          <Input id="audit_compliance" name="audit_compliance" value={brokerData.audit_compliance || ''} onChange={handleInputChange} placeholder="e.g., Annual audit by EY" />
        </div>
        <div>
          <Label htmlFor="spreads_from">Spreads From</Label>
          <Input id="spreads_from" name="spreads_from" value={brokerData.spreads_from || ''} onChange={handleInputChange} placeholder="e.g., From 0.6 Pips (EUR/USD)" />
        </div>
        <div>
          <Label>Trading Platforms</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsTradingPlatformsModalOpen(true)}
          >
            {selectedTradingPlatforms?.length > 0
              ? `${selectedTradingPlatforms.length} Platforms Selected`
              : 'Select Trading Platforms'}
          </Button>
        </div>
        <div>
          <Label>Deposit Methods</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsDepositMethodsModalOpen(true)}
          >
            {selectedDepositMethods?.length > 0
              ? `${selectedDepositMethods.length} Methods Selected`
              : 'Select Deposit Methods'}
          </Button>
        </div>
        <div>
          <Label htmlFor="withdrawal_fees">Withdrawal Fees</Label>
          <Input id="withdrawal_fees" name="withdrawal_fees" value={brokerData.withdrawal_fees || ''} onChange={handleInputChange} placeholder="e.g., None (first withdrawal per month free, then €5)" />
        </div>
        <div>
          <Label htmlFor="customer_support">Customer Support</Label>
          <Input id="customer_support" name="customer_support" value={brokerData.customer_support || ''} onChange={handleInputChange} placeholder="e.g., 24/5 Live-Chat, E-Mail, Phone, Multilingual Support" />
        </div>
        <div>
          <Label htmlFor="user_base">User Base</Label>
          <Input id="user_base" name="user_base" value={brokerData.user_base || ''} onChange={handleInputChange} placeholder="e.g., Over 250,000 active traders worldwide" />
        </div>
        <div>
          <Label htmlFor="fund_security">Fund Security</Label>
          <Input id="fund_security" name="fund_security" value={brokerData.fund_security || ''} onChange={handleInputChange} placeholder="e.g., Segregated client funds, Deposit protection up to €20,000" />
        </div>
        <div>
          <Label>Education Tools</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsEducationToolsModalOpen(true)}
          >
            {selectedEducationTools?.length > 0
              ? `${selectedEducationTools.length} Tools Selected`
              : 'Select Education Tools'}
          </Button>
        </div>
      </div>
    </fieldset>
  );
};

export default BrokerForm;
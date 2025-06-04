import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BrokerData } from '../BrokerEditModal'; // Importiere BrokerData Typ
import { SetStateAction, Dispatch } from 'react'; // Importiere Dispatch und SetStateAction


interface MarketsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedMarkets: string[];
  setSelectedMarkets: React.Dispatch<React.SetStateAction<string[]>>;
  // setBrokerData: (fn: (prev: { markets: string | string[] | null; [key: string]: any }) => { markets: string; [key: string]: any }) => void; // Alte Typisierung
  setBrokerData: Dispatch<SetStateAction<BrokerData>>; // Korrigierte Typisierung
}

// depositMethodOptions entfernt, da unbenutzt

// Optional: Add structure for better display (e.g., headings)
const marketOptions = [
  "Indices", "Forex", "Stocks", "Commodities", "Cryptocurrencies", "ETFs", "Bonds", "Options", "Futures", "Interest Rates", "Sectors", "Metals", "Energies", "Agricultural Commodities", "Volatility Indices", "Thematic Portfolios", "IPO CFDs"
];


const MarketsModal: React.FC<MarketsModalProps> = ({
  isOpen,
  setIsOpen,
  selectedMarkets,
  setSelectedMarkets,
  setBrokerData
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Markets</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto space-y-2 my-4 pr-2">
          {marketOptions.map((market) => (
            <div key={market} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`market-${market}`}
                checked={selectedMarkets.includes(market)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMarkets((prev) => [...prev, market]); // Typisierung entfernt, da überflüssig
                  } else {
                    setSelectedMarkets((prev) => prev.filter((m) => m !== market)); // Typisierung entfernt, da überflüssig
                  }
                }}
              />
              <label htmlFor={`market-${market}`} className="text-sm">{market}</label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              // Save the selected English method names to the main broker data
              setBrokerData((prev) => ({ // Typisierung korrigiert
                ...prev,
                markets: selectedMarkets.join(', '),
              }));
              setIsOpen(false);
            }}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketsModal;
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BrokerData } from '../BrokerEditModal'; // Importiere BrokerData Typ
import { SetStateAction, Dispatch } from 'react'; // Importiere Dispatch und SetStateAction


interface TradingPlatformsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedPlatforms: string[];
  setSelectedPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
  // setBrokerData: (fn: (prev: { trading_platforms: string | string[] | null; [key: string]: any }) => { trading_platforms: string; [key: string]: any }) => void; // Alte Typisierung
  setBrokerData: Dispatch<SetStateAction<BrokerData>>; // Korrigierte Typisierung
}

const platformOptions = [
  "MetaTrader 4 (MT4)",
  "MetaTrader 5 (MT5)",
  "cTrader",
  "NinjaTrader",
  "TradingView",
  "ActTrader",
  "ProRealTime",
  "IG WebTrader / L2 Dealer",
  "SaxoTraderGO / PRO",
  "xStation",
  "Next Generation",
  "eToro WebTrader",
  "Plus500 WebTrader",
  "ThinkTrader",
  "Capital.com App / Web"
];

const TradingPlatformsModal: React.FC<TradingPlatformsModalProps> = ({
  isOpen,
  setIsOpen,
  selectedPlatforms,
  setSelectedPlatforms,
  setBrokerData
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Trading Platforms</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto space-y-2 my-4 pr-2">
          {platformOptions.map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`platform-${platform}`}
                checked={selectedPlatforms.includes(platform)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPlatforms((prev) => [...prev, platform]); // Typisierung entfernt, da überflüssig
                  } else {
                    setSelectedPlatforms((prev) => prev.filter((p) => p !== platform)); // Typisierung entfernt, da überflüssig
                  }
                }}
              />
              <label htmlFor={`platform-${platform}`} className="text-sm">{platform}</label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              // Save the selected platform names to the main broker data
              setBrokerData((prev) => ({ // Typisierung korrigiert
                ...prev,
                trading_platforms: selectedPlatforms.join(', '),
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

export default TradingPlatformsModal;
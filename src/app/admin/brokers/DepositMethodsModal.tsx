import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BrokerData } from '../BrokerEditModal'; // Importiere BrokerData Typ
import { SetStateAction, Dispatch } from 'react'; // Importiere Dispatch und SetStateAction


interface DepositMethodsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedMethods: string[];
  setSelectedMethods: React.Dispatch<React.SetStateAction<string[]>>;
  // setBrokerData: (fn: (prev: { deposit_methods: string | string[] | null; [key: string]: any }) => { deposit_methods: string; [key: string]: any }) => void; // Alte Typisierung
  setBrokerData: Dispatch<SetStateAction<BrokerData>>; // Korrigierte Typisierung
}

// depositMethodOptions entfernt, da unbenutzt

// Optional: Add structure for better display (e.g., headings)
const groupedOptions = {
  "Credit/Debit Cards": ["Visa", "MasterCard"],
  "Bank Transfers": ["Wire Transfer", "SEPA", "SWIFT", "Faster Payments (UK)"],
  "Cryptocurrencies": ["Bitcoin (BTC)", "Ethereum (ETH)", "Litecoin (LTC)", "Tether (USDT)", "Ripple (XRP)", "USDC"],
  "Payment Gateways": ["Simplex", "MoonPay", "Banxa", "Mercuryo"],
  "E-Wallets": ["Skrill", "Neteller", "AdvCash"],
  "Peer-to-Peer (P2P)": ["LocalBitcoins", "Paxful"]
};


const DepositMethodsModal: React.FC<DepositMethodsModalProps> = ({
  isOpen,
  setIsOpen,
  selectedMethods,
  setSelectedMethods,
  setBrokerData
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg"> {/* Wider modal */}
        <DialogHeader>
          <DialogTitle>Select Deposit Methods</DialogTitle>
        </DialogHeader>
        <div className="max-h-[500px] overflow-y-auto space-y-4 my-4 pr-2"> {/* Added padding-right */}
          {Object.entries(groupedOptions).map(([group, options]) => (
            <div key={group}>
              <h4 className="font-semibold mb-2 text-sm">{group}</h4>
              <div className="grid grid-cols-2 gap-2 pl-4"> {/* Indent options */}
                {options.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`method-${method}`}
                      checked={selectedMethods.includes(method)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMethods((prev) => [...prev, method]); // Typisierung entfernt, da überflüssig
                        } else {
                          setSelectedMethods((prev) => prev.filter((m) => m !== method)); // Typisierung entfernt, da überflüssig
                        }
                      }}
                    />
                    <label htmlFor={`method-${method}`} className="text-sm">{method}</label> {/* Smaller font */}
                  </div>
                ))}
              </div>
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
                deposit_methods: selectedMethods.join(', '),
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

export default DepositMethodsModal;
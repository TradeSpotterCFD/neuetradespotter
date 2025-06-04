import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BrokerData } from '../BrokerEditModal'; // Importiere BrokerData Typ
import { SetStateAction, Dispatch } from 'react'; // Importiere Dispatch und SetStateAction


interface EducationToolsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedTools: string[];
  setSelectedTools: React.Dispatch<React.SetStateAction<string[]>>;
  // setBrokerData: (fn: (prev: { education_tools: string | string[] | null; [key: string]: any }) => { education_tools: string; [key: string]: any }) => void; // Alte Typisierung
  setBrokerData: Dispatch<SetStateAction<BrokerData>>; // Korrigierte Typisierung
}

const toolOptions = [
  "Webinars",
  "E-Books",
  "Video Tutorials",
  "Trading Academy",
  "Demo Account",
  "Market Analysis",
  "Economic Calendar",
  "Trading Glossary",
  "Strategy Guides",
  "Platform Tutorials",
  "Live Trading Sessions",
  "One-on-One Coaching",
  "Beginner Courses",
  "Advanced Trading Courses",
  "Daily/Weekly Newsletters",
  "Risk Management Training",
  "Mobile Learning App",
  "PDF Guides & Whitepapers",
  "Interactive Quizzes",
  "Community Forum or Discord"
];

const EducationToolsModal: React.FC<EducationToolsModalProps> = ({
  isOpen,
  setIsOpen,
  selectedTools,
  setSelectedTools,
  setBrokerData
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Education Tools</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto space-y-2 my-4 pr-2">
          {toolOptions.map((tool) => (
            <div key={tool} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`tool-${tool}`}
                checked={selectedTools.includes(tool)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTools((prev) => [...prev, tool]); // Typisierung entfernt, da überflüssig
                  } else {
                    setSelectedTools((prev) => prev.filter((t) => t !== tool)); // Typisierung entfernt, da überflüssig
                  }
                }}
              />
              <label htmlFor={`tool-${tool}`} className="text-sm">{tool}</label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              // Save the selected tool names to the main broker data
              setBrokerData((prev) => ({ // Typisierung korrigiert
                ...prev,
                education_tools: selectedTools.join(', '),
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

export default EducationToolsModal;
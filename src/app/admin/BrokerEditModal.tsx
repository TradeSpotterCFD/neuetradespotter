"use client";
// import BrokerForm from './brokers/BrokerForm'; // Entfernt, da unbenutzt
import MarketsModal from './brokers/MarketsModal';
import DepositMethodsModal from './brokers/DepositMethodsModal';
import TradingPlatformsModal from './brokers/TradingPlatformsModal';
import EducationToolsModal from './brokers/EducationToolsModal';
// Import RegulationModal - Assuming it exists and is needed based on the button
// import RegulationModal from './brokers/RegulationModal'; // Entfernt, da Datei nicht gefunden wurde


import { useState, useEffect, useRef, useCallback, ChangeEvent, JSX } from 'react'; // Dispatch, SetStateAction entfernt
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Textarea importiert
// import { Checkbox } from "@/components/ui/checkbox"; // Keep removed for now
import { supabase } from '@/lib/supabase';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Link2Off, Table as TableIcon } from 'lucide-react';
import NextImage from 'next/image'; // Import Next.js Image component

const supportedLanguages = [
  { code: 'en', name: 'English' }, { code: 'de', name: 'Deutsch' }, { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' }, { code: 'pl', name: 'Polski' }, { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'pt-PT', name: 'Português (Portugal)' },
];

// Define the list of possible features
const featureOptions = [
    "Mobile Compatible", "Trading Tools", "Fast Payouts", "VIP Program",
    "Low Fees", "Demo account", "Beginner Friendly", "24/7 Customer Support",
    "Low Minimum Deposit", "Wide Asset Selection", "Regulated and Secure",
    "Advanced Charting Tools", "Social Trading Features", "Negative Balance Protection",
    "Multi-Asset Platform", "Cryptocurrency Trading", "Commission-Free Stocks"
];


// Updated interface for translation data
interface TranslationData {
  meta_title: string; meta_description: string;
  search_result_text?: string;
  review_summary?: string;
  introduction_1?: string; introduction_2?: string; slider_images?: string[] | null;
  regulation_security_title?: string; regulation_security_text?: string;
  regulation_security_text_2?: string; // This will now store HTML
  trading_offerings_title?: string;
  trading_offerings_text_1?: string;
  trading_offerings_text_2?: string;
  tp_ux_title?: string;
  tp_ux_text?: string;
  demo_title?: string;
  demo_text?: string;
  fees_commissions_title?: string;
  fees_commissions_text_1?: string;
  fees_commissions_text_2?: string;
  fees_commissions_image_1?: string | null;
  fees_commissions_image_2?: string | null;
}

export interface BrokerData { // Exportiere die Schnittstelle
  id?: number; name: string; slug: string; company?: string; logo_url: string | null; rating: number | string;
  broker_type: string; website_url?: string; risk_note?: string; founded_year?: number | string;
  headquarters?: string; min_deposit?: number | string; max_leverage?: string; regulation?: string;
  audit_compliance?: string; spreads_from?: string; markets?: string; trading_platforms?: string;
  deposit_methods?: string; withdrawal_fees?: string; customer_support?: string; user_base?: string;
  fund_security?: string; education_tools?: string;
  features?: string[] | null; // Changed type to string[] | null assuming DB type is text[]
  translations: { [key: string]: Partial<TranslationData>; };
  bonus?: string; // Bonus Feld hinzugefügt
}

const initialBrokerData: BrokerData = {
  name: '', slug: '', company: '', logo_url: null, rating: 0, broker_type: 'cfd', website_url: '', risk_note: '',
  founded_year: '', headquarters: '', min_deposit: '', max_leverage: '', regulation: '', audit_compliance: '',
  spreads_from: '', markets: '', trading_platforms: '', deposit_methods: '', withdrawal_fees: '',
  customer_support: '', user_base: '', fund_security: '', education_tools: '', features: null, translations: {},
  bonus: '', // Bonus initialisiert
};

interface BrokerEditModalProps { 
  isOpen: boolean; 
  onClose: () => void; 
  brokerId?: number; 
  brokerType?: string; 
  onSave: () => void;
  existingBrokerData?: BrokerData | null; // ✅ NEU: Für Edit Funktionalität
}

interface TiptapEditorProps {
  langCode: string;
  field: keyof TranslationData;
  value: string | undefined;
  onChange: (langCode: string, field: keyof TranslationData, value: string) => void;
  placeholder?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ langCode, field, value, onChange, placeholder }) => {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
        validate: href => /^https?:\/\//.test(href) || /^\//.test(href) || /^#/.test(href),
      }),
      Placeholder.configure({ placeholder: placeholder || '' }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(langCode, field, editor.getHTML());
    },
  });

  useEffect(() => {
      if (editor && !editor.isDestroyed && value !== editor.getHTML()) {
          const timer = setTimeout(() => {
              if (editor && !editor.isDestroyed && editor.isEditable) {
                  editor.commands.setContent(value || '', false);
              }
          }, 0);
          return () => clearTimeout(timer);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor?.isEditable]);


  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    if (editor.state.selection.empty && !editor.isActive('link')) return;
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL', previousUrl);
    if (url === null) return;
    const trimmedUrl = url.trim();
    if (trimmedUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmedUrl }).run();
  }, [editor]);

  const handleUnsetLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const handleAddImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleAddTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control
              onClick={handleSetLink}
              title="Set/Update Link"
              aria-label="Set/Update Link"
              disabled={!editor || (editor.state.selection.empty && !editor.isActive('link'))}
            >
              <LinkIcon className="h-4 w-4" />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              onClick={handleUnsetLink}
              title="Unset Link"
              disabled={!editor?.isActive('link')}
              aria-label="Unset Link"
            >
              <Link2Off className="h-4 w-4" />
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control
              onClick={handleAddImage}
              title="Add Image"
              aria-label="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              onClick={handleAddTable}
              title="Insert Table"
              aria-label="Insert Table"
            >
              <TableIcon className="h-4 w-4" />
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
};

export function BrokerEditModal({
  isOpen,
  onClose,
  brokerId,
  brokerType = 'cfd',
  onSave,
  existingBrokerData // ✅ NEU: Empfange die Broker-Daten
}: BrokerEditModalProps) {
  const [brokerData, setBrokerData] = useState<BrokerData>({ ...initialBrokerData, broker_type: brokerType });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRegulationModalOpen, setIsRegulationModalOpen] = useState(false);
  const [selectedRegulations, setSelectedRegulations] = useState<string[]>([]);
  const [isMarketsModalOpen, setIsMarketsModalOpen] = useState(false);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [isDepositMethodsModalOpen, setIsDepositMethodsModalOpen] = useState(false);
  const [selectedDepositMethods, setSelectedDepositMethods] = useState<string[]>([]);
  const [isTradingPlatformsModalOpen, setIsTradingPlatformsModalOpen] = useState(false);
  const [selectedTradingPlatforms, setSelectedTradingPlatforms] = useState<string[]>([]);
  const [isEducationToolsModalOpen, setIsEducationToolsModalOpen] = useState(false);
  const [selectedEducationTools, setSelectedEducationTools] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sliderImagePreviews, setSliderImagePreviews] = useState<{ [langCode: string]: { file?: File, url: string, id: string }[] }>({});
  const [feesCommissionsImage1Files, setFeesCommissionsImage1Files] = useState<{ [langCode: string]: File | null }>({});
  const [feesCommissionsImage1Previews, setFeesCommissionsImage1Previews] = useState<{ [langCode: string]: string | null }>({});
  const [feesCommissionsImage2Files, setFeesCommissionsImage2Files] = useState<{ [langCode: string]: File | null }>({});
  const [feesCommissionsImage2Previews, setFeesCommissionsImage2Previews] = useState<{ [langCode: string]: string | null }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderFileInputRef = useRef<{ [langCode: string]: HTMLInputElement | null }>({});
  const feesImage1InputRef = useRef<{ [langCode: string]: HTMLInputElement | null }>({});
  const feesImage2InputRef = useRef<{ [langCode: string]: HTMLInputElement | null }>({});

  // 🔧 NEU: useEffect zum Laden der Daten beim Bearbeiten
  useEffect(() => {
    console.log('=== BROKER EDIT MODAL DEBUG ===');
    console.log('brokerId:', brokerId);
    console.log('existingBrokerData:', existingBrokerData);
    console.log('isOpen:', isOpen);

    if (brokerId && existingBrokerData && isOpen) {
      console.log('Loading existing broker data for editing...');
      
      // Setze alle Basis-Daten
      setBrokerData(existingBrokerData);
      
      // Setze die Features
      if (existingBrokerData.features && Array.isArray(existingBrokerData.features)) {
        setSelectedFeatures(existingBrokerData.features);
      }
      
      // Setze Markets (falls als String gespeichert)
      if (existingBrokerData.markets) {
        const marketsArray = typeof existingBrokerData.markets === 'string' 
          ? existingBrokerData.markets.split(', ').filter(Boolean)
          : existingBrokerData.markets;
        setSelectedMarkets(marketsArray);
      }
      
      // Setze Trading Platforms
      if (existingBrokerData.trading_platforms) {
        const platformsArray = typeof existingBrokerData.trading_platforms === 'string'
          ? existingBrokerData.trading_platforms.split(', ').filter(Boolean)
          : existingBrokerData.trading_platforms;
        setSelectedTradingPlatforms(platformsArray);
      }
      
      // Setze Deposit Methods
      if (existingBrokerData.deposit_methods) {
        const methodsArray = typeof existingBrokerData.deposit_methods === 'string'
          ? existingBrokerData.deposit_methods.split(', ').filter(Boolean)
          : existingBrokerData.deposit_methods;
        setSelectedDepositMethods(methodsArray);
      }
      
      // Setze Education Tools
      if (existingBrokerData.education_tools) {
        const toolsArray = typeof existingBrokerData.education_tools === 'string'
          ? existingBrokerData.education_tools.split(', ').filter(Boolean)
          : existingBrokerData.education_tools;
        setSelectedEducationTools(toolsArray);
      }
      
      // Setze Regulations
      if (existingBrokerData.regulation) {
        const regulationsArray = typeof existingBrokerData.regulation === 'string'
          ? existingBrokerData.regulation.split(', ').filter(Boolean)
          : existingBrokerData.regulation;
        setSelectedRegulations(regulationsArray);
      }
      
      // Lade bestehende Images für Translations
      if (existingBrokerData.translations) {
        const newSliderPreviews: { [langCode: string]: { url: string, id: string }[] } = {};
        const newFeesImage1Previews: { [langCode: string]: string | null } = {};
        const newFeesImage2Previews: { [langCode: string]: string | null } = {};
        
        Object.entries(existingBrokerData.translations).forEach(([langCode, translation]) => {
          // Slider Images
          if (translation.slider_images && Array.isArray(translation.slider_images)) {
            newSliderPreviews[langCode] = translation.slider_images.map(url => ({
              url,
              id: url // Use URL as ID for existing images
            }));
          }
          
          // Fees Images
          if (translation.fees_commissions_image_1) {
            newFeesImage1Previews[langCode] = translation.fees_commissions_image_1;
          }
          if (translation.fees_commissions_image_2) {
            newFeesImage2Previews[langCode] = translation.fees_commissions_image_2;
          }
        });
        
        setSliderImagePreviews(newSliderPreviews);
        setFeesCommissionsImage1Previews(newFeesImage1Previews);
        setFeesCommissionsImage2Previews(newFeesImage2Previews);
      }
      
    } else if (!brokerId && isOpen) {
      console.log('Creating new broker - resetting form...');
      // Reset für neuen Broker
      setBrokerData({ ...initialBrokerData, broker_type: brokerType });
      setSelectedFeatures([]);
      setSelectedMarkets([]);
      setSelectedTradingPlatforms([]);
      setSelectedDepositMethods([]);
      setSelectedEducationTools([]);
      setSelectedRegulations([]);
      setSliderImagePreviews({});
      setFeesCommissionsImage1Previews({});
      setFeesCommissionsImage2Previews({});
    }
  }, [brokerId, existingBrokerData, isOpen, brokerType]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'rating' || name === 'founded_year' || name === 'min_deposit') {
      const numericValue = value === '' ? '' : Number(value);
      if (name === 'rating' && (Number(numericValue) < 0 || Number(numericValue) > 5)) return;
      setBrokerData(prev => ({ ...prev, [name]: numericValue }));
    } else { setBrokerData(prev => ({ ...prev, [name]: value })); }
  };

  const handleTranslationChange = (langCode: string, field: keyof TranslationData, value: string) => {
    setBrokerData(prev => ({ ...prev, translations: { ...prev.translations, [langCode]: { ...(prev.translations?.[langCode] || {}), [field]: value } } }));
  };

  const handleFeatureChange = (feature: string, event: ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setSelectedFeatures(prev =>
          checked
              ? [...prev, feature]
              : prev.filter(f => f !== feature)
      );
  };

  const handleSliderFileChange = (e: ChangeEvent<HTMLInputElement>, langCode: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: File[] = []; const newPreviews: { file?: File, url: string, id: string }[] = []; let errorFound = false;
      Array.from(files).forEach(file => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError(`Invalid file type (${file.name}) for ${langCode} slider.`); errorFound = true; return; }
        if (file.size > 1 * 1024 * 1024) { setError(`File size exceeds 1MB limit (${file.name}) for ${langCode} slider.`); errorFound = true; return; }
        newFiles.push(file); const previewUrl = URL.createObjectURL(file); newPreviews.push({ file: file, url: previewUrl, id: previewUrl });
      });
      if (!errorFound) {
        setError(null);
        setSliderImagePreviews(prev => ({ ...prev, [langCode]: [...(prev[langCode] || []), ...newPreviews] }));
      }
      if (e.target) e.target.value = "";
    }
  };

  const removeSliderImage = (idToRemove: string, langCode: string) => {
    const previewToRemove = sliderImagePreviews[langCode]?.find(p => p.id === idToRemove);
    setSliderImagePreviews(prev => ({ ...prev, [langCode]: (prev[langCode] || []).filter(p => p.id !== idToRemove) }));
    
    if (!previewToRemove?.file && brokerData.translations[langCode]?.slider_images) {
        setBrokerData(prev => ({
            ...prev,
            translations: {
                ...prev.translations,
                [langCode]: {
                    ...(prev.translations?.[langCode] || {}),
                    slider_images: (prev.translations[langCode]?.slider_images || []).filter(url => url !== idToRemove)
                }
            }
        }));
    }
  };

  const handleImageFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    langCode: string,
    setFilesState: React.Dispatch<React.SetStateAction<{ [key: string]: File | null }>>,
    setPreviewsState: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>,
    imageFieldName: keyof TranslationData
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError(`Invalid file type (${file.name}).`); return; }
      if (file.size > 1 * 1024 * 1024) { setError(`File size exceeds 1MB limit (${file.name}).`); return; }
      setError(null);
      setFilesState(prev => ({ ...prev, [langCode]: file }));
      setPreviewsState(prev => ({ ...prev, [langCode]: URL.createObjectURL(file) }));
      setBrokerData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          [langCode]: { ...(prev.translations?.[langCode] || {}), [imageFieldName]: null }
        }
      }));
    }
    if (e.target) e.target.value = "";
  };

  const removeImage = (
    langCode: string,
    setFilesState: React.Dispatch<React.SetStateAction<{ [key: string]: File | null }>>,
    setPreviewsState: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>,
    imageFieldName: keyof TranslationData,
    inputRef: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>
  ) => {
    setFilesState(prev => ({ ...prev, [langCode]: null }));
    setPreviewsState(prev => ({ ...prev, [langCode]: null }));
    setBrokerData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [langCode]: { ...(prev.translations?.[langCode] || {}), [imageFieldName]: null }
      }
    }));
    if (inputRef.current && inputRef.current[langCode]) {
      inputRef.current[langCode]!.value = "";
    }
  };

  const uploadImage = async (file: File, folder: string, langCode: string, fieldName: string): Promise<string | null> => {
    if (!file) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}-${langCode}-${fieldName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `broker-translations/${fileName}`;
      const { error } = await supabase.storage.from('broker-logos').upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (error) throw new Error(`Upload failed: ${error.message}`);
      const { data: urlData } = supabase.storage.from('broker-logos').getPublicUrl(filePath);
      if (!urlData?.publicUrl) throw new Error("Could not get public URL.");
      console.log(`Uploaded ${fieldName} for ${langCode}: ${urlData.publicUrl}`);
      return urlData.publicUrl;
    } catch (err: any) {
      console.error(`Error uploading ${fieldName} for ${langCode}:`, err?.message || err);
      setError(`${fieldName} upload failed: ${err.message}`);
      return null;
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return brokerData.logo_url || null;
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error } = await supabase.storage.from('broker-logos').upload(filePath, logoFile, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('broker-logos').getPublicUrl(filePath);
      if (!urlData?.publicUrl) throw new Error("Could not get public URL.");
      return urlData.publicUrl;
    } catch (err: any) {
      console.error("Error uploading logo:", err?.message || err);
      setError(`Logo upload failed: ${err.message}`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsSaving(true); 
    setError(null); 
    setSuccess(null);
    
    try {
      const uploadedLogoUrl = await uploadLogo();
      if (logoFile && !uploadedLogoUrl) throw new Error("Logo upload failed.");

      let finalSlug = brokerData.slug.trim();
      if (!finalSlug && brokerData.name.trim()) {
        finalSlug = brokerData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }

      const featuresToSave = selectedFeatures.length > 0 ? selectedFeatures : null;

      const dataToSave = {
        name: brokerData.name.trim(),
        slug: finalSlug,
        company: brokerData.company?.trim() || null,
        logo_url: uploadedLogoUrl,
        rating: Number(brokerData.rating) || 0,
        broker_type: brokerData.broker_type,
        website_url: brokerData.website_url?.trim() || null,
        risk_note: brokerData.risk_note?.trim() || null,
        founded_year: Number(brokerData.founded_year) || null,
        headquarters: brokerData.headquarters?.trim() || null,
        min_deposit: Number(brokerData.min_deposit) || null,
        max_leverage: brokerData.max_leverage?.trim() || null,
        regulation: selectedRegulations.join(', '),
        audit_compliance: brokerData.audit_compliance?.trim() || null,
        spreads_from: brokerData.spreads_from?.trim() || null,
        markets: selectedMarkets.join(', '),
        trading_platforms: selectedTradingPlatforms.join(', '),
        deposit_methods: selectedDepositMethods.join(', '),
        withdrawal_fees: brokerData.withdrawal_fees?.trim() || null,
        customer_support: brokerData.customer_support?.trim() || null,
        user_base: brokerData.user_base?.trim() || null,
        fund_security: brokerData.fund_security?.trim() || null,
        education_tools: selectedEducationTools.join(', '),
        features: featuresToSave,
        bonus: brokerData.bonus?.trim() || null
      };

      let savedBrokerId = brokerId;
      if (brokerId) {
        const { error: updateError } = await supabase.from('brokers').update(dataToSave).eq('id', brokerId);
        if (updateError) throw updateError;
      } else {
        const { data: newData, error: insertError } = await supabase.from('brokers').insert(dataToSave).select('id').single();
        if (insertError) throw insertError;
        if (!newData?.id) throw new Error("Failed to get new broker ID.");
        savedBrokerId = newData.id;
      }
      if (!savedBrokerId) throw new Error("Broker ID missing.");

      const finalSliderUrls: { [langCode: string]: string[] } = {};
      for (const langCode of Object.keys(sliderImagePreviews)) {
        const currentPreviews = sliderImagePreviews[langCode] || [];
        const keptExistingUrls = currentPreviews.filter(p => !p.file).map(p => p.url);
        const newFilesToUpload = currentPreviews.filter(p => p.file);
        const uploadedUrls: string[] = [];
        for (const preview of newFilesToUpload) {
          if (preview.file) {
            const uploadedUrl = await uploadImage(preview.file, `broker-${savedBrokerId}-slider`, langCode, 'slider');
            if (uploadedUrl) uploadedUrls.push(uploadedUrl);
          }
        }
        finalSliderUrls[langCode] = [...keptExistingUrls, ...uploadedUrls];
      }

      const finalFeesImage1Urls: { [langCode: string]: string | null } = {};
      const finalFeesImage2Urls: { [langCode: string]: string | null } = {};

      for (const langCode of supportedLanguages.map(lang => lang.code)) {
        const image1File = feesCommissionsImage1Files[langCode];
        const image2File = feesCommissionsImage2Files[langCode];
        const existingImage1Url = brokerData.translations[langCode]?.fees_commissions_image_1;
        const existingImage2Url = brokerData.translations[langCode]?.fees_commissions_image_2;

        if (image1File) {
          const uploadedUrl = await uploadImage(image1File, `broker-${savedBrokerId}-fees`, langCode, 'fees_commissions_image_1');
          finalFeesImage1Urls[langCode] = uploadedUrl;
        } else {
          const currentTranslation = brokerData.translations[langCode];
          finalFeesImage1Urls[langCode] = (currentTranslation && currentTranslation.fees_commissions_image_1 !== undefined) ? (existingImage1Url as string | null) : null;
        }

        if (image2File) {
          const uploadedUrl = await uploadImage(image2File, `broker-${savedBrokerId}-fees`, langCode, 'fees_commissions_image_2');
          finalFeesImage2Urls[langCode] = uploadedUrl;
        } else {
          const currentTranslation = brokerData.translations[langCode];
          finalFeesImage2Urls[langCode] = (currentTranslation && currentTranslation.fees_commissions_image_2 !== undefined) ? (existingImage2Url as string | null) : null;
        }
      }

      // --- Save Translations ---
      const translationUpserts = Object.entries(brokerData.translations)
        .map(([langCode, translationData]) => ({
          broker_id: savedBrokerId,
          language_code: langCode,
          meta_title: translationData.meta_title || null,
          meta_description: translationData.meta_description || null,
          search_result_text: translationData.search_result_text || null,
          review_summary: translationData.review_summary || null,
          introduction_1: translationData.introduction_1 || null,
          introduction_2: translationData.introduction_2 || null,
          slider_images: finalSliderUrls[langCode] || null, // Save uploaded/kept slider URLs
          regulation_security_title: translationData.regulation_security_title || null,
          regulation_security_text: translationData.regulation_security_text || null,
          regulation_security_text_2: translationData.regulation_security_text_2 || null, // Save HTML
          trading_offerings_title: translationData.trading_offerings_title || null,
          trading_offerings_text_1: translationData.trading_offerings_text_1 || null,
          trading_offerings_text_2: translationData.trading_offerings_text_2 || null,
          tp_ux_title: translationData.tp_ux_title || null,
          tp_ux_text: translationData.tp_ux_text || null,
          demo_title: translationData.demo_title || null,
          demo_text: translationData.demo_text || null,
          fees_commissions_title: translationData.fees_commissions_title || null,
          fees_commissions_text_1: translationData.fees_commissions_text_1 || null,
          fees_commissions_text_2: translationData.fees_commissions_text_2 || null,
          fees_commissions_image_1: finalFeesImage1Urls[langCode] || null, // Save uploaded/kept fees image 1 URL
          fees_commissions_image_2: finalFeesImage2Urls[langCode] || null, // Save uploaded/kept fees image 2 URL
        }))
        .filter(t => // Only upsert if there's actual data for the language
            t.meta_title || t.meta_description || t.search_result_text || t.review_summary ||
            t.introduction_1 || t.introduction_2 || (t.slider_images && t.slider_images.length > 0) ||
            t.regulation_security_title || t.regulation_security_text || t.regulation_security_text_2 ||
            t.trading_offerings_title || t.trading_offerings_text_1 || t.trading_offerings_text_2 ||
            t.tp_ux_title || t.tp_ux_text || t.demo_title || t.demo_text ||
            t.fees_commissions_title || t.fees_commissions_text_1 || t.fees_commissions_text_2 ||
            t.fees_commissions_image_1 || t.fees_commissions_image_2
        );

      if (translationUpserts.length > 0) {
          const { error: translationError } = await supabase.from('broker_translations').upsert(translationUpserts, { onConflict: 'broker_id, language_code' });
          if (translationError) throw translationError;
      } else if (brokerId) {
          // If no translations are being saved but it's an existing broker, delete existing translations
          const { error: deleteError } = await supabase.from('broker_translations').delete().eq('broker_id', brokerId);
          if (deleteError) throw deleteError;
      }

      setSuccess(`Broker ${brokerId ? 'updated' : 'created'} successfully!`);
      onSave(); // Trigger refresh in parent component
      // onClose(); // Close modal after save - maybe keep open for further edits?
    } catch (err: any) { 
      console.error("Error saving broker:", err); 
      setError(`Failed to save broker: ${err.message}`); 
    } // Typisierung auf 'any' belassen
    finally { 
      setIsSaving(false); 
    }
  };

  const handleClose = () => {
    if (!isSaving) { // Prevent closing while saving
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"> {/* Increased max-w and added max-h/overflow */}
        <DialogHeader>
          <DialogTitle>{brokerId ? 'Edit Broker' : 'Add New Broker'}</DialogTitle>
          <DialogDescription>
            {brokerId ? `Editing Broker ID: ${brokerId}` : 'Adding a new broker'}
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
           {/* Basic Information */}
           <fieldset className="border p-4 rounded-md">
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
               {/* Broker Type Select */}
               <div>
                   <Label htmlFor="broker_type">Broker Type*</Label>
                   <select id="broker_type" name="broker_type" value={brokerData.broker_type} onChange={(e) => setBrokerData(prev => ({ ...prev, broker_type: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
                       <option value="cfd">CFD Broker</option>
                       <option value="future">Future Broker</option>
                       <option value="stock">Stock Broker</option>
                       <option value="crypto">Crypto Exchange</option>
                   </select>
               </div>
               <div>
                 <Label htmlFor="website_url">Website URL</Label>
                 <Input id="website_url" name="website_url" type="url" value={brokerData.website_url || ''} onChange={handleInputChange} placeholder="https://broker-website.com" />
               </div>
               <div>
                 <Label htmlFor="risk_note">Risk Note</Label>
                 <Input id="risk_note" name="risk_note" value={brokerData.risk_note || ''} onChange={handleInputChange} placeholder="e.g., 75% of retail accounts lose money..." />
               </div>
             </div>
           </fieldset>

           {/* At a glance */}
            <fieldset className="border p-4 rounded-md">
                <legend className="text-sm font-medium px-1">At a glance</legend>
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
                     {/* Markets Button */}
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
                     {/* Trading Platforms Button */}
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
                     {/* Deposit Methods Button */}
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
                     {/* Education Tools Button */}
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

            {/* Features */}
            <fieldset className="border p-4 rounded-md">
                <legend className="text-sm font-medium px-1">Features</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featureOptions.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`feature-${feature.replace(/\s+/g, '-')}`} // Create a valid ID
                                checked={selectedFeatures.includes(feature)}
                                onChange={(e) => handleFeatureChange(feature, e)}
                            />
                            <label htmlFor={`feature-${feature.replace(/\s+/g, '-')}`} className="text-sm">{feature}</label>
                        </div>
                    ))}
                </div>
            </fieldset>

           {/* Translations */}
           <fieldset className="border p-4 rounded-md">
             <legend className="text-sm font-medium px-1">Translations</legend>
             <Tabs defaultValue={supportedLanguages[0].code}>
               <TabsList className="grid w-full grid-cols-4 md:grid-cols-7">
                 {supportedLanguages.map(lang => (
                   <TabsTrigger key={lang.code} value={lang.code}>{lang.name}</TabsTrigger>
                 ))}
               </TabsList>
               {supportedLanguages.map(lang => (
                 <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-4">
                   <div>
                     <Label htmlFor={`meta_title-${lang.code}`}>Meta Title ({lang.name})</Label>
                     <Input
                       id={`meta_title-${lang.code}`}
                       name="meta_title"
                       value={brokerData.translations[lang.code]?.meta_title || ''}
                       onChange={(e) => handleTranslationChange(lang.code, 'meta_title', e.target.value)}
                       placeholder={`Meta Title (${lang.name})`}
                     />
                   </div>
                   <div>
                     <Label htmlFor={`meta_description-${lang.code}`}>Meta Description ({lang.name})</Label>
                     <Input
                       id={`meta_description-${lang.code}`}
                       name="meta_description"
                       value={brokerData.translations[lang.code]?.meta_description || ''}
                       onChange={(e) => handleTranslationChange(lang.code, 'meta_description', e.target.value)}
                       placeholder={`Meta Description (${lang.name})`}
                     />
                   </div>
                    <div>
                     <Label htmlFor={`search_result_text-${lang.code}`}>Search Result Text ({lang.name})</Label>
                     <TiptapEditor
                        langCode={lang.code}
                        field="search_result_text"
                        value={brokerData.translations[lang.code]?.search_result_text}
                        onChange={handleTranslationChange}
                        placeholder={`Search Result Text (${lang.name})`}
                     />
                   </div>
                    <div>
                     <Label htmlFor={`review_summary-${lang.code}`}>Review Summary ({lang.name})</Label>
                     <TiptapEditor
                        langCode={lang.code}
                        field="review_summary"
                        value={brokerData.translations[lang.code]?.review_summary}
                        onChange={handleTranslationChange}
                        placeholder={`Review Summary (${lang.name})`}
                     />
                   </div>
                    <div>
                     <Label htmlFor={`introduction_1-${lang.code}`}>Introduction Text 1 ({lang.name})</Label>
                      <TiptapEditor
                         langCode={lang.code}
                         field="introduction_1"
                         value={brokerData.translations[lang.code]?.introduction_1}
                         onChange={handleTranslationChange}
                         placeholder={`Introduction Text 1 (${lang.name})`}
                      />
                   </div>
                    <div>
                     <Label htmlFor={`introduction_2-${lang.code}`}>Introduction Text 2 ({lang.name})</Label>
                      <TiptapEditor
                         langCode={lang.code}
                         field="introduction_2"
                         value={brokerData.translations[lang.code]?.introduction_2}
                         onChange={handleTranslationChange}
                         placeholder={`Introduction Text 2 (${lang.name})`}
                      />
                   </div>
                    {/* Slider Images */}
                    <div>
                        <Label>Slider Images ({lang.name})</Label>
                        <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={(e) => handleSliderFileChange(e, lang.code)}
                            ref={el => { if (el) sliderFileInputRef.current[lang.code] = el; }}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => sliderFileInputRef.current[lang.code]?.click()}
                            className="w-full justify-center"
                        >
                            <Upload className="mr-2 h-4 w-4" /> Upload Images
                        </Button>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(sliderImagePreviews[lang.code] || []).map((preview) => (
                                <div key={preview.id} className="relative w-20 h-20 border rounded">
                                    <NextImage
                                        src={preview.url}
                                        alt={`Slider preview ${preview.id}`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-0 right-0 h-5 w-5 rounded-full -mt-1 -mr-1"
                                        onClick={() => removeSliderImage(preview.id, lang.code)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Regulation & Security */}
                    <div>
                        <Label htmlFor={`regulation_security_title-${lang.code}`}>Regulation & Security Title ({lang.name})</Label>
                        <Input
                            id={`regulation_security_title-${lang.code}`}
                            name="regulation_security_title"
                            value={brokerData.translations[lang.code]?.regulation_security_title || ''}
                            onChange={(e) => handleTranslationChange(lang.code, 'regulation_security_title', e.target.value)}
                            placeholder={`Regulation & Security Title (${lang.name})`}
                        />
                    </div>
                     <div>
                        <Label htmlFor={`regulation_security_text-${lang.code}`}>Regulation & Security Text 1 ({lang.name})</Label>
                        <TiptapEditor
                            langCode={lang.code}
                            field="regulation_security_text"
                            value={brokerData.translations[lang.code]?.regulation_security_text}
                            onChange={handleTranslationChange}
                            placeholder={`Regulation & Security Text 1 (${lang.name})`}
                        />
                    </div>
                     <div>
                        <Label htmlFor={`regulation_security_text_2-${lang.code}`}>Regulation & Security Text 2 ({lang.name}) (HTML)</Label>
                         <TiptapEditor
                            langCode={lang.code}
                            field="regulation_security_text_2"
                            value={brokerData.translations[lang.code]?.regulation_security_text_2}
                            onChange={handleTranslationChange}
                            placeholder={`Regulation & Security Text 2 (${lang.name}) (HTML)`}
                         />
                    </div>
                    {/* Trading Offerings */}
                     <div>
                        <Label htmlFor={`trading_offerings_title-${lang.code}`}>Trading Offerings Title ({lang.name})</Label>
                        <Input
                            id={`trading_offerings_title-${lang.code}`}
                            name="trading_offerings_title"
                            value={brokerData.translations[lang.code]?.trading_offerings_title || ''}
                            onChange={(e) => handleTranslationChange(lang.code, 'trading_offerings_title', e.target.value)}
                            placeholder={`Trading Offerings Title (${lang.name})`}
                        />
                    </div>
                     <div>
                        <Label htmlFor={`trading_offerings_text_1-${lang.code}`}>Trading Offerings Text 1 ({lang.name})</Label>
                        <TiptapEditor
                            langCode={lang.code}
                            field="trading_offerings_text_1"
                            value={brokerData.translations[lang.code]?.trading_offerings_text_1}
                            onChange={handleTranslationChange}
                            placeholder={`Trading Offerings Text 1 (${lang.name})`}
                        />
                    </div>
                     <div>
                        <Label htmlFor={`trading_offerings_text_2-${lang.code}`}>Trading Offerings Text 2 ({lang.name})</Label>
                        <TiptapEditor
                            langCode={lang.code}
                            field="trading_offerings_text_2"
                            value={brokerData.translations[lang.code]?.trading_offerings_text_2}
                            onChange={handleTranslationChange}
                            placeholder={`Trading Offerings Text 2 (${lang.name})`}
                        />
                    </div>
                    {/* TP & UX */}
                     <div>
                        <Label htmlFor={`tp_ux_title-${lang.code}`}>TP & UX Title ({lang.name})</Label>
                        <Input
                            id={`tp_ux_title-${lang.code}`}
                            name="tp_ux_title"
                            value={brokerData.translations[lang.code]?.tp_ux_title || ''}
                            onChange={(e) => handleTranslationChange(lang.code, 'tp_ux_title', e.target.value)}
                            placeholder={`TP & UX Title (${lang.name})`}
                        />
                    </div>
                     <div>
                        <Label htmlFor={`tp_ux_text-${lang.code}`}>TP & UX Text ({lang.name})</Label>
                        <TiptapEditor
                            langCode={lang.code}
                            field="tp_ux_text"
                            value={brokerData.translations[lang.code]?.tp_ux_text}
                            onChange={handleTranslationChange}
                            placeholder={`TP & UX Text (${lang.name})`}
                        />
                    </div>
                    {/* Demo Account */}
                     <div>
                        <Label htmlFor={`demo_title-${lang.code}`}>Demo Account Title ({lang.name})</Label>
                        <Input
                            id={`demo_title-${lang.code}`}
                            name="demo_title"
                            value={brokerData.translations[lang.code]?.demo_title || ''}
                            onChange={(e) => handleTranslationChange(lang.code, 'demo_title', e.target.value)}
                            placeholder={`Demo Account Title (${lang.name})`}
                        />
                    </div>
                     <div>
                        <Label htmlFor={`demo_text-${lang.code}`}>Demo Account Text ({lang.name})</Label>
                        <TiptapEditor
                            langCode={lang.code}
                            field="demo_text"
                            value={brokerData.translations[lang.code]?.demo_text}
                            onChange={handleTranslationChange}
                            placeholder={`Demo Account Text (${lang.name})`}
                        />
                    </div>
                    {/* Fees & Commissions */}
                     <div>
                        <Label htmlFor={`fees_commissions_title-${lang.code}`}>Fees & Commissions Title ({lang.name})</Label>
                        <Input
                            id={`fees_commissions_title-${lang.code}`}
                            name="fees_commissions_title"
                            value={brokerData.translations[lang.code]?.fees_commissions_title || ''}
                            onChange={(e) => handleTranslationChange(lang.code, 'fees_commissions_title', e.target.value)}
                            placeholder={`Fees & Commissions Title (${lang.name})`}
                        />
                    </div>
                     <div>
                        <Label htmlFor={`fees_commissions_text_1-${lang.code}`}>Fees & Commissions Text 1 ({lang.name})</Label>
                        <TiptapEditor
                            langCode={lang.code}
                            field="fees_commissions_text_1"
                            value={brokerData.translations[lang.code]?.fees_commissions_text_1}
                            onChange={handleTranslationChange}
                            placeholder={`Fees & Commissions Text 1 (${lang.name})`}
                        />
                    </div>
                     <div>
                        <Label htmlFor={`fees_commissions_text_2-${lang.code}`}>Fees & Commissions Text 2 ({lang.name})</Label>
                        <TiptapEditor
                            langCode={lang.code}
                            field="fees_commissions_text_2"
                            value={brokerData.translations[lang.code]?.fees_commissions_text_2}
                            onChange={handleTranslationChange}
                            placeholder={`Fees & Commissions Text 2 (${lang.name})`}
                        />
                    </div>
                    {/* Fees & Commissions Image 1 */}
                    <div>
                        <Label>Fees & Commissions Image 1 ({lang.name})</Label>
                        <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleImageFileChange(e, lang.code, setFeesCommissionsImage1Files, setFeesCommissionsImage1Previews, 'fees_commissions_image_1')}
                            ref={el => { if (el) feesImage1InputRef.current[lang.code] = el; }}
                            className="hidden"
                        />
                        {feesCommissionsImage1Previews[lang.code] ? (
                            <div className="flex items-center space-x-2 mt-2">
                                <NextImage
                                    src={feesCommissionsImage1Previews[lang.code]!}
                                    alt={`Fees Image 1 preview ${lang.code}`}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                    className="rounded"
                                />
                                <Button type="button" variant="outline" size="sm" onClick={() => removeImage(lang.code, setFeesCommissionsImage1Files, setFeesCommissionsImage1Previews, 'fees_commissions_image_1', feesImage1InputRef)}>
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => feesImage1InputRef.current[lang.code]?.click()}
                                className="w-full justify-center"
                            >
                                <Upload className="mr-2 h-4 w-4" /> Upload Image 1
                            </Button>
                        )}
                    </div>
                    {/* Fees & Commissions Image 2 */}
                    <div>
                        <Label>Fees & Commissions Image 2 ({lang.name})</Label>
                        <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleImageFileChange(e, lang.code, setFeesCommissionsImage2Files, setFeesCommissionsImage2Previews, 'fees_commissions_image_2')}
                            ref={el => { if (el) feesImage2InputRef.current[lang.code] = el; }}
                            className="hidden"
                        />
                        {feesCommissionsImage2Previews[lang.code] ? (
                            <div className="flex items-center space-x-2 mt-2">
                                <NextImage
                                    src={feesCommissionsImage2Previews[lang.code]!}
                                    alt={`Fees Image 2 preview ${lang.code}`}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                    className="rounded"
                                />
                                <Button type="button" variant="outline" size="sm" onClick={() => removeImage(lang.code, setFeesCommissionsImage2Files, setFeesCommissionsImage2Previews, 'fees_commissions_image_2', feesImage2InputRef)}>
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => feesImage2InputRef.current[lang.code]?.click()}
                                className="w-full justify-center"
                            >
                                <Upload className="mr-2 h-4 w-4" /> Upload Image 2
                            </Button>
                        )}
                    </div>
                 </TabsContent>
               ))}
             </Tabs>
           </fieldset>

          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : (brokerId ? 'Save Changes' : 'Add Broker')}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
       {/* Modals */}
       <MarketsModal
        isOpen={isMarketsModalOpen}
        setIsOpen={setIsMarketsModalOpen}
        selectedMarkets={selectedMarkets}
        setSelectedMarkets={setSelectedMarkets}
        setBrokerData={setBrokerData}
      />
       <DepositMethodsModal
        isOpen={isDepositMethodsModalOpen}
        setIsOpen={setIsDepositMethodsModalOpen}
        selectedMethods={selectedDepositMethods}
        setSelectedMethods={setSelectedDepositMethods}
        setBrokerData={setBrokerData}
      />
       <TradingPlatformsModal
        isOpen={isTradingPlatformsModalOpen}
        setIsOpen={setIsTradingPlatformsModalOpen}
        selectedPlatforms={selectedTradingPlatforms}
        setSelectedPlatforms={setSelectedTradingPlatforms}
        setBrokerData={setBrokerData}
      />
       <EducationToolsModal
        isOpen={isEducationToolsModalOpen}
        setIsOpen={setIsEducationToolsModalOpen}
        selectedTools={selectedEducationTools}
        setSelectedTools={setSelectedEducationTools}
        setBrokerData={setBrokerData}
      />
       {/* Regulation Modal - Assuming it exists and is needed based on the button */}
       {/* <RegulationModal
           isOpen={isRegulationModalOpen}
           setIsOpen={setIsRegulationModalOpen}
           selectedRegulations={selectedRegulations}
           setSelectedRegulations={setSelectedRegulations}
           setBrokerData={setBrokerData}
       /> */}
    </Dialog>
  );
}
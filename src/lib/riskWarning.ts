// lib/riskWarning.ts - Clean version without JSX
import { supabase } from '@/lib/supabase';

interface RiskWarningCache {
  [key: string]: string;
}

// Cache für bessere Performance
let riskWarningCache: RiskWarningCache = {};
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 Minuten

/**
 * Holt Risk Warning Template aus der Datenbank und ersetzt die Prozentzahl
 * @param riskPercentage - Die Prozentzahl (z.B. "65" oder 65)
 * @param brokerType - Der Broker-Typ (z.B. "cfd", "forex", "crypto")
 * @param langCode - Sprachcode (z.B. "en", "de", "es")
 * @returns Vollständiger Risk Warning Text
 */

export async function getRiskWarning(
  riskPercentage: string | number | null | undefined, 
  brokerType: string = 'cfd', 
  langCode: string = 'en'
): Promise<string> {
  // Fallback wenn keine Prozentzahl vorhanden
  if (!riskPercentage) {
    return 'Trading involves risk. Your capital may be at risk.';
  }

  const cacheKey = `${langCode}-${brokerType}`;
  const now = Date.now();

  // Prüfe Cache
   if (cacheExpiry > now && riskWarningCache[cacheKey]) {
    let template = riskWarningCache[cacheKey];

    // Falls das Template noch keine Platzhalter enthält (aus einem alten Cache)
    if (!template.includes('{percentage}')) {
      template = template.replace(/\d+%/, '{percentage}%');
      riskWarningCache[cacheKey] = template; // Cache aktualisieren
    }

    return template.replace('{percentage}', String(riskPercentage));
  }

  try {
    // Hole Template aus der Datenbank
    const { data, error } = await supabase
      .from('risk_warning_translations')
      .select('risk_warning_template')
      .eq('language_code', langCode)
      .eq('broker_type', brokerType)
      .single();

    if (error) {
      console.error('Error fetching risk warning template:', error);
      
      // Fallback: Versuche mit 'en' wenn andere Sprache nicht gefunden
      if (langCode !== 'en') {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('risk_warning_translations')
          .select('risk_warning_template')
          .eq('language_code', 'en')
          .eq('broker_type', brokerType)
          .single();

        if (!fallbackError && fallbackData) {
          const template = fallbackData.risk_warning_template;
          riskWarningCache[cacheKey] = template;
          cacheExpiry = now + CACHE_DURATION;
          return template.replace('{percentage}', String(riskPercentage));
        }
      }

      // Letzter Fallback: Hardcoded Text
      return `CFD trading involves high risk. ${riskPercentage}% of retail accounts lose money when trading CFDs with this provider.`;
    }

   if (data && data.risk_warning_template) {
      let template = data.risk_warning_template;

      // Falls das Template keine Platzhalter enthält, ersetze vorhandene Prozentzahl
      if (!template.includes('{percentage}')) {
        template = template.replace(/\d+%/, '{percentage}%');
      }

      // Cache aktualisieren
      riskWarningCache[cacheKey] = template;
      cacheExpiry = now + CACHE_DURATION;

      // Prozentzahl einsetzen
      return template.replace('{percentage}', String(riskPercentage));
    }

    // Fallback
    return `CFD trading involves high risk. ${riskPercentage}% of retail accounts lose money when trading CFDs with this provider.`;

  } catch (err) {
    console.error('Unexpected error in getRiskWarning:', err);
    return `CFD trading involves high . ${riskPercentage}% of retail accounts lose money when trading CFDs with this provider.`;
  }
}

/**
 * Synchrone Version mit Fallback für Client-Komponenten
 * Nutzt nur Fallback-Texte (DB-Abfrage deaktiviert)
 */
export function getRiskWarningSync(
  riskPercentage: string | number | null | undefined, 
  brokerType: string = 'cfd', 
  langCode: string = 'en'
): string {
  // Debug-Logging hinzufügen
  console.log('ORIGINAL INPUT:', riskPercentage);
  
  // Sicherheitsmaßnahme: Falls riskPercentage bereits den vollständigen Text enthält,
  // versuche die Zahl zu extrahieren
  if (typeof riskPercentage === 'string') {
    // Prüfen, ob es bereits ein vollständiger Text ist
    if (riskPercentage.includes('trading involves high risk') || riskPercentage.includes('lose money')) {
      const match = riskPercentage.match(/(\d+)%/);
      if (match) {
        console.log('EXTRACTED NUMBER FROM TEXT:', match[1]);
        riskPercentage = match[1];
      }
    }
  }
  
  // Rest der Funktion bleibt gleich
  if (!riskPercentage) {
    return 'Trading involves risk. Your capital may be at risk.';
  }

  // Debug log
  console.log('USING VALUE:', { riskPercentage, brokerType, langCode });

  // Verwende nur Fallback-Texte bis die DB-Tabelle erstellt ist
  const fallbackTexts: { [key: string]: { [key: string]: string } } = {
    en: {
      cfd: `CFD trading involves high risk. {percentage}% of retail accounts lose money when trading CFDs with this provider.`,
      forex: `Forex trading involves high risk. {percentage}% of retail accounts lose money when trading Forex with this provider.`,
      crypto: `Cryptocurrency trading involves high risk. {percentage}% of retail accounts lose money when trading cryptocurrencies with this provider.`
    },
    de: {
      cfd: `CFD-Handel birgt hohe Risiken. {percentage}% der Privatanlegerkonten verlieren Geld beim CFD-Handel mit diesem Anbieter.`,
      forex: `Forex-Handel birgt hohe Risiken. {percentage}% der Privatanlegerkonten verlieren Geld beim Forex-Handel mit diesem Anbieter.`,
      crypto: `Kryptowährungshandel birgt hohe Risiken. {percentage}% der Privatanlegerkonten verlieren Geld beim Handel mit Kryptowährungen bei diesem Anbieter.`
    }
  };

  const langTexts = fallbackTexts[langCode] || fallbackTexts.en;
  const template = langTexts[brokerType] || langTexts.cfd;
  
  const result = template.replace('{percentage}', String(riskPercentage));
  console.log('FINAL RESULT:', result);
  
  return result;
}

/**
 * Cache leeren (für Admin-Updates)
 */
export function clearRiskWarningCache(): void {
  riskWarningCache = {};
  cacheExpiry = 0;
  console.log('Risk warning cache cleared');
}

/**
 * Cache für Development leeren (temporäre Funktion)
 */
export function clearCacheForDevelopment(): void {
  if (typeof window !== 'undefined') {
    // Client-side cache clearing
    clearRiskWarningCache();
  }
}
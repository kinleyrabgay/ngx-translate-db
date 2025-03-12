/**
 * Supported language codes in the translation system.
 * This type is used internally and will be constrained by acceptedLanguages at runtime.
 */
export type TranslationLanguage = string;

/**
 * Represents a translation value for a specific key across multiple languages.
 * The key is the language code and the value is the translated string.
 * 
 * @example
 * ```typescript
 * const value: TranslationValue = {
 *   en: "Hello",
 *   fr: "Bonjour",
 *   it: "Ciao"
 * };
 * ```
 */
export interface TranslationValue {
  [key: string]: string;
}

/**
 * Represents a collection of translations grouped by language.
 * The outer key is the language code and the inner key is the translation key.
 * 
 * @example
 * ```typescript
 * const translations: Translations = {
 *   LABEL_GREETING: {
 *     en: "Greeting",
 *     fr: "Salut",
 *     it: "Saluto"
 *   },
 *   LABEL_FAREWELL: {
 *     en: "Farewell",
 *     fr: "Au revoir",
 *     it: "Addio"
 *   }
 * };
 * ```
 */
export interface Translations {
  [lang: string]: {
    [key: string]: string;
  };
}

/**
 * Configuration options for the translation service.
 * 
 * @property projectId - Unique identifier for the project
 * @property endpoint - API endpoint for fetching translations
 * @property defaultLang - Default language to use when translations are missing
 * @property acceptedLanguages - Array of language codes that are supported
 * @property apiKey - Optional API key for authentication
 * @property dbName - Optional name for the IndexedDB database
 * @property moduleName - Optional feature identifier for translations
 * 
 * @example
 * ```typescript
 * const config: TranslationConfig = {
 *   projectId: "my-app",
 *   endpoint: "https://api.translations.com/v1",
 *   defaultLang: "en",
 *   acceptedLanguages: ["en", "fr", "de"],
 *   apiKey: "optional-api-key"
 * };
 * ```
 */
export interface TranslationConfig {
  /** Unique identifier for the project */
  projectId: string;
  
  /** API endpoint for fetching translations */
  endpoint: string;
  
  /** Default language to use when translations are missing */
  defaultLang: TranslationLanguage;
  
  /** List of supported language codes */
  acceptedLanguages: readonly TranslationLanguage[];
  
  /** Optional API key for authentication */
  apiKey?: string;
  
  /** Optional name for the IndexedDB database */
  dbName?: string;
  
  /** Optional feature identifier for translations */
  moduleName?: string;
}

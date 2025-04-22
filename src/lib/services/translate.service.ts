import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TranslationConfig, TranslationValue, TranslationLanguage } from "../interfaces/translation.interface";
import { TranslationDBService } from "./translate-db.service";

/**
 * Core service for handling translations in the application.
 * Provides methods for translation management, language switching, and caching.
 * 
 * @remarks
 * This service implements an offline-first approach using IndexedDB for storage.
 * It handles both synchronous and asynchronous translation operations.
 * 
 * @example
 * ```typescript
 * constructor(private translateService: TranslateService) {
 *   translateService.init({
 *     projectId: 'my-project',
 *     endpoint: 'https://api.example.com/translations',
 *     defaultLang: 'en',
 *     acceptedLanguages: ['en', 'fr', 'de']
 *   }).then(() => {
 *     translateService.setLanguage('fr');
 *   });
 * 
 *   // Subscribe to language changes
 *   translateService.onLangChange.subscribe(lang => {
 *     console.log('Language changed to:', lang);
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: "root",
})
export class TranslateService {
  /** Current active language */
  private currentLang: TranslationLanguage = "en";
  
  /** List of supported languages */
  private acceptedLanguages: TranslationLanguage[] = [];
  
  /** In-memory cache of translations */
  private translations = new Map<string, TranslationValue>();
  
  /** Service loading state */
  private readonly loadingState = new BehaviorSubject<boolean>(true);
  
  /** Language change subject */
  private readonly langChangeSubject = new BehaviorSubject<TranslationLanguage>("en");
  
  /** Initialization promise */
  private initPromise: Promise<void> | null = null;

  constructor(private readonly dbService: TranslationDBService) {}

  /**
   * Observable that emits when the language changes.
   * Subscribe to this to react to language changes.
   */
  get onLangChange(): Observable<TranslationLanguage> {
    return this.langChangeSubject.asObservable();
  }

  /**
   * Initializes the translation service with the provided configuration.
   * Sets up IndexedDB storage and loads initial translations.
   * 
   * @param config - Translation service configuration
   * @throws {Error} If initialization fails or configuration is invalid
   * @returns Promise that resolves when initialization is complete
   */
  async init(config: TranslationConfig): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.validateConfig(config);
    
    this.initPromise = (async () => {
      try {
        this.acceptedLanguages = [...config.acceptedLanguages];
        await this.setLanguage(config.defaultLang);
        await this.dbService.init(config);
        await this.loadTranslations(config);
        this.loadingState.next(false);
      } catch (error) {
        console.error("Error initializing translation service:", error);
        this.loadingState.next(false);
        throw new Error("Translation initialization failed");
      }
    })();

    return this.initPromise;
  }

  /**
   * Gets the loading state as an observable.
   * @returns Observable<boolean> indicating if the service is loading
   */
  get isLoading(): Observable<boolean> {
    return this.loadingState.asObservable();
  }

  /**
   * Gets the current active language.
   * @returns The current language code
   */
  get currentLanguage(): TranslationLanguage {
    return this.currentLang;
  }

  /**
   * Gets the list of supported languages.
   * @returns Array of accepted language codes
   */
  get supportedLanguages(): TranslationLanguage[] {
    return [...this.acceptedLanguages];
  }

  /**
   * Asynchronously retrieves a translation for the given key.
   * Waits for service initialization before returning the translation.
   * 
   * @param key - Translation key to look up
   * @returns Promise resolving to the translated string
   * @throws {Error} If service is not initialized
   */
  async translate(key: string): Promise<string> {
    await this.waitForInitialization();
    return this.getTranslation(key);
  }

  /**
   * Synchronously retrieves a translation for the given key.
   * Falls back to key if translation is not found.
   * 
   * @param key - Translation key to look up
   * @returns Translated string or key if not found
   * @throws {Error} If service is not initialized
   */
  instant(key: string, params?: Record<string, string>): string {
    if (!this.initPromise) {
      console.warn('Translation service not initialized. Please provide configuration in your app.config.ts');
      return key;
    }
    
    const translation = this.loadingState.value 
      ? this.getTranslationFallback(key)
      : this.getTranslation(key);
  
    return this.replaceParams(translation, params);
  }
  
  /**
   * Changes the current active language.
   * Emits the new language to subscribers.
   * 
   * @param lang - Language code to switch to
   * @throws {Error} If service is not initialized or language is not supported
   * @returns Promise that resolves when the language is set
   */
  async setLanguage(lang: TranslationLanguage): Promise<void> {
    // During initialization, we don't need to wait
    if (this.initPromise && !this.loadingState.value) {
      await this.waitForInitialization();
    }
    
    if (!this.isLanguageSupported(lang)) {
      console.warn(`Warning: Language '${lang}' is not supported. Falling back to default '${this.acceptedLanguages[0]}'`);
      lang = this.acceptedLanguages[0];
    }
    
    this.currentLang = lang;
    this.langChangeSubject.next(lang);
  }

  /**
   * Checks if a language is supported.
   * During initialization, all languages are considered supported.
   * 
   * @param lang - Language code to check
   * @returns True if the language is supported, false otherwise
   */
  isLanguageSupported(lang: TranslationLanguage): boolean {
    // During initialization, consider all languages supported
    if (this.loadingState.value) {
      return true;
    }
    return this.acceptedLanguages.includes(lang);
  }

  /**
   * Clears the module-specific translation cache.
   * Reloads translations after clearing.
   */
  async clearModuleCache(): Promise<void> {
    await this.dbService.clearCache();
    this.translations.clear();
    await this.waitForInitialization();
  }

  /**
   * Clears all translation caches.
   * Reloads translations after clearing.
   */
  async clearAllCache(): Promise<void> {
    await this.dbService.clearDB();
    this.translations.clear();
    await this.waitForInitialization();
  }

  /**
   * Validates the translation configuration.
   * 
   * @param config - Configuration to validate
   * @throws {Error} If configuration is invalid
   * @private
   */
  private validateConfig(config: TranslationConfig): void {
    if (!config.acceptedLanguages?.length) {
      console.warn('acceptedLanguages must be provided and contain at least one language code');
    }
    
    if (!config.acceptedLanguages.includes(config.defaultLang)) {
      console.warn(`defaultLang '${config.defaultLang}' must be included in acceptedLanguages`);
    }
  }

  /**
   * Ensures the service is initialized before proceeding.
   * @throws {Error} If service is not initialized
   */
  private async waitForInitialization(): Promise<void> {
    if (!this.initPromise) {
      console.warn("Warning: Translation service not initialized. Using default fallback.");
      return;
    }
    await this.initPromise;
  }

  /**
   * Retrieves a translation for the given key.
   * Falls back to fallback language if translation is not found.
   * 
   * @param key - Translation key to look up
   * @returns Translated string or fallback
   */
  private getTranslation(key: string): string {
    const translation = this.translations.get(key);
    if (!translation) {
      return this.getTranslationFallback(key);
    }

    const value = translation[this.currentLang];
    return value ?? this.getTranslationFallback(key);
  }

  /**
   * Gets a fallback translation when the primary translation is not found.
   * Returns the first available translation or the key itself.
   * 
   * @param key - Translation key to look up
   * @returns Fallback translation or key
   */
  private getTranslationFallback(key: string): string {
    const translation = this.translations.get(key);
    if (translation) {
      // First try the default language from config
      const defaultValue = translation[this.acceptedLanguages[0]];
      if (defaultValue) return defaultValue;

      // Then try any available language
      const languages = Object.keys(translation);
      if (languages.length > 0) {
        return translation[languages[0]];
      }
    }
    return key;
  }

  /**
   * Loads translations from the API or cache.
   * Stores translations in both memory and IndexedDB.
   * 
   * @param config - Translation configuration
   * @throws {Error} If translations cannot be loaded
   */
  private async loadTranslations(config: TranslationConfig): Promise<void> {
    try {
      const response = await fetch(`${config.endpoint}?projectId=${config.projectId}&apiKey=${config.apiKey}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      });
  
      if (!response.ok) {
        console.warn(`Warning: Failed to fetch translations from API: ${response.statusText}`);
        return await this.loadFromCache();
      }
  
      const data: { [key: string]: TranslationValue } = await response.json();
      
      await Promise.all(
        Object.entries(data).map(async ([key, value]) => {
          await this.dbService.saveToCache(key, value);
          this.translations.set(key, value);
        })
      );
    } catch (error) {
      console.warn("Warning: Error loading translations from API:", error);
      await this.loadFromCache();
    }
  }
  
  /**
   * Loads translations from the cache as a fallback.
   */
  private async loadFromCache(): Promise<void> {
    const cachedTranslations = await this.dbService.getAllFromCache();
    
    if (Object.keys(cachedTranslations).length > 0) {
      Object.entries(cachedTranslations).forEach(([key, value]) => {
        this.translations.set(key, value);
      });
      console.info("Loaded translations from cache.");
    } else {
      console.warn("No cached translations found. Defaulting to keys.");
    }
  }  

  // Add a new method to replace parameters in the translation string
  private replaceParams(translation: string, params?: Record<string, string>): string {
    if (!params) return translation;

    return Object.keys(params).reduce((str, param) => {
      const regex = new RegExp(`{${param}}`, 'g');
      return str.replace(regex, params[param]);
    }, translation);
  }
}

import { Observable } from "rxjs";
import { TranslationConfig, TranslationLanguage } from "../interfaces/translation.interface";
import { TranslationDBService } from "./translate-db.service";
import * as i0 from "@angular/core";
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
export declare class TranslateService {
    private readonly dbService;
    /** Current active language */
    private currentLang;
    /** List of supported languages */
    private acceptedLanguages;
    /** In-memory cache of translations */
    private translations;
    /** Service loading state */
    private readonly loadingState;
    /** Language change subject */
    private readonly langChangeSubject;
    /** Initialization promise */
    private initPromise;
    constructor(dbService: TranslationDBService);
    /**
     * Observable that emits when the language changes.
     * Subscribe to this to react to language changes.
     */
    get onLangChange(): Observable<TranslationLanguage>;
    /**
     * Initializes the translation service with the provided configuration.
     * Sets up IndexedDB storage and loads initial translations.
     *
     * @param config - Translation service configuration
     * @throws {Error} If initialization fails or configuration is invalid
     * @returns Promise that resolves when initialization is complete
     */
    init(config: TranslationConfig): Promise<void>;
    /**
     * Gets the loading state as an observable.
     * @returns Observable<boolean> indicating if the service is loading
     */
    get isLoading(): Observable<boolean>;
    /**
     * Gets the current active language.
     * @returns The current language code
     */
    get currentLanguage(): TranslationLanguage;
    /**
     * Gets the list of supported languages.
     * @returns Array of accepted language codes
     */
    get supportedLanguages(): TranslationLanguage[];
    /**
     * Asynchronously retrieves a translation for the given key.
     * Waits for service initialization before returning the translation.
     *
     * @param key - Translation key to look up
     * @returns Promise resolving to the translated string
     * @throws {Error} If service is not initialized
     */
    translate(key: string): Promise<string>;
    /**
     * Synchronously retrieves a translation for the given key.
     * Falls back to key if translation is not found.
     *
     * @param key - Translation key to look up
     * @returns Translated string or key if not found
     * @throws {Error} If service is not initialized
     */
    instant(key: string): string;
    /**
     * Changes the current active language.
     * Emits the new language to subscribers.
     *
     * @param lang - Language code to switch to
     * @throws {Error} If service is not initialized or language is not supported
     * @returns Promise that resolves when the language is set
     */
    setLanguage(lang: TranslationLanguage): Promise<void>;
    /**
     * Checks if a language is supported.
     * During initialization, all languages are considered supported.
     *
     * @param lang - Language code to check
     * @returns True if the language is supported, false otherwise
     */
    isLanguageSupported(lang: TranslationLanguage): boolean;
    /**
     * Clears the module-specific translation cache.
     * Reloads translations after clearing.
     */
    clearModuleCache(): Promise<void>;
    /**
     * Clears all translation caches.
     * Reloads translations after clearing.
     */
    clearAllCache(): Promise<void>;
    /**
     * Validates the translation configuration.
     *
     * @param config - Configuration to validate
     * @throws {Error} If configuration is invalid
     * @private
     */
    private validateConfig;
    /**
     * Ensures the service is initialized before proceeding.
     * @throws {Error} If service is not initialized
     */
    private waitForInitialization;
    /**
     * Retrieves a translation for the given key.
     * Falls back to fallback language if translation is not found.
     *
     * @param key - Translation key to look up
     * @returns Translated string or fallback
     */
    private getTranslation;
    /**
     * Gets a fallback translation when the primary translation is not found.
     * Returns the first available translation or the key itself.
     *
     * @param key - Translation key to look up
     * @returns Fallback translation or key
     */
    private getTranslationFallback;
    /**
     * Loads translations from the API or cache.
     * Stores translations in both memory and IndexedDB.
     *
     * @param config - Translation configuration
     * @throws {Error} If translations cannot be loaded
     */
    private loadTranslations;
    /**
     * Loads translations from the cache as a fallback.
     */
    private loadFromCache;
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TranslateService>;
}

import * as i0 from '@angular/core';
import { Injectable, Pipe, APP_INITIALIZER } from '@angular/core';
import { BehaviorSubject, startWith } from 'rxjs';
import { openDB, deleteDB } from 'idb';
import { map } from 'rxjs/operators';

/**
 * Service responsible for managing translation data in IndexedDB.
 * Provides methods for caching and retrieving translations.
 *
 * @remarks
 * This service uses the 'idb' library for IndexedDB operations.
 * All operations are asynchronous and return Promises.
 */
class TranslationDBService {
    /** IndexedDB database instance */
    db;
    /** Default store name for translations */
    STORE_NAME = 'translations';
    /** Default database name */
    DEFAULT_DB_NAME = 'translations-db';
    /** Default database version */
    DB_VERSION = 1;
    /**
     * Initializes the IndexedDB database for translations.
     * Creates the necessary object store if it doesn't exist.
     *
     * @param config - Optional configuration for database setup
     * @throws {Error} If database initialization fails
     */
    async init(config) {
        try {
            const dbName = config?.dbName ?? this.DEFAULT_DB_NAME;
            this.db = await openDB(dbName, this.DB_VERSION, {
                upgrade: (db) => this.createObjectStore(db),
                blocked: () => {
                    console.warn('Database upgrade blocked. Please close other tabs using this app.');
                },
                blocking: () => {
                    this.db.close();
                    console.warn('Database version change detected. Please reload the page.');
                },
            });
        }
        catch (error) {
            console.error('Error initializing translation database:', error);
        }
    }
    /**
     * Saves a translation value to the cache.
     *
     * @param key - Translation key
     * @param value - Translation value object
     * @throws {Error} If the database is not initialized or save fails
     */
    async saveToCache(key, value) {
        this.ensureDBInitialized();
        try {
            await this.db.put(this.STORE_NAME, value, key);
        }
        catch (error) {
            console.error('Error saving translation to cache:', error);
        }
    }
    /**
     * Retrieves a translation value from the cache.
     *
     * @param key - Translation key to retrieve
     * @returns Promise resolving to the translation value or null if not found
     * @throws {Error} If the database is not initialized
     */
    async getFromCache(key) {
        this.ensureDBInitialized();
        try {
            return await this.db.get(this.STORE_NAME, key);
        }
        catch (error) {
            console.error('Error retrieving translation from cache:', error);
            return null;
        }
    }
    /**
     * Retrieves all translations from the cache.
     *
     * @returns Promise resolving to an object containing all translations
     * @throws {Error} If the database is not initialized
     */
    async getAllFromCache() {
        this.ensureDBInitialized();
        try {
            const allEntries = await this.db.getAll(this.STORE_NAME);
            const allKeys = await this.db.getAllKeys(this.STORE_NAME);
            return allEntries.reduce((acc, value, index) => {
                const key = allKeys[index]?.toString();
                if (key) {
                    acc[key] = value;
                }
                return acc;
            }, {});
        }
        catch (error) {
            console.error('Error retrieving all translations from cache:', error);
            return {};
        }
    }
    /**
     * Clears all translations from the cache.
     *
     * @throws {Error} If the database is not initialized or clear fails
     */
    async clearCache() {
        this.ensureDBInitialized();
        try {
            await this.db.clear(this.STORE_NAME);
        }
        catch (error) {
            console.error('Error clearing translation cache:', error);
        }
    }
    /**
     * Deletes the entire database.
     * Closes the current connection before deletion.
     *
     * @throws {Error} If database deletion fails
     */
    async clearDB() {
        try {
            if (this.db) {
                const dbName = this.db.name;
                await this.db.close();
                await deleteDB(dbName);
                this.db = null;
            }
        }
        catch (error) {
            console.error('Error deleting translation database:', error);
        }
    }
    /**
     * Creates the translations object store in the database.
     *
     * @param db - IndexedDB database instance
     * @private
     */
    createObjectStore(db) {
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            db.createObjectStore(this.STORE_NAME);
        }
    }
    /**
     * Ensures the database is initialized before operations.
     *
     * @throws {Error} If the database is not initialized
     * @private
     */
    ensureDBInitialized() {
        if (!this.db) {
            console.warn('Translation database not initialized. Call init() first.');
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslationDBService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslationDBService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslationDBService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

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
class TranslateService {
    dbService;
    /** Current active language */
    currentLang = "en";
    /** List of supported languages */
    acceptedLanguages = [];
    /** In-memory cache of translations */
    translations = new Map();
    /** Service loading state */
    loadingState = new BehaviorSubject(true);
    /** Language change subject */
    langChangeSubject = new BehaviorSubject("en");
    /** Initialization promise */
    initPromise = null;
    constructor(dbService) {
        this.dbService = dbService;
    }
    /**
     * Observable that emits when the language changes.
     * Subscribe to this to react to language changes.
     */
    get onLangChange() {
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
    async init(config) {
        if (this.initPromise)
            return this.initPromise;
        this.validateConfig(config);
        this.initPromise = (async () => {
            try {
                this.acceptedLanguages = [...config.acceptedLanguages];
                await this.setLanguage(config.defaultLang);
                await this.dbService.init(config);
                await this.loadTranslations(config);
                this.loadingState.next(false);
            }
            catch (error) {
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
    get isLoading() {
        return this.loadingState.asObservable();
    }
    /**
     * Gets the current active language.
     * @returns The current language code
     */
    get currentLanguage() {
        return this.currentLang;
    }
    /**
     * Gets the list of supported languages.
     * @returns Array of accepted language codes
     */
    get supportedLanguages() {
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
    async translate(key) {
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
    instant(key) {
        if (!this.initPromise) {
            console.warn('Translation service not initialized. Please provide configuration in your app.config.ts');
            return key;
        }
        return this.loadingState.value
            ? this.getTranslationFallback(key)
            : this.getTranslation(key);
    }
    /**
     * Changes the current active language.
     * Emits the new language to subscribers.
     *
     * @param lang - Language code to switch to
     * @throws {Error} If service is not initialized or language is not supported
     * @returns Promise that resolves when the language is set
     */
    async setLanguage(lang) {
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
    isLanguageSupported(lang) {
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
    async clearModuleCache() {
        await this.dbService.clearCache();
        this.translations.clear();
        await this.waitForInitialization();
    }
    /**
     * Clears all translation caches.
     * Reloads translations after clearing.
     */
    async clearAllCache() {
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
    validateConfig(config) {
        if (!config.acceptedLanguages?.length) {
            console.warn('acceptedLanguages must be provided and contain at least one language code');
            throw new Error('acceptedLanguages must be provided and contain at least one language code');
        }
        if (!config.acceptedLanguages.includes(config.defaultLang)) {
            console.warn(`defaultLang '${config.defaultLang}' must be included in acceptedLanguages`);
            throw new Error(`defaultLang '${config.defaultLang}' must be included in acceptedLanguages`);
        }
    }
    /**
     * Ensures the service is initialized before proceeding.
     * @throws {Error} If service is not initialized
     */
    async waitForInitialization() {
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
    getTranslation(key) {
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
    getTranslationFallback(key) {
        const translation = this.translations.get(key);
        if (translation) {
            // First try the default language from config
            const defaultValue = translation[this.acceptedLanguages[0]];
            if (defaultValue)
                return defaultValue;
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
    async loadTranslations(config) {
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
            const data = await response.json();
            await Promise.all(Object.entries(data).map(async ([key, value]) => {
                await this.dbService.saveToCache(key, value);
                this.translations.set(key, value);
            }));
        }
        catch (error) {
            console.warn("Warning: Error loading translations from API:", error);
            await this.loadFromCache();
        }
    }
    /**
     * Loads translations from the cache as a fallback.
     */
    async loadFromCache() {
        const cachedTranslations = await this.dbService.getAllFromCache();
        if (Object.keys(cachedTranslations).length > 0) {
            Object.entries(cachedTranslations).forEach(([key, value]) => {
                this.translations.set(key, value);
            });
            console.info("Loaded translations from cache.");
        }
        else {
            console.warn("No cached translations found. Defaulting to keys.");
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslateService, deps: [{ token: TranslationDBService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslateService, providedIn: "root" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root",
                }]
        }], ctorParameters: () => [{ type: TranslationDBService }] });

/**
 * A pipe that translates text based on the current language setting.
 *
 * @remarks
 * This pipe returns an Observable<string> and must be used with the async pipe.
 * The async pipe automatically handles subscription cleanup, preventing memory leaks.
 *
 * Memory Management:
 * - Safe from memory leaks as the async pipe handles subscription cleanup
 * - Each pipe instance creates one subscription to onLangChange
 * - Subscriptions are automatically cleaned up when component is destroyed
 *
 * Performance:
 * - Uses startWith(null) to emit initial translation
 * - Only re-renders when language changes or key changes
 * - No manual change detection required
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * {{ 'TRANSLATION_KEY' | appTranslate | async }}
 *
 * <!-- With a variable -->
 * {{ myKey | appTranslate | async }}
 *
 * <!-- In an attribute -->
 * <div [title]="'TOOLTIP_KEY' | appTranslate | async">
 * ```
 *
 * @see {@link TranslateService} for the underlying translation service
 * @see {@link https://angular.io/api/common/AsyncPipe} for async pipe documentation
 */
class TranslatePipe {
    translateService;
    constructor(translateService) {
        this.translateService = translateService;
    }
    /**
     * Transforms a translation key into an Observable of translated text.
     *
     * @param key - The translation key to look up
     * @returns Observable<string> that emits the translated text whenever the language changes
     *
     * @example
     * ```typescript
     * // In your component
     * translatePipe.transform('MY_KEY').subscribe(translated => {
     *   console.log(translated);
     * });
     * ```
     */
    transform(key) {
        return this.translateService.onLangChange.pipe(startWith(null), map(() => this.translateService.instant(key)));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslatePipe, deps: [{ token: TranslateService }], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: TranslatePipe, isStandalone: true, name: "appTranslate" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslatePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'appTranslate',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: TranslateService }] });

/**
 * Provides the translation service and its dependencies.
 * Sets up automatic initialization of the service.
 *
 * @param config - Translation service configuration
 * @returns Array of providers for the translation service
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * import { ApplicationConfig } from '@angular/core';
 * import { provideTranslate } from 'ngx-translate-db';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTranslate({
 *       projectId: 'my-app',
 *       endpoint: 'https://api.translations.com/v1',
 *       defaultLang: 'en'
 *     })
 *   ]
 * };
 * ```
 */
function provideTranslate(config) {
    return [
        TranslateService,
        TranslatePipe,
        {
            provide: APP_INITIALIZER,
            useFactory: (translateService) => () => translateService.init(config),
            deps: [TranslateService],
            multi: true
        }
    ];
}

/*
 * Public API Surface of ngx-translate-db
 */

/**
 * Generated bundle index. Do not edit.
 */

export { TranslatePipe, TranslateService, provideTranslate };
//# sourceMappingURL=ngx-translate-db.mjs.map

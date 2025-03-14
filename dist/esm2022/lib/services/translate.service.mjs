import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "./translate-db.service";
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
export class TranslateService {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslateService, deps: [{ token: i1.TranslationDBService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslateService, providedIn: "root" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root",
                }]
        }], ctorParameters: () => [{ type: i1.TranslationDBService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL3RyYW5zbGF0ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQzs7O0FBSW5EOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUlILE1BQU0sT0FBTyxnQkFBZ0I7SUFtQkU7SUFsQjdCLDhCQUE4QjtJQUN0QixXQUFXLEdBQXdCLElBQUksQ0FBQztJQUVoRCxrQ0FBa0M7SUFDMUIsaUJBQWlCLEdBQTBCLEVBQUUsQ0FBQztJQUV0RCxzQ0FBc0M7SUFDOUIsWUFBWSxHQUFHLElBQUksR0FBRyxFQUE0QixDQUFDO0lBRTNELDRCQUE0QjtJQUNYLFlBQVksR0FBRyxJQUFJLGVBQWUsQ0FBVSxJQUFJLENBQUMsQ0FBQztJQUVuRSw4QkFBOEI7SUFDYixpQkFBaUIsR0FBRyxJQUFJLGVBQWUsQ0FBc0IsSUFBSSxDQUFDLENBQUM7SUFFcEYsNkJBQTZCO0lBQ3JCLFdBQVcsR0FBeUIsSUFBSSxDQUFDO0lBRWpELFlBQTZCLFNBQStCO1FBQS9CLGNBQVMsR0FBVCxTQUFTLENBQXNCO0lBQUcsQ0FBQztJQUVoRTs7O09BR0c7SUFDSCxJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBeUI7UUFDbEMsSUFBSSxJQUFJLENBQUMsV0FBVztZQUFFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUU5QyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FB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QUNyRSxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM3QixDQUFDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ssS0FBSyxDQUFDLGFBQWE7UUFDekIsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFbEUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFO2dCQUMxRCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDbEQsQ0FBQzthQUFNLENBQUM7WUFDTixPQUFPLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxDQUFDLENBQUM7UUFDcEUsQ0FBQztJQUNILENBQUM7d0dBcFNVLGdCQUFnQjs0R0FBaEIsZ0JBQWdCLGNBRmYsTUFBTTs7NEZBRVAsZ0JBQWdCO2tCQUg1QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IFRyYW5zbGF0aW9uQ29uZmlnLCBUcmFuc2xhdGlvblZhbHVlLCBUcmFuc2xhdGlvbkxhbmd1YWdlIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvdHJhbnNsYXRpb24uaW50ZXJmYWNlXCI7XG5pbXBvcnQgeyBUcmFuc2xhdGlvbkRCU2VydmljZSB9IGZyb20gXCIuL3RyYW5zbGF0ZS1kYi5zZXJ2aWNlXCI7XG5cbi8qKlxuICogQ29yZSBzZXJ2aWNlIGZvciBoYW5kbGluZyB0cmFuc2xhdGlvbnMgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICogUHJvdmlkZXMgbWV0aG9kcyBmb3IgdHJhbnNsYXRpb24gbWFuYWdlbWVudCwgbGFuZ3VhZ2Ugc3dpdGNoaW5nLCBhbmQgY2FjaGluZy5cbiAqIFxuICogQHJlbWFya3NcbiAqIFRoaXMgc2VydmljZSBpbXBsZW1lbnRzIGFuIG9mZmxpbmUtZmlyc3QgYXBwcm9hY2ggdXNpbmcgSW5kZXhlZERCIGZvciBzdG9yYWdlLlxuICogSXQgaGFuZGxlcyBib3RoIHN5bmNocm9ub3VzIGFuZCBhc3luY2hyb25vdXMgdHJhbnNsYXRpb24gb3BlcmF0aW9ucy5cbiAqIFxuICogQGV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGNvbnN0cnVjdG9yKHByaXZhdGUgdHJhbnNsYXRlU2VydmljZTogVHJhbnNsYXRlU2VydmljZSkge1xuICogICB0cmFuc2xhdGVTZXJ2aWNlLmluaXQoe1xuICogICAgIHByb2plY3RJZDogJ215LXByb2plY3QnLFxuICogICAgIGVuZHBvaW50OiAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20vdHJhbnNsYXRpb25zJyxcbiAqICAgICBkZWZhdWx0TGFuZzogJ2VuJyxcbiAqICAgICBhY2NlcHRlZExhbmd1YWdlczogWydlbicsICdmcicsICdkZSddXG4gKiAgIH0pLnRoZW4oKCkgPT4ge1xuICogICAgIHRyYW5zbGF0ZVNlcnZpY2Uuc2V0TGFuZ3VhZ2UoJ2ZyJyk7XG4gKiAgIH0pO1xuICogXG4gKiAgIC8vIFN1YnNjcmliZSB0byBsYW5ndWFnZSBjaGFuZ2VzXG4gKiAgIHRyYW5zbGF0ZVNlcnZpY2Uub25MYW5nQ2hhbmdlLnN1YnNjcmliZShsYW5nID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnTGFuZ3VhZ2UgY2hhbmdlZCB0bzonLCBsYW5nKTtcbiAqICAgfSk7XG4gKiB9XG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiBcInJvb3RcIixcbn0pXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlU2VydmljZSB7XG4gIC8qKiBDdXJyZW50IGFjdGl2ZSBsYW5ndWFnZSAqL1xuICBwcml2YXRlIGN1cnJlbnRMYW5nOiBUcmFuc2xhdGlvbkxhbmd1YWdlID0gXCJlblwiO1xuICBcbiAgLyoqIExpc3Qgb2Ygc3VwcG9ydGVkIGxhbmd1YWdlcyAqL1xuICBwcml2YXRlIGFjY2VwdGVkTGFuZ3VhZ2VzOiBUcmFuc2xhdGlvbkxhbmd1YWdlW10gPSBbXTtcbiAgXG4gIC8qKiBJbi1tZW1vcnkgY2FjaGUgb2YgdHJhbnNsYXRpb25zICovXG4gIHByaXZhdGUgdHJhbnNsYXRpb25zID0gbmV3IE1hcDxzdHJpbmcsIFRyYW5zbGF0aW9uVmFsdWU+KCk7XG4gIFxuICAvKiogU2VydmljZSBsb2FkaW5nIHN0YXRlICovXG4gIHByaXZhdGUgcmVhZG9ubHkgbG9hZGluZ1N0YXRlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPih0cnVlKTtcbiAgXG4gIC8qKiBMYW5ndWFnZSBjaGFuZ2Ugc3ViamVjdCAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGxhbmdDaGFuZ2VTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxUcmFuc2xhdGlvbkxhbmd1YWdlPihcImVuXCIpO1xuICBcbiAgLyoqIEluaXRpYWxpemF0aW9uIHByb21pc2UgKi9cbiAgcHJpdmF0ZSBpbml0UHJvbWlzZTogUHJvbWlzZTx2b2lkPiB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZGJTZXJ2aWNlOiBUcmFuc2xhdGlvbkRCU2VydmljZSkge31cblxuICAvKipcbiAgICogT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIGxhbmd1YWdlIGNoYW5nZXMuXG4gICAqIFN1YnNjcmliZSB0byB0aGlzIHRvIHJlYWN0IHRvIGxhbmd1YWdlIGNoYW5nZXMuXG4gICAqL1xuICBnZXQgb25MYW5nQ2hhbmdlKCk6IE9ic2VydmFibGU8VHJhbnNsYXRpb25MYW5ndWFnZT4ge1xuICAgIHJldHVybiB0aGlzLmxhbmdDaGFuZ2VTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSB0cmFuc2xhdGlvbiBzZXJ2aWNlIHdpdGggdGhlIHByb3ZpZGVkIGNvbmZpZ3VyYXRpb24uXG4gICAqIFNldHMgdXAgSW5kZXhlZERCIHN0b3JhZ2UgYW5kIGxvYWRzIGluaXRpYWwgdHJhbnNsYXRpb25zLlxuICAgKiBcbiAgICogQHBhcmFtIGNvbmZpZyAtIFRyYW5zbGF0aW9uIHNlcnZpY2UgY29uZmlndXJhdGlvblxuICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgaW5pdGlhbGl6YXRpb24gZmFpbHMgb3IgY29uZmlndXJhdGlvbiBpcyBpbnZhbGlkXG4gICAqIEByZXR1cm5zIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIGluaXRpYWxpemF0aW9uIGlzIGNvbXBsZXRlXG4gICAqL1xuICBhc3luYyBpbml0KGNvbmZpZzogVHJhbnNsYXRpb25Db25maWcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5pbml0UHJvbWlzZSkgcmV0dXJuIHRoaXMuaW5pdFByb21pc2U7XG5cbiAgICB0aGlzLnZhbGlkYXRlQ29uZmlnKGNvbmZpZyk7XG4gICAgXG4gICAgdGhpcy5pbml0UHJvbWlzZSA9IChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmFjY2VwdGVkTGFuZ3VhZ2VzID0gWy4uLmNvbmZpZy5hY2NlcHRlZExhbmd1YWdlc107XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0TGFuZ3VhZ2UoY29uZmlnLmRlZmF1bHRMYW5nKTtcbiAgICAgICAgYXdhaXQgdGhpcy5kYlNlcnZpY2UuaW5pdChjb25maWcpO1xuICAgICAgICBhd2FpdCB0aGlzLmxvYWRUcmFuc2xhdGlvbnMoY29uZmlnKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nU3RhdGUubmV4dChmYWxzZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgaW5pdGlhbGl6aW5nIHRyYW5zbGF0aW9uIHNlcnZpY2U6XCIsIGVycm9yKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nU3RhdGUubmV4dChmYWxzZSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRyYW5zbGF0aW9uIGluaXRpYWxpemF0aW9uIGZhaWxlZFwiKTtcbiAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgcmV0dXJuIHRoaXMuaW5pdFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbG9hZGluZyBzdGF0ZSBhcyBhbiBvYnNlcnZhYmxlLlxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlPGJvb2xlYW4+IGluZGljYXRpbmcgaWYgdGhlIHNlcnZpY2UgaXMgbG9hZGluZ1xuICAgKi9cbiAgZ2V0IGlzTG9hZGluZygpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5sb2FkaW5nU3RhdGUuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudCBhY3RpdmUgbGFuZ3VhZ2UuXG4gICAqIEByZXR1cm5zIFRoZSBjdXJyZW50IGxhbmd1YWdlIGNvZGVcbiAgICovXG4gIGdldCBjdXJyZW50TGFuZ3VhZ2UoKTogVHJhbnNsYXRpb25MYW5ndWFnZSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudExhbmc7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbGlzdCBvZiBzdXBwb3J0ZWQgbGFuZ3VhZ2VzLlxuICAgKiBAcmV0dXJucyBBcnJheSBvZiBhY2NlcHRlZCBsYW5ndWFnZSBjb2Rlc1xuICAgKi9cbiAgZ2V0IHN1cHBvcnRlZExhbmd1YWdlcygpOiBUcmFuc2xhdGlvbkxhbmd1YWdlW10ge1xuICAgIHJldHVybiBbLi4udGhpcy5hY2NlcHRlZExhbmd1YWdlc107XG4gIH1cblxuICAvKipcbiAgICogQXN5bmNocm9ub3VzbHkgcmV0cmlldmVzIGEgdHJhbnNsYXRpb24gZm9yIHRoZSBnaXZlbiBrZXkuXG4gICAqIFdhaXRzIGZvciBzZXJ2aWNlIGluaXRpYWxpemF0aW9uIGJlZm9yZSByZXR1cm5pbmcgdGhlIHRyYW5zbGF0aW9uLlxuICAgKiBcbiAgICogQHBhcmFtIGtleSAtIFRyYW5zbGF0aW9uIGtleSB0byBsb29rIHVwXG4gICAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2aW5nIHRvIHRoZSB0cmFuc2xhdGVkIHN0cmluZ1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgc2VydmljZSBpcyBub3QgaW5pdGlhbGl6ZWRcbiAgICovXG4gIGFzeW5jIHRyYW5zbGF0ZShrZXk6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy53YWl0Rm9ySW5pdGlhbGl6YXRpb24oKTtcbiAgICByZXR1cm4gdGhpcy5nZXRUcmFuc2xhdGlvbihrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bmNocm9ub3VzbHkgcmV0cmlldmVzIGEgdHJhbnNsYXRpb24gZm9yIHRoZSBnaXZlbiBrZXkuXG4gICAqIEZhbGxzIGJhY2sgdG8ga2V5IGlmIHRyYW5zbGF0aW9uIGlzIG5vdCBmb3VuZC5cbiAgICogXG4gICAqIEBwYXJhbSBrZXkgLSBUcmFuc2xhdGlvbiBrZXkgdG8gbG9vayB1cFxuICAgKiBAcmV0dXJucyBUcmFuc2xhdGVkIHN0cmluZyBvciBrZXkgaWYgbm90IGZvdW5kXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBzZXJ2aWNlIGlzIG5vdCBpbml0aWFsaXplZFxuICAgKi9cbiAgaW5zdGFudChrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmluaXRQcm9taXNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1RyYW5zbGF0aW9uIHNlcnZpY2Ugbm90IGluaXRpYWxpemVkLiBQbGVhc2UgcHJvdmlkZSBjb25maWd1cmF0aW9uIGluIHlvdXIgYXBwLmNvbmZpZy50cycpO1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRoaXMubG9hZGluZ1N0YXRlLnZhbHVlIFxuICAgICAgPyB0aGlzLmdldFRyYW5zbGF0aW9uRmFsbGJhY2soa2V5KVxuICAgICAgOiB0aGlzLmdldFRyYW5zbGF0aW9uKGtleSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlcyB0aGUgY3VycmVudCBhY3RpdmUgbGFuZ3VhZ2UuXG4gICAqIEVtaXRzIHRoZSBuZXcgbGFuZ3VhZ2UgdG8gc3Vic2NyaWJlcnMuXG4gICAqIFxuICAgKiBAcGFyYW0gbGFuZyAtIExhbmd1YWdlIGNvZGUgdG8gc3dpdGNoIHRvXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBzZXJ2aWNlIGlzIG5vdCBpbml0aWFsaXplZCBvciBsYW5ndWFnZSBpcyBub3Qgc3VwcG9ydGVkXG4gICAqIEByZXR1cm5zIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBsYW5ndWFnZSBpcyBzZXRcbiAgICovXG4gIGFzeW5jIHNldExhbmd1YWdlKGxhbmc6IFRyYW5zbGF0aW9uTGFuZ3VhZ2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBEdXJpbmcgaW5pdGlhbGl6YXRpb24sIHdlIGRvbid0IG5lZWQgdG8gd2FpdFxuICAgIGlmICh0aGlzLmluaXRQcm9taXNlICYmICF0aGlzLmxvYWRpbmdTdGF0ZS52YWx1ZSkge1xuICAgICAgYXdhaXQgdGhpcy53YWl0Rm9ySW5pdGlhbGl6YXRpb24oKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCF0aGlzLmlzTGFuZ3VhZ2VTdXBwb3J0ZWQobGFuZykpIHtcbiAgICAgIGNvbnNvbGUud2FybihgV2FybmluZzogTGFuZ3VhZ2UgJyR7bGFuZ30nIGlzIG5vdCBzdXBwb3J0ZWQuIEZhbGxpbmcgYmFjayB0byBkZWZhdWx0ICcke3RoaXMuYWNjZXB0ZWRMYW5ndWFnZXNbMF19J2ApO1xuICAgICAgbGFuZyA9IHRoaXMuYWNjZXB0ZWRMYW5ndWFnZXNbMF07XG4gICAgfVxuICAgIFxuICAgIHRoaXMuY3VycmVudExhbmcgPSBsYW5nO1xuICAgIHRoaXMubGFuZ0NoYW5nZVN1YmplY3QubmV4dChsYW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBsYW5ndWFnZSBpcyBzdXBwb3J0ZWQuXG4gICAqIER1cmluZyBpbml0aWFsaXphdGlvbiwgYWxsIGxhbmd1YWdlcyBhcmUgY29uc2lkZXJlZCBzdXBwb3J0ZWQuXG4gICAqIFxuICAgKiBAcGFyYW0gbGFuZyAtIExhbmd1YWdlIGNvZGUgdG8gY2hlY2tcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgbGFuZ3VhZ2UgaXMgc3VwcG9ydGVkLCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIGlzTGFuZ3VhZ2VTdXBwb3J0ZWQobGFuZzogVHJhbnNsYXRpb25MYW5ndWFnZSk6IGJvb2xlYW4ge1xuICAgIC8vIER1cmluZyBpbml0aWFsaXphdGlvbiwgY29uc2lkZXIgYWxsIGxhbmd1YWdlcyBzdXBwb3J0ZWRcbiAgICBpZiAodGhpcy5sb2FkaW5nU3RhdGUudmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hY2NlcHRlZExhbmd1YWdlcy5pbmNsdWRlcyhsYW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIG1vZHVsZS1zcGVjaWZpYyB0cmFuc2xhdGlvbiBjYWNoZS5cbiAgICogUmVsb2FkcyB0cmFuc2xhdGlvbnMgYWZ0ZXIgY2xlYXJpbmcuXG4gICAqL1xuICBhc3luYyBjbGVhck1vZHVsZUNhY2hlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZGJTZXJ2aWNlLmNsZWFyQ2FjaGUoKTtcbiAgICB0aGlzLnRyYW5zbGF0aW9ucy5jbGVhcigpO1xuICAgIGF3YWl0IHRoaXMud2FpdEZvckluaXRpYWxpemF0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFsbCB0cmFuc2xhdGlvbiBjYWNoZXMuXG4gICAqIFJlbG9hZHMgdHJhbnNsYXRpb25zIGFmdGVyIGNsZWFyaW5nLlxuICAgKi9cbiAgYXN5bmMgY2xlYXJBbGxDYWNoZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmRiU2VydmljZS5jbGVhckRCKCk7XG4gICAgdGhpcy50cmFuc2xhdGlvbnMuY2xlYXIoKTtcbiAgICBhd2FpdCB0aGlzLndhaXRGb3JJbml0aWFsaXphdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyB0aGUgdHJhbnNsYXRpb24gY29uZmlndXJhdGlvbi5cbiAgICogXG4gICAqIEBwYXJhbSBjb25maWcgLSBDb25maWd1cmF0aW9uIHRvIHZhbGlkYXRlXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBjb25maWd1cmF0aW9uIGlzIGludmFsaWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgdmFsaWRhdGVDb25maWcoY29uZmlnOiBUcmFuc2xhdGlvbkNvbmZpZyk6IHZvaWQge1xuICAgIGlmICghY29uZmlnLmFjY2VwdGVkTGFuZ3VhZ2VzPy5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUud2FybignYWNjZXB0ZWRMYW5ndWFnZXMgbXVzdCBiZSBwcm92aWRlZCBhbmQgY29udGFpbiBhdCBsZWFzdCBvbmUgbGFuZ3VhZ2UgY29kZScpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhY2NlcHRlZExhbmd1YWdlcyBtdXN0IGJlIHByb3ZpZGVkIGFuZCBjb250YWluIGF0IGxlYXN0IG9uZSBsYW5ndWFnZSBjb2RlJyk7XG4gICAgfVxuICAgIFxuICAgIGlmICghY29uZmlnLmFjY2VwdGVkTGFuZ3VhZ2VzLmluY2x1ZGVzKGNvbmZpZy5kZWZhdWx0TGFuZykpIHtcbiAgICAgIGNvbnNvbGUud2FybihgZGVmYXVsdExhbmcgJyR7Y29uZmlnLmRlZmF1bHRMYW5nfScgbXVzdCBiZSBpbmNsdWRlZCBpbiBhY2NlcHRlZExhbmd1YWdlc2ApO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBkZWZhdWx0TGFuZyAnJHtjb25maWcuZGVmYXVsdExhbmd9JyBtdXN0IGJlIGluY2x1ZGVkIGluIGFjY2VwdGVkTGFuZ3VhZ2VzYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZXMgdGhlIHNlcnZpY2UgaXMgaW5pdGlhbGl6ZWQgYmVmb3JlIHByb2NlZWRpbmcuXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBzZXJ2aWNlIGlzIG5vdCBpbml0aWFsaXplZFxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyB3YWl0Rm9ySW5pdGlhbGl6YXRpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLmluaXRQcm9taXNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBUcmFuc2xhdGlvbiBzZXJ2aWNlIG5vdCBpbml0aWFsaXplZC4gVXNpbmcgZGVmYXVsdCBmYWxsYmFjay5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuaW5pdFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgdHJhbnNsYXRpb24gZm9yIHRoZSBnaXZlbiBrZXkuXG4gICAqIEZhbGxzIGJhY2sgdG8gZmFsbGJhY2sgbGFuZ3VhZ2UgaWYgdHJhbnNsYXRpb24gaXMgbm90IGZvdW5kLlxuICAgKiBcbiAgICogQHBhcmFtIGtleSAtIFRyYW5zbGF0aW9uIGtleSB0byBsb29rIHVwXG4gICAqIEByZXR1cm5zIFRyYW5zbGF0ZWQgc3RyaW5nIG9yIGZhbGxiYWNrXG4gICAqL1xuICBwcml2YXRlIGdldFRyYW5zbGF0aW9uKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0cmFuc2xhdGlvbiA9IHRoaXMudHJhbnNsYXRpb25zLmdldChrZXkpO1xuICAgIGlmICghdHJhbnNsYXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRyYW5zbGF0aW9uRmFsbGJhY2soa2V5KTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRyYW5zbGF0aW9uW3RoaXMuY3VycmVudExhbmddO1xuICAgIHJldHVybiB2YWx1ZSA/PyB0aGlzLmdldFRyYW5zbGF0aW9uRmFsbGJhY2soa2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgZmFsbGJhY2sgdHJhbnNsYXRpb24gd2hlbiB0aGUgcHJpbWFyeSB0cmFuc2xhdGlvbiBpcyBub3QgZm91bmQuXG4gICAqIFJldHVybnMgdGhlIGZpcnN0IGF2YWlsYWJsZSB0cmFuc2xhdGlvbiBvciB0aGUga2V5IGl0c2VsZi5cbiAgICogXG4gICAqIEBwYXJhbSBrZXkgLSBUcmFuc2xhdGlvbiBrZXkgdG8gbG9vayB1cFxuICAgKiBAcmV0dXJucyBGYWxsYmFjayB0cmFuc2xhdGlvbiBvciBrZXlcbiAgICovXG4gIHByaXZhdGUgZ2V0VHJhbnNsYXRpb25GYWxsYmFjayhrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdHJhbnNsYXRpb24gPSB0aGlzLnRyYW5zbGF0aW9ucy5nZXQoa2V5KTtcbiAgICBpZiAodHJhbnNsYXRpb24pIHtcbiAgICAgIC8vIEZpcnN0IHRyeSB0aGUgZGVmYXVsdCBsYW5ndWFnZSBmcm9tIGNvbmZpZ1xuICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gdHJhbnNsYXRpb25bdGhpcy5hY2NlcHRlZExhbmd1YWdlc1swXV07XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlKSByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgICAvLyBUaGVuIHRyeSBhbnkgYXZhaWxhYmxlIGxhbmd1YWdlXG4gICAgICBjb25zdCBsYW5ndWFnZXMgPSBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbik7XG4gICAgICBpZiAobGFuZ3VhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uW2xhbmd1YWdlc1swXV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdHJhbnNsYXRpb25zIGZyb20gdGhlIEFQSSBvciBjYWNoZS5cbiAgICogU3RvcmVzIHRyYW5zbGF0aW9ucyBpbiBib3RoIG1lbW9yeSBhbmQgSW5kZXhlZERCLlxuICAgKiBcbiAgICogQHBhcmFtIGNvbmZpZyAtIFRyYW5zbGF0aW9uIGNvbmZpZ3VyYXRpb25cbiAgICogQHRocm93cyB7RXJyb3J9IElmIHRyYW5zbGF0aW9ucyBjYW5ub3QgYmUgbG9hZGVkXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGxvYWRUcmFuc2xhdGlvbnMoY29uZmlnOiBUcmFuc2xhdGlvbkNvbmZpZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2NvbmZpZy5lbmRwb2ludH0/cHJvamVjdElkPSR7Y29uZmlnLnByb2plY3RJZH0mYXBpS2V5PSR7Y29uZmlnLmFwaUtleX1gLCB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICB9KTtcbiAgXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgV2FybmluZzogRmFpbGVkIHRvIGZldGNoIHRyYW5zbGF0aW9ucyBmcm9tIEFQSTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5sb2FkRnJvbUNhY2hlKCk7XG4gICAgICB9XG4gIFxuICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBUcmFuc2xhdGlvblZhbHVlIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBPYmplY3QuZW50cmllcyhkYXRhKS5tYXAoYXN5bmMgKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGF3YWl0IHRoaXMuZGJTZXJ2aWNlLnNhdmVUb0NhY2hlKGtleSwgdmFsdWUpO1xuICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25zLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IEVycm9yIGxvYWRpbmcgdHJhbnNsYXRpb25zIGZyb20gQVBJOlwiLCBlcnJvcik7XG4gICAgICBhd2FpdCB0aGlzLmxvYWRGcm9tQ2FjaGUoKTtcbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBMb2FkcyB0cmFuc2xhdGlvbnMgZnJvbSB0aGUgY2FjaGUgYXMgYSBmYWxsYmFjay5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgbG9hZEZyb21DYWNoZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjYWNoZWRUcmFuc2xhdGlvbnMgPSBhd2FpdCB0aGlzLmRiU2VydmljZS5nZXRBbGxGcm9tQ2FjaGUoKTtcbiAgICBcbiAgICBpZiAoT2JqZWN0LmtleXMoY2FjaGVkVHJhbnNsYXRpb25zKS5sZW5ndGggPiAwKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhjYWNoZWRUcmFuc2xhdGlvbnMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUuaW5mbyhcIkxvYWRlZCB0cmFuc2xhdGlvbnMgZnJvbSBjYWNoZS5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIk5vIGNhY2hlZCB0cmFuc2xhdGlvbnMgZm91bmQuIERlZmF1bHRpbmcgdG8ga2V5cy5cIik7XG4gICAgfVxuICB9ICBcbn1cbiJdfQ==
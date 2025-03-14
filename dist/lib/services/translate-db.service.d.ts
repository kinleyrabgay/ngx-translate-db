import { TranslationConfig, TranslationValue } from '../interfaces/translation.interface';
import * as i0 from "@angular/core";
/**
 * Service responsible for managing translation data in IndexedDB.
 * Provides methods for caching and retrieving translations.
 *
 * @remarks
 * This service uses the 'idb' library for IndexedDB operations.
 * All operations are asynchronous and return Promises.
 */
export declare class TranslationDBService {
    /** IndexedDB database instance */
    private db;
    /** Default store name for translations */
    private readonly STORE_NAME;
    /** Default database name */
    private readonly DEFAULT_DB_NAME;
    /** Default database version */
    private readonly DB_VERSION;
    /**
     * Initializes the IndexedDB database for translations.
     * Creates the necessary object store if it doesn't exist.
     *
     * @param config - Optional configuration for database setup
     * @throws {Error} If database initialization fails
     */
    init(config?: TranslationConfig): Promise<void>;
    /**
     * Saves a translation value to the cache.
     *
     * @param key - Translation key
     * @param value - Translation value object
     * @throws {Error} If the database is not initialized or save fails
     */
    saveToCache(key: string, value: TranslationValue): Promise<void>;
    /**
     * Retrieves a translation value from the cache.
     *
     * @param key - Translation key to retrieve
     * @returns Promise resolving to the translation value or null if not found
     * @throws {Error} If the database is not initialized
     */
    getFromCache(key: string): Promise<TranslationValue | null>;
    /**
     * Retrieves all translations from the cache.
     *
     * @returns Promise resolving to an object containing all translations
     * @throws {Error} If the database is not initialized
     */
    getAllFromCache(): Promise<{
        [key: string]: TranslationValue;
    }>;
    /**
     * Clears all translations from the cache.
     *
     * @throws {Error} If the database is not initialized or clear fails
     */
    clearCache(): Promise<void>;
    /**
     * Deletes the entire database.
     * Closes the current connection before deletion.
     *
     * @throws {Error} If database deletion fails
     */
    clearDB(): Promise<void>;
    /**
     * Creates the translations object store in the database.
     *
     * @param db - IndexedDB database instance
     * @private
     */
    private createObjectStore;
    /**
     * Ensures the database is initialized before operations.
     *
     * @throws {Error} If the database is not initialized
     * @private
     */
    private ensureDBInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslationDBService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TranslationDBService>;
}

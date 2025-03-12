import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, deleteDB } from 'idb';
import { TranslationConfig, TranslationValue } from '../interfaces/translation.interface';

/**
 * Service responsible for managing translation data in IndexedDB.
 * Provides methods for caching and retrieving translations.
 * 
 * @remarks
 * This service uses the 'idb' library for IndexedDB operations.
 * All operations are asynchronous and return Promises.
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationDBService {
  /** IndexedDB database instance */
  private db!: IDBPDatabase;
  
  /** Default store name for translations */
  private readonly STORE_NAME = 'translations';
  
  /** Default database name */
  private readonly DEFAULT_DB_NAME = 'translations-db';
  
  /** Default database version */
  private readonly DB_VERSION = 1;

  /**
   * Initializes the IndexedDB database for translations.
   * Creates the necessary object store if it doesn't exist.
   * 
   * @param config - Optional configuration for database setup
   * @throws {Error} If database initialization fails
   */
  async init(config?: TranslationConfig): Promise<void> {
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
    } catch (error) {
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
  async saveToCache(key: string, value: TranslationValue): Promise<void> {
    this.ensureDBInitialized();
    try {
      await this.db.put(this.STORE_NAME, value, key);
    } catch (error) {
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
  async getFromCache(key: string): Promise<TranslationValue | null> {
    this.ensureDBInitialized();
    try {
      return await this.db.get(this.STORE_NAME, key);
    } catch (error) {
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
  async getAllFromCache(): Promise<{ [key: string]: TranslationValue }> {
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
      }, {} as { [key: string]: TranslationValue });
    } catch (error) {
      console.error('Error retrieving all translations from cache:', error);
      return {};
    }
  }

  /**
   * Clears all translations from the cache.
   * 
   * @throws {Error} If the database is not initialized or clear fails
   */
  async clearCache(): Promise<void> {
    this.ensureDBInitialized();
    try {
      await this.db.clear(this.STORE_NAME);
    } catch (error) {
      console.error('Error clearing translation cache:', error);
    }
  }

  /**
   * Deletes the entire database.
   * Closes the current connection before deletion.
   * 
   * @throws {Error} If database deletion fails
   */
  async clearDB(): Promise<void> {
    try {
      if (this.db) {
        const dbName = this.db.name;
        await this.db.close();
        await deleteDB(dbName);
        this.db = null as any;
      }
    } catch (error) {
      console.error('Error deleting translation database:', error);
    }
  }

  /**
   * Creates the translations object store in the database.
   * 
   * @param db - IndexedDB database instance
   * @private
   */
  private createObjectStore(db: IDBPDatabase): void {
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
  private ensureDBInitialized(): void {
    if (!this.db) {
      console.warn('Translation database not initialized. Call init() first.');
    }
  }
}

import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, deleteDB } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class TranslationDBService {
  private db!: IDBPDatabase;

  async init(): Promise<void> {
    try {
      this.db = await openDB('translations-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('translations')) {
            db.createObjectStore('translations');
          }
        },
      });
      console.log('[TranslationDBService] Database initialized successfully');
    } catch (error) {
      console.error('[TranslationDBService] Error initializing database:', error);
      throw error;
    }
  }

  async saveToCache(key: string, value: { [lang: string]: string }): Promise<void> {
    try {
      console.log(`[TranslationDBService] Saving to cache - Key: ${key}`, value);
      await this.db.put('translations', value, key);
    } catch (error) {
      console.error(`[TranslationDBService] Error saving to cache for key ${key}:`, error);
      throw error;
    }
  }

  async getFromCache(key: string): Promise<{ [lang: string]: string } | null> {
    try {
      const value = await this.db.get('translations', key);
      console.log(`[TranslationDBService] Retrieved from cache - Key: ${key}`, value);
      return value;
    } catch (error) {
      console.error(`[TranslationDBService] Error getting from cache for key ${key}:`, error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await this.db.getAllKeys('translations');
      console.log('[TranslationDBService] Retrieved all keys:', keys);
      return keys as string[];
    } catch (error) {
      console.error('[TranslationDBService] Error getting all keys:', error);
      throw error;
    }
  }

  async clearCache(): Promise<void> {
    try {
      console.log('[TranslationDBService] Clearing cache');
      await this.db.clear('translations');
    } catch (error) {
      console.error('[TranslationDBService] Error clearing cache:', error);
      throw error;
    }
  }

  async clearDB(): Promise<void> {
    try {
      console.log('[TranslationDBService] Clearing database');
      await this.db.close();
      await deleteDB('translations-db');
    } catch (error) {
      console.error('[TranslationDBService] Error clearing database:', error);
      throw error;
    }
  }
}

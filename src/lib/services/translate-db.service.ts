import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, deleteDB } from 'idb';
import { TranslationValue } from '../interfaces/translation.interface';

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
    } catch (error) {
      console.error('Error initializing translation database:', error);
      throw error;
    }
  }

  async saveToCache(key: string, value: TranslationValue): Promise<void> {
    await this.db.put('translations', value, key);
  }

  async getFromCache(key: string): Promise<TranslationValue | null> {
    return await this.db.get('translations', key);
  }

  async getAllFromCache(): Promise<{ [key: string]: TranslationValue }> {
    const allKeys = await this.db.getAllKeys('translations');
    const result: { [key: string]: TranslationValue } = {};
    
    for (const key of allKeys) {
      const value = await this.getFromCache(key.toString());
      if (value) {
        result[key.toString()] = value;
      }
    }
    
    return result;
  }

  async clearCache(): Promise<void> {
    await this.db.clear('translations');
  }

  async clearDB(): Promise<void> {
    await this.db.close();
    await deleteDB('translations-db');
  }
}

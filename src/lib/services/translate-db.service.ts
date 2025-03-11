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
    } catch (error) {
      console.error('Error initializing translation database:', error);
      throw error;
    }
  }

  async saveToCache(key: string, value: { [lang: string]: string }): Promise<void> {
    await this.db.put('translations', value, key);
  }

  async getFromCache(key: string): Promise<{ [lang: string]: string } | null> {
    return await this.db.get('translations', key);
  }

  async clearCache(): Promise<void> {
    await this.db.clear('translations');
  }

  async clearDB(): Promise<void> {
    await this.db.close();
    await deleteDB('translations-db');
  }
}

import { Injectable, Inject, Optional } from '@angular/core';
import { TranslationConfig, TranslationValue } from '../interfaces/translation.interface';
import { TranslationDBService } from './translate-db.service';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private currentLang: string = 'en';
  private translations: { [key: string]: TranslationValue } = {};
  private initialized = false;
  private config!: TranslationConfig;
  private initPromise: Promise<void> | null = null;
  private translationsSubject = new BehaviorSubject<{ [key: string]: string }>({});
  public translations$ = this.translationsSubject.asObservable();

  constructor(
    private dbService: TranslationDBService,
    @Optional() @Inject('TRANSLATE_CONFIG') config: TranslationConfig
  ) {
    if (config) {
      this.initPromise = this.init(config);
      this.initPromise.catch(err => console.error('Failed to initialize translation service:', err));
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!this.initPromise) {
      console.warn('[TranslateService] No configuration provided. Using default settings.');
      this.initPromise = this.init({
        defaultLang: 'en',
        projectId: 'default',
        endpoint: '',
      });
    }

    await this.initPromise;
  }

  async init(config: TranslationConfig): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.config = config;
    this.currentLang = config.defaultLang;

    try {
      await this.dbService.init();
      await this.loadTranslations();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing translation service:', error);
      throw error;
    }
  }

  private async loadTranslations(): Promise<void> {
    try {
      const cachedKeys = await this.dbService.getAllKeys();
      if (cachedKeys.length > 0) {
        for (const key of cachedKeys) {
          const translation = await this.dbService.getFromCache(key);
          if (translation) {
            this.translations[key] = translation as TranslationValue;
          }
        }
        this.translationsSubject.next(this.flattenTranslations(this.translations));
        return;
      }

      const translations = await this.fetchTranslations();
      for (const [key, value] of Object.entries(translations)) {
        await this.dbService.saveToCache(key, value);
        this.translations[key] = value;
      }
      this.translationsSubject.next(this.flattenTranslations(this.translations));
    } catch (error) {
      console.error('Error loading translations:', error);
      throw error;
    }
  }

  private flattenTranslations(translations: { [key: string]: TranslationValue }): { [key: string]: string } {
    const flattened: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(translations)) {
      // Assuming we need to use the currentLang as the language key
      if (value[this.currentLang]) {
        flattened[key] = value[this.currentLang];
      }
    }
    return flattened;
  }

  private async fetchTranslations(): Promise<{ [key: string]: TranslationValue }> {
    try {
      if (!this.config.endpoint) {
        return {
          "BTN_LOGIN": { "en": "Login", "fr": "Connexion", "it": "Accesso" },
          "BTN_REGISTER": { "en": "Register", "fr": "S'inscrire", "it": "Registrati" },
          "BTN_LOGOUT": { "en": "Logout", "fr": "Déconnexion", "it": "Disconnettersi" },
          "BTN_PROFILE": { "en": "Profile", "fr": "Profil", "it": "Profilo" }
        };
      }

      const response = await fetch(this.config.endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching translations:', error);
      return {};
    }
  }

  instant(key: string): Observable<string> {
    if (!this.initialized) {
      console.warn('[TranslateService] Service not initialized yet, returning key');
      return of(key);
    }

    const translation = this.translations[key];
    if (!translation) {
      return of(key);
    }

    return of(translation[this.currentLang] || key);
  }

  async setLanguage(lang: string): Promise<void> {
    await this.ensureInitialized();
    this.currentLang = lang;
    this.translationsSubject.next(this.flattenTranslations(this.translations));
  }

  async clearModuleCache(): Promise<void> {
    await this.ensureInitialized();
    await this.dbService.clearCache();
    this.translations = {};
    // this.translationsSubject.next(this.translations);
  }

  async clearAllCache(): Promise<void> {
    await this.ensureInitialized();
    await this.dbService.clearDB();
    this.translations = {};
    // this.translationsSubject.next(this.translations);
    this.initialized = false;
  }
}

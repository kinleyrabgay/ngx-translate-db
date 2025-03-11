import { Injectable, Inject, Optional } from '@angular/core';
import { TranslationConfig, TranslationValue } from '../interfaces/translation.interface';
import { TranslationDBService } from './translate-db.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLang: string = 'en';
  private translations: { [key: string]: TranslationValue } = {};
  private initialized = false;
  private config!: TranslationConfig;
  private initPromise: Promise<void> | null = null;

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
    if (this.initialized) return;
    if (!this.initPromise) {
      this.initPromise = this.init({
        defaultLang: 'en',
        projectId: 'default',
        endpoint: '',
        translations: {}
      });
    }
    await this.initPromise;
  }

  async init(config: TranslationConfig): Promise<void> {
    if (this.initialized) return;

    this.config = config;
    this.currentLang = config.defaultLang;
    console.log('[TranslateService] Initializing with config:', config);

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
        return;
      }

      const translations = await this.fetchTranslations();
      for (const [key, value] of Object.entries(translations)) {
        await this.dbService.saveToCache(key, value);
        this.translations[key] = value;
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      throw error;
    }
  }

  private async fetchTranslations(): Promise<{ [key: string]: TranslationValue }> {
    try {
      return {
        "BTN_LOGIN": { "en": "Logging from here", "fr": "Connexion", "it": "Accesso" },
        "BTN_REGISTER": { "en": "Register", "fr": "S'inscrire", "it": "Registrati" },
        "BTN_LOGOUT": { "en": "Logout", "fr": "Déconnexion", "it": "Disconnettersi" },
        "BTN_PROFILE": { "en": "Profile", "fr": "Profil", "it": "Profilo" }
      };
    } catch (error) {
      console.error('Error fetching translations:', error);
      return {};
    }
  }

  async instant(key: string): Promise<string> {
    await this.ensureInitialized();
    const translation = this.translations[key];
    return translation ? translation[this.currentLang] || key : key;
  }

  async setLanguage(lang: string): Promise<void> {
    await this.ensureInitialized();
    this.currentLang = lang;
  }

  async clearModuleCache(): Promise<void> {
    await this.ensureInitialized();
    await this.dbService.clearCache();
    this.translations = {};
  }

  async clearAllCache(): Promise<void> {
    await this.ensureInitialized();
    await this.dbService.clearDB();
    this.translations = {};
    this.initialized = false;
  }
}

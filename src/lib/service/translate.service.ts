import { Injectable, Inject, Optional } from '@angular/core';
import { TranslationConfig, TranslationValue } from '../interface/translation.interface';
import { TranslationDBService } from './translate-db.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLang: string = 'en';
  private translations: { [key: string]: TranslationValue } = {};
  private initialized = false;
  private config!: TranslationConfig;

  constructor(
    private dbService: TranslationDBService,
    @Optional() @Inject('TRANSLATE_CONFIG') config: TranslationConfig
  ) {
    if (config) {
      this.init(config).catch(err => console.error('Failed to initialize translation service:', err));
    }
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
    }
  }

  private async loadTranslations(): Promise<void> {
    try {
      const translations = await this.fetchTranslations();
      for (const [key, value] of Object.entries(translations)) {
        await this.dbService.saveToCache(key, value);
        this.translations[key] = value;
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  private async fetchTranslations(): Promise<{ [key: string]: TranslationValue }> {
    try {
      // Mock API call to fetch translations (replace with actual API in production)
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

  instant(key: string): string {
    const translation = this.translations[key];
    return translation ? (translation[this.currentLang] || key) : key;
  }

  async setLanguage(lang: string): Promise<void> {
    this.currentLang = lang;
  }

  async clearModuleCache(): Promise<void> {
    await this.dbService.clearCache();
    this.translations = {};
  }

  async clearAllCache(): Promise<void> {
    await this.dbService.clearDB();
    this.translations = {};
  }
}

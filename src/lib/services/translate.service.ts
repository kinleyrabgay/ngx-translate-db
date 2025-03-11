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
    console.log('[TranslateService] Initializing with config:', config);

    try {
      await this.dbService.init();
      await this.loadTranslations();
      this.initialized = true;
      console.log('[TranslateService] Initialization complete. Current translations:', this.translations);
    } catch (error) {
      console.error('Error initializing translation service:', error);
      throw error; // Propagate error for better error handling
    }
  }

  private async loadTranslations(): Promise<void> {
    try {
      // First try to load from cache
      const cachedTranslations = await this.dbService.getFromCache('all');
      if (cachedTranslations) {
        console.log('[TranslateService] Loaded translations from cache:', cachedTranslations);
        this.translations = cachedTranslations as unknown as { [key: string]: TranslationValue };
        return;
      }

      // If no cache, fetch from API
      const translations = await this.fetchTranslations();
      console.log('[TranslateService] Fetched translations from API:', translations);
      
      // Save to cache and memory
      await this.dbService.saveToCache('all', translations as unknown as { [lang: string]: string });
      this.translations = translations;
      
      console.log('[TranslateService] Translations loaded and cached successfully');
    } catch (error) {
      console.error('Error loading translations:', error);
      throw error;
    }
  }

  private async fetchTranslations(): Promise<{ [key: string]: TranslationValue }> {
    try {
      // Mock API call to fetch translations (replace with actual API in production)
      const translations = {
        "BTN_LOGIN": { "en": "Logging from here", "fr": "Connexion", "it": "Accesso" },
        "BTN_REGISTER": { "en": "Register", "fr": "S'inscrire", "it": "Registrati" },
        "BTN_LOGOUT": { "en": "Logout", "fr": "Déconnexion", "it": "Disconnettersi" },
        "BTN_PROFILE": { "en": "Profile", "fr": "Profil", "it": "Profilo" }
      };
      console.log('[TranslateService] Mock translations:', translations);
      return translations;
    } catch (error) {
      console.error('Error fetching translations:', error);
      return {};
    }
  }

  instant(key: string): string {
    if (!this.initialized) {
      console.warn('[TranslateService] Service not initialized yet');
      return key;
    }

    console.log(`[TranslateService] Looking up translation for key: ${key}`);
    console.log(`[TranslateService] Current language: ${this.currentLang}`);
    console.log(`[TranslateService] Available translations:`, this.translations);
    
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`[TranslateService] No translation found for key: ${key}`);
      return key;
    }

    const result = translation[this.currentLang] || key;
    console.log(`[TranslateService] Translation result for ${key}:`, result);
    return result;
  }

  async setLanguage(lang: string): Promise<void> {
    console.log(`[TranslateService] Setting language to: ${lang}`);
    this.currentLang = lang;
  }

  async clearModuleCache(): Promise<void> {
    console.log('[TranslateService] Clearing module cache');
    await this.dbService.clearCache();
    this.translations = {};
  }

  async clearAllCache(): Promise<void> {
    console.log('[TranslateService] Clearing all cache');
    await this.dbService.clearDB();
    this.translations = {};
    this.initialized = false;
  }
}

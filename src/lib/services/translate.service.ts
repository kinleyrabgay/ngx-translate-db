import { Injectable, Inject, Optional } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  TranslationConfig,
  TranslationValue,
} from "../interfaces/translation.interface";
import { TranslationDBService } from "./translate-db.service";

@Injectable({
  providedIn: "root",
})
export class TranslateService {
  private currentLang: string = "en";
  private translations: { [key: string]: TranslationValue } = {};
  private loadingState = new BehaviorSubject<boolean>(true);
  private initPromise: Promise<void> | null = null;

  constructor(
    private dbService: TranslationDBService,
    @Optional() @Inject("TRANSLATE_CONFIG") config: TranslationConfig
  ) {
    if (config) {
      this.initPromise = this.init(config);
    }
  }

  /**
   * Initialize the translation service
   */
  private async init(config: TranslationConfig): Promise<void> {
    try {
      this.currentLang = config.defaultLang;
      await this.dbService.init();
      await this.loadTranslations(config);
      this.loadingState.next(false);
    } catch (error) {
      console.error("Error initializing translation service:", error);
      throw new Error("Translation initialization failed");
    }
  }

  /**
   * Get translation for a key
   */
  async translate(key: string): Promise<string> {
    await this.waitForInitialization();
    return this.getTranslation(key);
  }

  /**
   * Get translation synchronously
   */
  instant(key: string): string {
    if (!this.initPromise) {
      throw new Error('Translation service not initialized. Please provide configuration in your app.config.ts');
    }
    
    if (this.loadingState.value) {
      return this.getTranslationFallback(key);
    }
    
    return this.getTranslation(key);
  }

  /**
   * Set current language
   */
  async setLanguage(lang: string): Promise<void> {
    await this.waitForInitialization();
    this.currentLang = lang;
  }

  /**
   * Clear module cache
   */
  async clearModuleCache(): Promise<void> {
    await this.dbService.clearCache();
    this.translations = {};
    await this.waitForInitialization();
  }

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    await this.dbService.clearDB();
    this.translations = {};
    await this.waitForInitialization();
  }

  private async waitForInitialization(): Promise<void> {
    if (!this.initPromise) {
      throw new Error('Translation service not initialized. Please provide configuration in your app.config.ts');
    }
    await this.initPromise;
  }

  private getTranslation(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      return this.getTranslationFallback(key);
    }

    const value = translation[this.currentLang];
    if (!value) {
      return this.getTranslationFallback(key);
    }

    return value;
  }

  private getTranslationFallback(key: string): string {
    const translation = this.translations[key];
    if (translation) {
      const languages = Object.keys(translation);
      if (languages.length > 0) {
        return translation[languages[0]];
      }
    }
    return key;
  }

  private async loadTranslations(config: TranslationConfig): Promise<void> {
    try {
      const response = {
        BTN_LOGIN: { en: "Logging from here", fr: "Connexion", it: "Accesso" },
        BTN_REGISTER: { en: "Register", fr: "S'inscrire", it: "Registrati" },
        BTN_LOGOUT: { en: "Logout", fr: "Déconnexion", it: "Disconnettersi" },
        BTN_PROFILE: { en: "Profile", fr: "Profil", it: "Profilo" },
      };

      const translations = response;
      for (const [key, value] of Object.entries(translations)) {
        await this.dbService.saveToCache(key, value);
        this.translations[key] = value;
      }
    } catch (error) {
      console.error("Error loading translations:", error);
      const cachedTranslations = await this.dbService.getAllFromCache();
      if (Object.keys(cachedTranslations).length > 0) {
        this.translations = cachedTranslations;
      } else {
        throw new Error("Failed to load translations from both API and cache");
      }
    }
  }
}

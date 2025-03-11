import * as i0 from '@angular/core';
import { Injectable, Optional, Inject, Pipe, NgModule } from '@angular/core';
import { openDB, deleteDB } from 'idb';

class TranslationDBService {
    db;
    async init() {
        try {
            this.db = await openDB('translations-db', 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains('translations')) {
                        db.createObjectStore('translations');
                    }
                },
            });
        }
        catch (error) {
            console.error('Error initializing translation database:', error);
            throw error;
        }
    }
    async saveToCache(key, value) {
        await this.db.put('translations', value, key);
    }
    async getFromCache(key) {
        return await this.db.get('translations', key);
    }
    async clearCache() {
        await this.db.clear('translations');
    }
    async clearDB() {
        await this.db.close();
        await deleteDB('translations-db');
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslationDBService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslationDBService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslationDBService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class TranslateService {
    dbService;
    currentLang = 'en';
    translations = {};
    initialized = false;
    config;
    constructor(dbService, config) {
        this.dbService = dbService;
        if (config) {
            this.init(config).catch(err => console.error('Failed to initialize translation service:', err));
        }
    }
    async init(config) {
        if (this.initialized) {
            return;
        }
        this.config = config;
        this.currentLang = config.defaultLang;
        try {
            await this.dbService.init();
            await this.loadTranslations();
            this.initialized = true;
        }
        catch (error) {
            console.error('Error initializing translation service:', error);
        }
    }
    async loadTranslations() {
        try {
            const translations = await this.fetchTranslations();
            for (const [key, value] of Object.entries(translations)) {
                await this.dbService.saveToCache(key, value);
                this.translations[key] = value;
            }
        }
        catch (error) {
            console.error('Error loading translations:', error);
        }
    }
    async fetchTranslations() {
        try {
            // Mock API call to fetch translations (replace with actual API in production)
            return {
                "BTN_LOGIN": { "en": "Logging from here", "fr": "Connexion", "it": "Accesso" },
                "BTN_REGISTER": { "en": "Register", "fr": "S'inscrire", "it": "Registrati" },
                "BTN_LOGOUT": { "en": "Logout", "fr": "Déconnexion", "it": "Disconnettersi" },
                "BTN_PROFILE": { "en": "Profile", "fr": "Profil", "it": "Profilo" }
            };
        }
        catch (error) {
            console.error('Error fetching translations:', error);
            return {};
        }
    }
    instant(key) {
        const translation = this.translations[key];
        return translation ? (translation[this.currentLang] || key) : key;
    }
    async setLanguage(lang) {
        this.currentLang = lang;
    }
    async clearModuleCache() {
        await this.dbService.clearCache();
        this.translations = {};
    }
    async clearAllCache() {
        await this.dbService.clearDB();
        this.translations = {};
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateService, deps: [{ token: TranslationDBService }, { token: 'TRANSLATE_CONFIG', optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: TranslationDBService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: ['TRANSLATE_CONFIG']
                }] }] });

class TranslatePipe {
    translateService;
    constructor(translateService) {
        this.translateService = translateService;
    }
    transform(key) {
        return this.translateService.instant(key);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslatePipe, deps: [{ token: TranslateService }], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "19.2.1", ngImport: i0, type: TranslatePipe, isStandalone: true, name: "appTranslate" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslatePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'appTranslate',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: TranslateService }] });

class TranslateDBModule {
    static forRoot(config) {
        return {
            ngModule: TranslateDBModule,
            providers: [
                {
                    provide: 'TRANSLATE_CONFIG',
                    useValue: config
                }
            ]
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateDBModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.2.1", ngImport: i0, type: TranslateDBModule, imports: [TranslatePipe], exports: [TranslatePipe] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateDBModule, providers: [TranslateService] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateDBModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [TranslatePipe],
                    exports: [TranslatePipe],
                    providers: [TranslateService]
                }]
        }] });

/*
 * Public API Surface of ngx-translate-db
 */

/**
 * Generated bundle index. Do not edit.
 */

export { TranslateDBModule, TranslatePipe, TranslateService };
//# sourceMappingURL=ngx-translate-db.mjs.map

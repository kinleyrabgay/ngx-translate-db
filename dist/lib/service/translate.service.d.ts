import { TranslationConfig } from '../interface/translation.interface';
import { TranslationDBService } from './translate-db.service';
import * as i0 from "@angular/core";
export declare class TranslateService {
    private dbService;
    private currentLang;
    private translations;
    private initialized;
    private config;
    constructor(dbService: TranslationDBService, config: TranslationConfig);
    init(config: TranslationConfig): Promise<void>;
    private loadTranslations;
    private fetchTranslations;
    instant(key: string): string;
    setLanguage(lang: string): Promise<void>;
    clearModuleCache(): Promise<void>;
    clearAllCache(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslateService, [null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TranslateService>;
}

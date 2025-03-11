import * as i0 from "@angular/core";
export declare class TranslationDBService {
    private db;
    init(): Promise<void>;
    saveToCache(key: string, value: {
        [lang: string]: string;
    }): Promise<void>;
    getFromCache(key: string): Promise<{
        [lang: string]: string;
    } | null>;
    clearCache(): Promise<void>;
    clearDB(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslationDBService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TranslationDBService>;
}

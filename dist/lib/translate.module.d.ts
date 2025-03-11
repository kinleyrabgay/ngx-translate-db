import { TranslationConfig } from './interface/translation.interface';
import * as i0 from "@angular/core";
import * as i1 from "./pipe/translate.pipe";
export declare class TranslateDBModule {
    static forRoot(config: TranslationConfig): {
        ngModule: typeof TranslateDBModule;
        providers: {
            provide: string;
            useValue: TranslationConfig;
        }[];
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslateDBModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<TranslateDBModule, never, [typeof i1.TranslatePipe], [typeof i1.TranslatePipe]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<TranslateDBModule>;
}

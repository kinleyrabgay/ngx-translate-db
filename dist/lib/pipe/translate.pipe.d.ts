import { PipeTransform } from '@angular/core';
import { TranslateService } from '../service/translate.service';
import * as i0 from "@angular/core";
export declare class TranslatePipe implements PipeTransform {
    private translateService;
    constructor(translateService: TranslateService);
    transform(key: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslatePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TranslatePipe, "appTranslate", true>;
}

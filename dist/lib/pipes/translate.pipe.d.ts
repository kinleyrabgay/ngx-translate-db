import { PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '../services/translate.service';
import * as i0 from "@angular/core";
/**
 * A pipe that translates text based on the current language setting.
 *
 * @remarks
 * This pipe returns an Observable<string> and must be used with the async pipe.
 * The async pipe automatically handles subscription cleanup, preventing memory leaks.
 *
 * Memory Management:
 * - Safe from memory leaks as the async pipe handles subscription cleanup
 * - Each pipe instance creates one subscription to onLangChange
 * - Subscriptions are automatically cleaned up when component is destroyed
 *
 * Performance:
 * - Uses startWith(null) to emit initial translation
 * - Only re-renders when language changes or key changes
 * - No manual change detection required
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * {{ 'TRANSLATION_KEY' | appTranslate | async }}
 *
 * <!-- With a variable -->
 * {{ myKey | appTranslate | async }}
 *
 * <!-- In an attribute -->
 * <div [title]="'TOOLTIP_KEY' | appTranslate | async">
 * ```
 *
 * @see {@link TranslateService} for the underlying translation service
 * @see {@link https://angular.io/api/common/AsyncPipe} for async pipe documentation
 */
export declare class TranslatePipe implements PipeTransform {
    private translateService;
    constructor(translateService: TranslateService);
    /**
     * Transforms a translation key into an Observable of translated text.
     *
     * @param key - The translation key to look up
     * @returns Observable<string> that emits the translated text whenever the language changes
     *
     * @example
     * ```typescript
     * // In your component
     * translatePipe.transform('MY_KEY').subscribe(translated => {
     *   console.log(translated);
     * });
     * ```
     */
    transform(key: string): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslatePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TranslatePipe, "appTranslate", true>;
}

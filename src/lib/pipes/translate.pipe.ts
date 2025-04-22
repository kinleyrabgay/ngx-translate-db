import { Pipe, PipeTransform } from '@angular/core';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '../services/translate.service';

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
@Pipe({
  name: 'appTranslate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

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
  transform(key: string, params?: Record<string, any>): Observable<string> {
    return this.translateService.onLangChange.pipe(
      startWith(null),
      map(() => this.translateService.instant(key, params))
    );
  }
}
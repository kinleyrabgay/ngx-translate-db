import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';

/**
 * Angular pipe for translating text using the TranslateService.
 * Provides a convenient way to translate text in templates.
 * 
 * @remarks
 * This pipe is pure and will only re-evaluate when its input changes.
 * It uses the synchronous `instant` method from TranslateService.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <p>{{ 'WELCOME_MESSAGE' | appTranslate }}</p>
 * 
 * <!-- With variables -->
 * <button>{{ 'BTN_LOGIN' | appTranslate }}</button>
 * ```
 */
@Pipe({
  name: 'appTranslate',
  standalone: true,
  pure: true
})
export class TranslatePipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  /**
   * Transforms a translation key into its translated value.
   * Uses the current language set in the TranslateService.
   * 
   * @param key - The translation key to look up
   * @returns The translated string or the key itself if translation is not found
   * @throws {Error} If the TranslateService is not initialized
   */
  transform(key: string): string {
    if (!key) {
      console.warn('Translation key is empty or undefined');
      return '';
    }
    
    try {
      return this.translateService.instant(key);
    } catch (error) {
      console.error('Error translating key:', key, error);
      return key;
    }
  }
} 
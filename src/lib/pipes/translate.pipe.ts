import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'appTranslate',
  standalone: true,
  pure: false // Make pipe impure to handle async updates
})
export class TranslatePipe implements PipeTransform {
  private lastKey: string = '';
  private lastValue: string = '';
  private loading: boolean = false;

  constructor(private translateService: TranslateService) {}

  async transform(key: string): Promise<string> {
    if (!key) return '';
    
    if (this.loading && this.lastKey === key) {
      return this.lastValue;
    }

    try {
      this.loading = true;
      this.lastKey = key;
      
      console.log(`[TranslatePipe] Attempting to translate key: ${key}`);
      const result = await this.translateService.instant(key);
      
      this.lastValue = result;
      console.log(`[TranslatePipe] Translation result for ${key}:`, result);
      
      return result;
    } catch (error) {
      console.error(`[TranslatePipe] Error translating key ${key}:`, error);
      return key;
    } finally {
      this.loading = false;
    }
  }
}

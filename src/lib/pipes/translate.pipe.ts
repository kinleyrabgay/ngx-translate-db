import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'appTranslate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(key: string): string {
    if (!key) return '';
    
    // Add logging to debug translation process
    console.log(`[TranslatePipe] Attempting to translate key: ${key}`);
    
    const result = this.translateService.instant(key);
    console.log(`[TranslatePipe] Translation result for ${key}:`, result);
    
    return result;
  }
} 
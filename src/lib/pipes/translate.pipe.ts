import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'appTranslate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private lastKey: string = '';
  private lastValue: string = '';

  constructor(private translateService: TranslateService) {}

  transform(key: string): string {
    if (key !== this.lastKey) {
      this.lastKey = key;
      try {
        this.lastValue = this.translateService.instant(key);
      } catch (error) {
        this.lastValue = key;
      }
    }
    return this.lastValue;
  }
} 
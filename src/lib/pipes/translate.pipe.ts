import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'appTranslate',
  standalone: true,
  pure: true
})
export class TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(key: string): string {
    if (!key) return '';
    return this.translateService.instant(key);
  }
}

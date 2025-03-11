import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateService } from '../services/translate.service';
import { catchError, map } from 'rxjs/operators';

@Pipe({
  name: 'appTranslate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(key: string): Observable<string> {
    if (!key) return of('');

    return this.translateService.instant(key).pipe(
      catchError(() => of(key)) 
    );
  }
}

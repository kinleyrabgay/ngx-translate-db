import { NgModule } from '@angular/core';
import { TranslatePipe } from './pipe/translate.pipe';
import { TranslateService } from './service/translate.service';
import { TranslationConfig } from './interface/translation.interface';

@NgModule({
  imports: [TranslatePipe],
  exports: [TranslatePipe],
  providers: [TranslateService]
})
export class TranslateDBModule {
  static forRoot(config: TranslationConfig) {
    return {
      ngModule: TranslateDBModule,
      providers: [
        {
          provide: 'TRANSLATE_CONFIG',
          useValue: config
        }
      ]
    };
  }
} 
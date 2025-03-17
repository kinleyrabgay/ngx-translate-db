import { APP_INITIALIZER, Provider } from "@angular/core";
import { TranslateService } from "../services/translate.service";
import { TranslationConfig } from "../interfaces/translation.interface";
import { TranslatePipe } from "../pipes/translate.pipe";

/**
 * Provides the translation service and its dependencies.
 * Sets up automatic initialization of the service.
 * 
 * @param config - Translation service configuration
 * @returns Array of providers for the translation service
 * 
 * @example
 * ```typescript
 * // In app.config.ts
 * import { ApplicationConfig } from '@angular/core';
 * import { provideTranslate } from 'ngx-translate-db';
 * 
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTranslate({
 *       projectId: 'my-app',
 *       endpoint: 'https://api.translations.com/v1',
 *       defaultLang: 'en'
 *     })
 *   ]
 * };
 * ```
 */
export function provideTranslate(config: TranslationConfig): Provider[] {
  return [
    TranslateService,
    TranslatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: (translateService: TranslateService) => () => translateService.init(config),
      deps: [TranslateService],
      multi: true
    }
  ];
}

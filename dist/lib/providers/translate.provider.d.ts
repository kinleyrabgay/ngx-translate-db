import { Provider } from "@angular/core";
import { TranslationConfig } from "../interfaces/translation.interface";
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
export declare function provideTranslate(config: TranslationConfig): Provider[];

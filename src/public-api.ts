/*
 * Public API Surface of ngx-translate-db
 */
export { TranslateService } from "./lib/services/translate.service";
export { TranslatePipe } from "./lib/pipes/translate.pipe";
export { provideTranslate } from "./lib/providers/translate.provider";
export {
  TranslationConfig,
  TranslationValue,
  TranslationLanguage,
  Translations,
} from "./lib/interfaces/translation.interface";

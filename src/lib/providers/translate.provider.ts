import { APP_INITIALIZER, Provider } from "@angular/core";
import { TranslateService } from "../services/translate.service";
import { TranslationConfig } from "../interfaces/translation.interface";
import { TranslatePipe } from "../pipes/translate.pipe";

export function initializeTranslation(translateService: TranslateService, config: TranslationConfig) {
  return () => translateService.init(config);
}

export function provideTranslate(config: TranslationConfig): Provider[] {
  return [
    TranslateService,
    TranslatePipe,
    {
      provide: "TRANSLATE_CONFIG",
      useValue: config,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (translateService: TranslateService, config: TranslationConfig) => initializeTranslation(translateService, config),
      deps: [TranslateService, "TRANSLATE_CONFIG"],
      multi: true,
    },
  ];
}

import { APP_INITIALIZER, Provider } from "@angular/core";
import { TranslateService } from "../services/translate.service";
import { TranslationConfig } from "../interfaces/translation.interface";
import { TranslatePipe } from "../pipes/translate.pipe";

export function provideTranslate(config: TranslationConfig): Provider[] {
  return [
    TranslateService,
    TranslatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: (service: TranslateService) => {
        console.log('initializeTranslation', service, config);
        return () => service.init(config);
      },
      deps: [TranslateService],
      multi: true
    }
  ];
}

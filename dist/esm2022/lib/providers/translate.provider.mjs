import { APP_INITIALIZER } from "@angular/core";
import { TranslateService } from "../services/translate.service";
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
export function provideTranslate(config) {
    return [
        TranslateService,
        TranslatePipe,
        {
            provide: APP_INITIALIZER,
            useFactory: (translateService) => () => translateService.init(config),
            deps: [TranslateService],
            multi: true
        }
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm92aWRlcnMvdHJhbnNsYXRlLnByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQWlDLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRWpFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUV4RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsTUFBeUI7SUFDeEQsT0FBTztRQUNMLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2I7WUFDRSxPQUFPLEVBQUUsZUFBZTtZQUN4QixVQUFVLEVBQUUsQ0FBQyxnQkFBa0MsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2RixJQUFJLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUN4QixLQUFLLEVBQUUsSUFBSTtTQUNaO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUFBfSU5JVElBTElaRVIsIE1vZHVsZVdpdGhQcm92aWRlcnMsIFByb3ZpZGVyIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvdHJhbnNsYXRlLnNlcnZpY2VcIjtcbmltcG9ydCB7IFRyYW5zbGF0aW9uQ29uZmlnIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvdHJhbnNsYXRpb24uaW50ZXJmYWNlXCI7XG5pbXBvcnQgeyBUcmFuc2xhdGVQaXBlIH0gZnJvbSBcIi4uL3BpcGVzL3RyYW5zbGF0ZS5waXBlXCI7XG5cbi8qKlxuICogUHJvdmlkZXMgdGhlIHRyYW5zbGF0aW9uIHNlcnZpY2UgYW5kIGl0cyBkZXBlbmRlbmNpZXMuXG4gKiBTZXRzIHVwIGF1dG9tYXRpYyBpbml0aWFsaXphdGlvbiBvZiB0aGUgc2VydmljZS5cbiAqIFxuICogQHBhcmFtIGNvbmZpZyAtIFRyYW5zbGF0aW9uIHNlcnZpY2UgY29uZmlndXJhdGlvblxuICogQHJldHVybnMgQXJyYXkgb2YgcHJvdmlkZXJzIGZvciB0aGUgdHJhbnNsYXRpb24gc2VydmljZVxuICogXG4gKiBAZXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gSW4gYXBwLmNvbmZpZy50c1xuICogaW1wb3J0IHsgQXBwbGljYXRpb25Db25maWcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAqIGltcG9ydCB7IHByb3ZpZGVUcmFuc2xhdGUgfSBmcm9tICduZ3gtdHJhbnNsYXRlLWRiJztcbiAqIFxuICogZXhwb3J0IGNvbnN0IGFwcENvbmZpZzogQXBwbGljYXRpb25Db25maWcgPSB7XG4gKiAgIHByb3ZpZGVyczogW1xuICogICAgIHByb3ZpZGVUcmFuc2xhdGUoe1xuICogICAgICAgcHJvamVjdElkOiAnbXktYXBwJyxcbiAqICAgICAgIGVuZHBvaW50OiAnaHR0cHM6Ly9hcGkudHJhbnNsYXRpb25zLmNvbS92MScsXG4gKiAgICAgICBkZWZhdWx0TGFuZzogJ2VuJ1xuICogICAgIH0pXG4gKiAgIF1cbiAqIH07XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVUcmFuc2xhdGUoY29uZmlnOiBUcmFuc2xhdGlvbkNvbmZpZyk6IFByb3ZpZGVyW10ge1xuICByZXR1cm4gW1xuICAgIFRyYW5zbGF0ZVNlcnZpY2UsXG4gICAgVHJhbnNsYXRlUGlwZSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXG4gICAgICB1c2VGYWN0b3J5OiAodHJhbnNsYXRlU2VydmljZTogVHJhbnNsYXRlU2VydmljZSkgPT4gKCkgPT4gdHJhbnNsYXRlU2VydmljZS5pbml0KGNvbmZpZyksXG4gICAgICBkZXBzOiBbVHJhbnNsYXRlU2VydmljZV0sXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXTtcbn1cbiJdfQ==
import { Pipe } from '@angular/core';
import { startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../services/translate.service";
/**
 * A pipe that translates text based on the current language setting.
 *
 * @remarks
 * This pipe returns an Observable<string> and must be used with the async pipe.
 * The async pipe automatically handles subscription cleanup, preventing memory leaks.
 *
 * Memory Management:
 * - Safe from memory leaks as the async pipe handles subscription cleanup
 * - Each pipe instance creates one subscription to onLangChange
 * - Subscriptions are automatically cleaned up when component is destroyed
 *
 * Performance:
 * - Uses startWith(null) to emit initial translation
 * - Only re-renders when language changes or key changes
 * - No manual change detection required
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * {{ 'TRANSLATION_KEY' | appTranslate | async }}
 *
 * <!-- With a variable -->
 * {{ myKey | appTranslate | async }}
 *
 * <!-- In an attribute -->
 * <div [title]="'TOOLTIP_KEY' | appTranslate | async">
 * ```
 *
 * @see {@link TranslateService} for the underlying translation service
 * @see {@link https://angular.io/api/common/AsyncPipe} for async pipe documentation
 */
export class TranslatePipe {
    translateService;
    constructor(translateService) {
        this.translateService = translateService;
    }
    /**
     * Transforms a translation key into an Observable of translated text.
     *
     * @param key - The translation key to look up
     * @returns Observable<string> that emits the translated text whenever the language changes
     *
     * @example
     * ```typescript
     * // In your component
     * translatePipe.transform('MY_KEY').subscribe(translated => {
     *   console.log(translated);
     * });
     * ```
     */
    transform(key) {
        return this.translateService.onLangChange.pipe(startWith(null), map(() => this.translateService.instant(key)));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslatePipe, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: TranslatePipe, isStandalone: true, name: "appTranslate" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslatePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'appTranslate',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i1.TranslateService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3BpcGVzL3RyYW5zbGF0ZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBYyxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFHckM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFLSCxNQUFNLE9BQU8sYUFBYTtJQUNKO0lBQXBCLFlBQW9CLGdCQUFrQztRQUFsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO0lBQUcsQ0FBQztJQUUxRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0gsU0FBUyxDQUFDLEdBQVc7UUFDbkIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FDNUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUNmLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQzlDLENBQUM7SUFDSixDQUFDO3dHQXRCVSxhQUFhO3NHQUFiLGFBQWE7OzRGQUFiLGFBQWE7a0JBSnpCLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS5zZXJ2aWNlJztcblxuLyoqXG4gKiBBIHBpcGUgdGhhdCB0cmFuc2xhdGVzIHRleHQgYmFzZWQgb24gdGhlIGN1cnJlbnQgbGFuZ3VhZ2Ugc2V0dGluZy5cbiAqIFxuICogQHJlbWFya3NcbiAqIFRoaXMgcGlwZSByZXR1cm5zIGFuIE9ic2VydmFibGU8c3RyaW5nPiBhbmQgbXVzdCBiZSB1c2VkIHdpdGggdGhlIGFzeW5jIHBpcGUuXG4gKiBUaGUgYXN5bmMgcGlwZSBhdXRvbWF0aWNhbGx5IGhhbmRsZXMgc3Vic2NyaXB0aW9uIGNsZWFudXAsIHByZXZlbnRpbmcgbWVtb3J5IGxlYWtzLlxuICogXG4gKiBNZW1vcnkgTWFuYWdlbWVudDpcbiAqIC0gU2FmZSBmcm9tIG1lbW9yeSBsZWFrcyBhcyB0aGUgYXN5bmMgcGlwZSBoYW5kbGVzIHN1YnNjcmlwdGlvbiBjbGVhbnVwXG4gKiAtIEVhY2ggcGlwZSBpbnN0YW5jZSBjcmVhdGVzIG9uZSBzdWJzY3JpcHRpb24gdG8gb25MYW5nQ2hhbmdlXG4gKiAtIFN1YnNjcmlwdGlvbnMgYXJlIGF1dG9tYXRpY2FsbHkgY2xlYW5lZCB1cCB3aGVuIGNvbXBvbmVudCBpcyBkZXN0cm95ZWRcbiAqIFxuICogUGVyZm9ybWFuY2U6XG4gKiAtIFVzZXMgc3RhcnRXaXRoKG51bGwpIHRvIGVtaXQgaW5pdGlhbCB0cmFuc2xhdGlvblxuICogLSBPbmx5IHJlLXJlbmRlcnMgd2hlbiBsYW5ndWFnZSBjaGFuZ2VzIG9yIGtleSBjaGFuZ2VzXG4gKiAtIE5vIG1hbnVhbCBjaGFuZ2UgZGV0ZWN0aW9uIHJlcXVpcmVkXG4gKiBcbiAqIEBleGFtcGxlXG4gKiBgYGBodG1sXG4gKiA8IS0tIEJhc2ljIHVzYWdlIC0tPlxuICoge3sgJ1RSQU5TTEFUSU9OX0tFWScgfCBhcHBUcmFuc2xhdGUgfCBhc3luYyB9fVxuICogXG4gKiA8IS0tIFdpdGggYSB2YXJpYWJsZSAtLT5cbiAqIHt7IG15S2V5IHwgYXBwVHJhbnNsYXRlIHwgYXN5bmMgfX1cbiAqIFxuICogPCEtLSBJbiBhbiBhdHRyaWJ1dGUgLS0+XG4gKiA8ZGl2IFt0aXRsZV09XCInVE9PTFRJUF9LRVknIHwgYXBwVHJhbnNsYXRlIHwgYXN5bmNcIj5cbiAqIGBgYFxuICogXG4gKiBAc2VlIHtAbGluayBUcmFuc2xhdGVTZXJ2aWNlfSBmb3IgdGhlIHVuZGVybHlpbmcgdHJhbnNsYXRpb24gc2VydmljZVxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9jb21tb24vQXN5bmNQaXBlfSBmb3IgYXN5bmMgcGlwZSBkb2N1bWVudGF0aW9uXG4gKi9cbkBQaXBlKHtcbiAgbmFtZTogJ2FwcFRyYW5zbGF0ZScsXG4gIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRyYW5zbGF0ZVNlcnZpY2U6IFRyYW5zbGF0ZVNlcnZpY2UpIHt9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgYSB0cmFuc2xhdGlvbiBrZXkgaW50byBhbiBPYnNlcnZhYmxlIG9mIHRyYW5zbGF0ZWQgdGV4dC5cbiAgICogXG4gICAqIEBwYXJhbSBrZXkgLSBUaGUgdHJhbnNsYXRpb24ga2V5IHRvIGxvb2sgdXBcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZTxzdHJpbmc+IHRoYXQgZW1pdHMgdGhlIHRyYW5zbGF0ZWQgdGV4dCB3aGVuZXZlciB0aGUgbGFuZ3VhZ2UgY2hhbmdlc1xuICAgKiBcbiAgICogQGV4YW1wbGVcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiAvLyBJbiB5b3VyIGNvbXBvbmVudFxuICAgKiB0cmFuc2xhdGVQaXBlLnRyYW5zZm9ybSgnTVlfS0VZJykuc3Vic2NyaWJlKHRyYW5zbGF0ZWQgPT4ge1xuICAgKiAgIGNvbnNvbGUubG9nKHRyYW5zbGF0ZWQpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqL1xuICB0cmFuc2Zvcm0oa2V5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlcnZpY2Uub25MYW5nQ2hhbmdlLnBpcGUoXG4gICAgICBzdGFydFdpdGgobnVsbCksXG4gICAgICBtYXAoKCkgPT4gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmluc3RhbnQoa2V5KSlcbiAgICApO1xuICB9XG59Il19
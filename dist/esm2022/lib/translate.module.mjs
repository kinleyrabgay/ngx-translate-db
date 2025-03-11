import { NgModule } from '@angular/core';
import { TranslatePipe } from './pipe/translate.pipe';
import { TranslateService } from './service/translate.service';
import * as i0 from "@angular/core";
export class TranslateDBModule {
    static forRoot(config) {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateDBModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.2.1", ngImport: i0, type: TranslateDBModule, imports: [TranslatePipe], exports: [TranslatePipe] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateDBModule, providers: [TranslateService] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateDBModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [TranslatePipe],
                    exports: [TranslatePipe],
                    providers: [TranslateService]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdHJhbnNsYXRlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7QUFRL0QsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQXlCO1FBQ3RDLE9BQU87WUFDTCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsa0JBQWtCO29CQUMzQixRQUFRLEVBQUUsTUFBTTtpQkFDakI7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO3VHQVhVLGlCQUFpQjt3R0FBakIsaUJBQWlCLFlBSmxCLGFBQWEsYUFDYixhQUFhO3dHQUdaLGlCQUFpQixhQUZqQixDQUFDLGdCQUFnQixDQUFDOzsyRkFFbEIsaUJBQWlCO2tCQUw3QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDeEIsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUN4QixTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHJhbnNsYXRlUGlwZSB9IGZyb20gJy4vcGlwZS90cmFuc2xhdGUucGlwZSc7XG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlL3RyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IFRyYW5zbGF0aW9uQ29uZmlnIH0gZnJvbSAnLi9pbnRlcmZhY2UvdHJhbnNsYXRpb24uaW50ZXJmYWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1RyYW5zbGF0ZVBpcGVdLFxuICBleHBvcnRzOiBbVHJhbnNsYXRlUGlwZV0sXG4gIHByb3ZpZGVyczogW1RyYW5zbGF0ZVNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0ZURCTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnOiBUcmFuc2xhdGlvbkNvbmZpZykge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogVHJhbnNsYXRlREJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6ICdUUkFOU0xBVEVfQ09ORklHJyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59ICJdfQ==
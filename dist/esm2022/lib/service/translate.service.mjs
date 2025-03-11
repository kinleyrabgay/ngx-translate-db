import { Injectable, Inject, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./translate-db.service";
export class TranslateService {
    dbService;
    currentLang = 'en';
    translations = {};
    initialized = false;
    config;
    constructor(dbService, config) {
        this.dbService = dbService;
        if (config) {
            this.init(config).catch(err => console.error('Failed to initialize translation service:', err));
        }
    }
    async init(config) {
        if (this.initialized) {
            return;
        }
        this.config = config;
        this.currentLang = config.defaultLang;
        try {
            await this.dbService.init();
            await this.loadTranslations();
            this.initialized = true;
        }
        catch (error) {
            console.error('Error initializing translation service:', error);
        }
    }
    async loadTranslations() {
        try {
            const translations = await this.fetchTranslations();
            for (const [key, value] of Object.entries(translations)) {
                await this.dbService.saveToCache(key, value);
                this.translations[key] = value;
            }
        }
        catch (error) {
            console.error('Error loading translations:', error);
        }
    }
    async fetchTranslations() {
        try {
            // Mock API call to fetch translations (replace with actual API in production)
            return {
                "BTN_LOGIN": { "en": "Logging from here", "fr": "Connexion", "it": "Accesso" },
                "BTN_REGISTER": { "en": "Register", "fr": "S'inscrire", "it": "Registrati" },
                "BTN_LOGOUT": { "en": "Logout", "fr": "Déconnexion", "it": "Disconnettersi" },
                "BTN_PROFILE": { "en": "Profile", "fr": "Profil", "it": "Profilo" }
            };
        }
        catch (error) {
            console.error('Error fetching translations:', error);
            return {};
        }
    }
    instant(key) {
        const translation = this.translations[key];
        return translation ? (translation[this.currentLang] || key) : key;
    }
    async setLanguage(lang) {
        this.currentLang = lang;
    }
    async clearModuleCache() {
        await this.dbService.clearCache();
        this.translations = {};
    }
    async clearAllCache() {
        await this.dbService.clearDB();
        this.translations = {};
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateService, deps: [{ token: i1.TranslationDBService }, { token: 'TRANSLATE_CONFIG', optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TranslateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.TranslationDBService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: ['TRANSLATE_CONFIG']
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2UvdHJhbnNsYXRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFPN0QsTUFBTSxPQUFPLGdCQUFnQjtJQU9qQjtJQU5GLFdBQVcsR0FBVyxJQUFJLENBQUM7SUFDM0IsWUFBWSxHQUF3QyxFQUFFLENBQUM7SUFDdkQsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNwQixNQUFNLENBQXFCO0lBRW5DLFlBQ1UsU0FBK0IsRUFDQyxNQUF5QjtRQUR6RCxjQUFTLEdBQVQsU0FBUyxDQUFzQjtRQUd2QyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEcsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQXlCO1FBQ2xDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JCLE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBRXRDLElBQUksQ0FBQztZQUNILE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QixNQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQzFCLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxDQUFDO0lBQ0gsQ0FBQztJQUVPLEtBQUssQ0FBQyxnQkFBZ0I7UUFDNUIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNwRCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO2dCQUN4RCxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDakMsQ0FBQztRQUNILENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RCxDQUFDO0lBQ0gsQ0FBQztJQUVPLEtBQUssQ0FBQyxpQkFBaUI7UUFDN0IsSUFBSSxDQUFDO1lBQ0gsOEVBQThFO1lBQzlFLE9BQU87Z0JBQ0wsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtnQkFDOUUsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUU7Z0JBQzVFLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQzdFLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO2FBQ3BFLENBQUM7UUFDSixDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckQsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFXO1FBQ2pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0MsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLElBQVk7UUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssQ0FBQyxnQkFBZ0I7UUFDcEIsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYTtRQUNqQixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDekIsQ0FBQzt1R0E1RVUsZ0JBQWdCLHNEQVFMLGtCQUFrQjsyR0FSN0IsZ0JBQWdCLGNBRmYsTUFBTTs7MkZBRVAsZ0JBQWdCO2tCQUg1QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBU0ksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUcmFuc2xhdGlvbkNvbmZpZywgVHJhbnNsYXRpb25WYWx1ZSB9IGZyb20gJy4uL2ludGVyZmFjZS90cmFuc2xhdGlvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgVHJhbnNsYXRpb25EQlNlcnZpY2UgfSBmcm9tICcuL3RyYW5zbGF0ZS1kYi5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlU2VydmljZSB7XG4gIHByaXZhdGUgY3VycmVudExhbmc6IHN0cmluZyA9ICdlbic7XG4gIHByaXZhdGUgdHJhbnNsYXRpb25zOiB7IFtrZXk6IHN0cmluZ106IFRyYW5zbGF0aW9uVmFsdWUgfSA9IHt9O1xuICBwcml2YXRlIGluaXRpYWxpemVkID0gZmFsc2U7XG4gIHByaXZhdGUgY29uZmlnITogVHJhbnNsYXRpb25Db25maWc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBkYlNlcnZpY2U6IFRyYW5zbGF0aW9uREJTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoJ1RSQU5TTEFURV9DT05GSUcnKSBjb25maWc6IFRyYW5zbGF0aW9uQ29uZmlnXG4gICkge1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuaW5pdChjb25maWcpLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSB0cmFuc2xhdGlvbiBzZXJ2aWNlOicsIGVycikpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluaXQoY29uZmlnOiBUcmFuc2xhdGlvbkNvbmZpZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5jdXJyZW50TGFuZyA9IGNvbmZpZy5kZWZhdWx0TGFuZztcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmRiU2VydmljZS5pbml0KCk7XG4gICAgICBhd2FpdCB0aGlzLmxvYWRUcmFuc2xhdGlvbnMoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbml0aWFsaXppbmcgdHJhbnNsYXRpb24gc2VydmljZTonLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2FkVHJhbnNsYXRpb25zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSBhd2FpdCB0aGlzLmZldGNoVHJhbnNsYXRpb25zKCk7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh0cmFuc2xhdGlvbnMpKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZGJTZXJ2aWNlLnNhdmVUb0NhY2hlKGtleSwgdmFsdWUpO1xuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uc1trZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGxvYWRpbmcgdHJhbnNsYXRpb25zOicsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGZldGNoVHJhbnNsYXRpb25zKCk6IFByb21pc2U8eyBba2V5OiBzdHJpbmddOiBUcmFuc2xhdGlvblZhbHVlIH0+IHtcbiAgICB0cnkge1xuICAgICAgLy8gTW9jayBBUEkgY2FsbCB0byBmZXRjaCB0cmFuc2xhdGlvbnMgKHJlcGxhY2Ugd2l0aCBhY3R1YWwgQVBJIGluIHByb2R1Y3Rpb24pXG4gICAgICByZXR1cm4ge1xuICAgICAgICBcIkJUTl9MT0dJTlwiOiB7IFwiZW5cIjogXCJMb2dnaW5nIGZyb20gaGVyZVwiLCBcImZyXCI6IFwiQ29ubmV4aW9uXCIsIFwiaXRcIjogXCJBY2Nlc3NvXCIgfSxcbiAgICAgICAgXCJCVE5fUkVHSVNURVJcIjogeyBcImVuXCI6IFwiUmVnaXN0ZXJcIiwgXCJmclwiOiBcIlMnaW5zY3JpcmVcIiwgXCJpdFwiOiBcIlJlZ2lzdHJhdGlcIiB9LFxuICAgICAgICBcIkJUTl9MT0dPVVRcIjogeyBcImVuXCI6IFwiTG9nb3V0XCIsIFwiZnJcIjogXCJEw6ljb25uZXhpb25cIiwgXCJpdFwiOiBcIkRpc2Nvbm5ldHRlcnNpXCIgfSxcbiAgICAgICAgXCJCVE5fUFJPRklMRVwiOiB7IFwiZW5cIjogXCJQcm9maWxlXCIsIFwiZnJcIjogXCJQcm9maWxcIiwgXCJpdFwiOiBcIlByb2ZpbG9cIiB9XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyB0cmFuc2xhdGlvbnM6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIGluc3RhbnQoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRyYW5zbGF0aW9uID0gdGhpcy50cmFuc2xhdGlvbnNba2V5XTtcbiAgICByZXR1cm4gdHJhbnNsYXRpb24gPyAodHJhbnNsYXRpb25bdGhpcy5jdXJyZW50TGFuZ10gfHwga2V5KSA6IGtleTtcbiAgfVxuXG4gIGFzeW5jIHNldExhbmd1YWdlKGxhbmc6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY3VycmVudExhbmcgPSBsYW5nO1xuICB9XG5cbiAgYXN5bmMgY2xlYXJNb2R1bGVDYWNoZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmRiU2VydmljZS5jbGVhckNhY2hlKCk7XG4gICAgdGhpcy50cmFuc2xhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGFzeW5jIGNsZWFyQWxsQ2FjaGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5kYlNlcnZpY2UuY2xlYXJEQigpO1xuICAgIHRoaXMudHJhbnNsYXRpb25zID0ge307XG4gIH1cbn1cbiJdfQ==
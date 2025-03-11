import { Injectable } from '@angular/core';
import { openDB, deleteDB } from 'idb';
import * as i0 from "@angular/core";
export class TranslationDBService {
    db;
    async init() {
        try {
            this.db = await openDB('translations-db', 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains('translations')) {
                        db.createObjectStore('translations');
                    }
                },
            });
        }
        catch (error) {
            console.error('Error initializing translation database:', error);
            throw error;
        }
    }
    async saveToCache(key, value) {
        await this.db.put('translations', value, key);
    }
    async getFromCache(key) {
        return await this.db.get('translations', key);
    }
    async clearCache() {
        await this.db.clear('translations');
    }
    async clearDB() {
        await this.db.close();
        await deleteDB('translations-db');
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslationDBService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslationDBService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TranslationDBService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLWRiLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2UvdHJhbnNsYXRlLWRiLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFnQixRQUFRLEVBQUUsTUFBTSxLQUFLLENBQUM7O0FBS3JELE1BQU0sT0FBTyxvQkFBb0I7SUFDdkIsRUFBRSxDQUFnQjtJQUUxQixLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksQ0FBQztZQUNILElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFO2dCQUMzQyxPQUFPLENBQUMsRUFBRTtvQkFDUixJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO3dCQUNsRCxFQUFFLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ3ZDLENBQUM7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNqRSxNQUFNLEtBQUssQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFXLEVBQUUsS0FBaUM7UUFDOUQsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQVc7UUFDNUIsT0FBTyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVU7UUFDZCxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNYLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixNQUFNLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7d0dBakNVLG9CQUFvQjs0R0FBcEIsb0JBQW9CLGNBRm5CLE1BQU07OzRGQUVQLG9CQUFvQjtrQkFIaEMsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBvcGVuREIsIElEQlBEYXRhYmFzZSwgZGVsZXRlREIgfSBmcm9tICdpZGInO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbkRCU2VydmljZSB7XG4gIHByaXZhdGUgZGIhOiBJREJQRGF0YWJhc2U7XG5cbiAgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5kYiA9IGF3YWl0IG9wZW5EQigndHJhbnNsYXRpb25zLWRiJywgMSwge1xuICAgICAgICB1cGdyYWRlKGRiKSB7XG4gICAgICAgICAgaWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKCd0cmFuc2xhdGlvbnMnKSkge1xuICAgICAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3RyYW5zbGF0aW9ucycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbml0aWFsaXppbmcgdHJhbnNsYXRpb24gZGF0YWJhc2U6JywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2F2ZVRvQ2FjaGUoa2V5OiBzdHJpbmcsIHZhbHVlOiB7IFtsYW5nOiBzdHJpbmddOiBzdHJpbmcgfSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZGIucHV0KCd0cmFuc2xhdGlvbnMnLCB2YWx1ZSwga2V5KTtcbiAgfVxuXG4gIGFzeW5jIGdldEZyb21DYWNoZShrZXk6IHN0cmluZyk6IFByb21pc2U8eyBbbGFuZzogc3RyaW5nXTogc3RyaW5nIH0gfCBudWxsPiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZGIuZ2V0KCd0cmFuc2xhdGlvbnMnLCBrZXkpO1xuICB9XG5cbiAgYXN5bmMgY2xlYXJDYWNoZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmRiLmNsZWFyKCd0cmFuc2xhdGlvbnMnKTtcbiAgfVxuXG4gIGFzeW5jIGNsZWFyREIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5kYi5jbG9zZSgpO1xuICAgIGF3YWl0IGRlbGV0ZURCKCd0cmFuc2xhdGlvbnMtZGInKTtcbiAgfVxufVxuIl19
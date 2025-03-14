import { Injectable } from '@angular/core';
import { openDB, deleteDB } from 'idb';
import * as i0 from "@angular/core";
/**
 * Service responsible for managing translation data in IndexedDB.
 * Provides methods for caching and retrieving translations.
 *
 * @remarks
 * This service uses the 'idb' library for IndexedDB operations.
 * All operations are asynchronous and return Promises.
 */
export class TranslationDBService {
    /** IndexedDB database instance */
    db;
    /** Default store name for translations */
    STORE_NAME = 'translations';
    /** Default database name */
    DEFAULT_DB_NAME = 'translations-db';
    /** Default database version */
    DB_VERSION = 1;
    /**
     * Initializes the IndexedDB database for translations.
     * Creates the necessary object store if it doesn't exist.
     *
     * @param config - Optional configuration for database setup
     * @throws {Error} If database initialization fails
     */
    async init(config) {
        try {
            const dbName = config?.dbName ?? this.DEFAULT_DB_NAME;
            this.db = await openDB(dbName, this.DB_VERSION, {
                upgrade: (db) => this.createObjectStore(db),
                blocked: () => {
                    console.warn('Database upgrade blocked. Please close other tabs using this app.');
                },
                blocking: () => {
                    this.db.close();
                    console.warn('Database version change detected. Please reload the page.');
                },
            });
        }
        catch (error) {
            console.error('Error initializing translation database:', error);
        }
    }
    /**
     * Saves a translation value to the cache.
     *
     * @param key - Translation key
     * @param value - Translation value object
     * @throws {Error} If the database is not initialized or save fails
     */
    async saveToCache(key, value) {
        this.ensureDBInitialized();
        try {
            await this.db.put(this.STORE_NAME, value, key);
        }
        catch (error) {
            console.error('Error saving translation to cache:', error);
        }
    }
    /**
     * Retrieves a translation value from the cache.
     *
     * @param key - Translation key to retrieve
     * @returns Promise resolving to the translation value or null if not found
     * @throws {Error} If the database is not initialized
     */
    async getFromCache(key) {
        this.ensureDBInitialized();
        try {
            return await this.db.get(this.STORE_NAME, key);
        }
        catch (error) {
            console.error('Error retrieving translation from cache:', error);
            return null;
        }
    }
    /**
     * Retrieves all translations from the cache.
     *
     * @returns Promise resolving to an object containing all translations
     * @throws {Error} If the database is not initialized
     */
    async getAllFromCache() {
        this.ensureDBInitialized();
        try {
            const allEntries = await this.db.getAll(this.STORE_NAME);
            const allKeys = await this.db.getAllKeys(this.STORE_NAME);
            return allEntries.reduce((acc, value, index) => {
                const key = allKeys[index]?.toString();
                if (key) {
                    acc[key] = value;
                }
                return acc;
            }, {});
        }
        catch (error) {
            console.error('Error retrieving all translations from cache:', error);
            return {};
        }
    }
    /**
     * Clears all translations from the cache.
     *
     * @throws {Error} If the database is not initialized or clear fails
     */
    async clearCache() {
        this.ensureDBInitialized();
        try {
            await this.db.clear(this.STORE_NAME);
        }
        catch (error) {
            console.error('Error clearing translation cache:', error);
        }
    }
    /**
     * Deletes the entire database.
     * Closes the current connection before deletion.
     *
     * @throws {Error} If database deletion fails
     */
    async clearDB() {
        try {
            if (this.db) {
                const dbName = this.db.name;
                await this.db.close();
                await deleteDB(dbName);
                this.db = null;
            }
        }
        catch (error) {
            console.error('Error deleting translation database:', error);
        }
    }
    /**
     * Creates the translations object store in the database.
     *
     * @param db - IndexedDB database instance
     * @private
     */
    createObjectStore(db) {
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            db.createObjectStore(this.STORE_NAME);
        }
    }
    /**
     * Ensures the database is initialized before operations.
     *
     * @throws {Error} If the database is not initialized
     * @private
     */
    ensureDBInitialized() {
        if (!this.db) {
            console.warn('Translation database not initialized. Call init() first.');
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLWRiLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL3RyYW5zbGF0ZS1kYi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBZ0IsUUFBUSxFQUFFLE1BQU0sS0FBSyxDQUFDOztBQUdyRDs7Ozs7OztHQU9HO0FBSUgsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixrQ0FBa0M7SUFDMUIsRUFBRSxDQUFnQjtJQUUxQiwwQ0FBMEM7SUFDekIsVUFBVSxHQUFHLGNBQWMsQ0FBQztJQUU3Qyw0QkFBNEI7SUFDWCxlQUFlLEdBQUcsaUJBQWlCLENBQUM7SUFFckQsK0JBQStCO0lBQ2QsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUVoQzs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQTBCO1FBQ25DLElBQUksQ0FBQztZQUNILE1BQU0sTUFBTSxHQUFHLE1BQU0sRUFBRSxNQUFNLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUV0RCxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUM5QyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUM7Z0JBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUU7b0JBQ1osT0FBTyxDQUFDLElBQUksQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO2dCQUNwRixDQUFDO2dCQUNELFFBQVEsRUFBRSxHQUFHLEVBQUU7b0JBQ2IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDaEIsT0FBTyxDQUFDLElBQUksQ0FBQywyREFBMkQsQ0FBQyxDQUFDO2dCQUM1RSxD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QUFDO2dCQUN0QixNQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFXLENBQUM7WUFDeEIsQ0FBQztRQUNILENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssaUJBQWlCLENBQUMsRUFBZ0I7UUFDeEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDbkQsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssbUJBQW1CO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsSUFBSSxDQUFDLDBEQUEwRCxDQUFDLENBQUM7UUFDM0UsQ0FBQztJQUNILENBQUM7d0dBeEpVLG9CQUFvQjs0R0FBcEIsb0JBQW9CLGNBRm5CLE1BQU07OzRGQUVQLG9CQUFvQjtrQkFIaEMsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBvcGVuREIsIElEQlBEYXRhYmFzZSwgZGVsZXRlREIgfSBmcm9tICdpZGInO1xuaW1wb3J0IHsgVHJhbnNsYXRpb25Db25maWcsIFRyYW5zbGF0aW9uVmFsdWUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL3RyYW5zbGF0aW9uLmludGVyZmFjZSc7XG5cbi8qKlxuICogU2VydmljZSByZXNwb25zaWJsZSBmb3IgbWFuYWdpbmcgdHJhbnNsYXRpb24gZGF0YSBpbiBJbmRleGVkREIuXG4gKiBQcm92aWRlcyBtZXRob2RzIGZvciBjYWNoaW5nIGFuZCByZXRyaWV2aW5nIHRyYW5zbGF0aW9ucy5cbiAqIFxuICogQHJlbWFya3NcbiAqIFRoaXMgc2VydmljZSB1c2VzIHRoZSAnaWRiJyBsaWJyYXJ5IGZvciBJbmRleGVkREIgb3BlcmF0aW9ucy5cbiAqIEFsbCBvcGVyYXRpb25zIGFyZSBhc3luY2hyb25vdXMgYW5kIHJldHVybiBQcm9taXNlcy5cbiAqL1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRpb25EQlNlcnZpY2Uge1xuICAvKiogSW5kZXhlZERCIGRhdGFiYXNlIGluc3RhbmNlICovXG4gIHByaXZhdGUgZGIhOiBJREJQRGF0YWJhc2U7XG4gIFxuICAvKiogRGVmYXVsdCBzdG9yZSBuYW1lIGZvciB0cmFuc2xhdGlvbnMgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBTVE9SRV9OQU1FID0gJ3RyYW5zbGF0aW9ucyc7XG4gIFxuICAvKiogRGVmYXVsdCBkYXRhYmFzZSBuYW1lICovXG4gIHByaXZhdGUgcmVhZG9ubHkgREVGQVVMVF9EQl9OQU1FID0gJ3RyYW5zbGF0aW9ucy1kYic7XG4gIFxuICAvKiogRGVmYXVsdCBkYXRhYmFzZSB2ZXJzaW9uICovXG4gIHByaXZhdGUgcmVhZG9ubHkgREJfVkVSU0lPTiA9IDE7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBJbmRleGVkREIgZGF0YWJhc2UgZm9yIHRyYW5zbGF0aW9ucy5cbiAgICogQ3JlYXRlcyB0aGUgbmVjZXNzYXJ5IG9iamVjdCBzdG9yZSBpZiBpdCBkb2Vzbid0IGV4aXN0LlxuICAgKiBcbiAgICogQHBhcmFtIGNvbmZpZyAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gZm9yIGRhdGFiYXNlIHNldHVwXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBkYXRhYmFzZSBpbml0aWFsaXphdGlvbiBmYWlsc1xuICAgKi9cbiAgYXN5bmMgaW5pdChjb25maWc/OiBUcmFuc2xhdGlvbkNvbmZpZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYk5hbWUgPSBjb25maWc/LmRiTmFtZSA/PyB0aGlzLkRFRkFVTFRfREJfTkFNRTtcbiAgICAgIFxuICAgICAgdGhpcy5kYiA9IGF3YWl0IG9wZW5EQihkYk5hbWUsIHRoaXMuREJfVkVSU0lPTiwge1xuICAgICAgICB1cGdyYWRlOiAoZGIpID0+IHRoaXMuY3JlYXRlT2JqZWN0U3RvcmUoZGIpLFxuICAgICAgICBibG9ja2VkOiAoKSA9PiB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdEYXRhYmFzZSB1cGdyYWRlIGJsb2NrZWQuIFBsZWFzZSBjbG9zZSBvdGhlciB0YWJzIHVzaW5nIHRoaXMgYXBwLicpO1xuICAgICAgICB9LFxuICAgICAgICBibG9ja2luZzogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGIuY2xvc2UoKTtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ0RhdGFiYXNlIHZlcnNpb24gY2hhbmdlIGRldGVjdGVkLiBQbGVhc2UgcmVsb2FkIHRoZSBwYWdlLicpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluaXRpYWxpemluZyB0cmFuc2xhdGlvbiBkYXRhYmFzZTonLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIGEgdHJhbnNsYXRpb24gdmFsdWUgdG8gdGhlIGNhY2hlLlxuICAgKiBcbiAgICogQHBhcmFtIGtleSAtIFRyYW5zbGF0aW9uIGtleVxuICAgKiBAcGFyYW0gdmFsdWUgLSBUcmFuc2xhdGlvbiB2YWx1ZSBvYmplY3RcbiAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkYXRhYmFzZSBpcyBub3QgaW5pdGlhbGl6ZWQgb3Igc2F2ZSBmYWlsc1xuICAgKi9cbiAgYXN5bmMgc2F2ZVRvQ2FjaGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBUcmFuc2xhdGlvblZhbHVlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5lbnN1cmVEQkluaXRpYWxpemVkKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZGIucHV0KHRoaXMuU1RPUkVfTkFNRSwgdmFsdWUsIGtleSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNhdmluZyB0cmFuc2xhdGlvbiB0byBjYWNoZTonLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhIHRyYW5zbGF0aW9uIHZhbHVlIGZyb20gdGhlIGNhY2hlLlxuICAgKiBcbiAgICogQHBhcmFtIGtleSAtIFRyYW5zbGF0aW9uIGtleSB0byByZXRyaWV2ZVxuICAgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmluZyB0byB0aGUgdHJhbnNsYXRpb24gdmFsdWUgb3IgbnVsbCBpZiBub3QgZm91bmRcbiAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkYXRhYmFzZSBpcyBub3QgaW5pdGlhbGl6ZWRcbiAgICovXG4gIGFzeW5jIGdldEZyb21DYWNoZShrZXk6IHN0cmluZyk6IFByb21pc2U8VHJhbnNsYXRpb25WYWx1ZSB8IG51bGw+IHtcbiAgICB0aGlzLmVuc3VyZURCSW5pdGlhbGl6ZWQoKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZGIuZ2V0KHRoaXMuU1RPUkVfTkFNRSwga2V5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcmV0cmlldmluZyB0cmFuc2xhdGlvbiBmcm9tIGNhY2hlOicsIGVycm9yKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYWxsIHRyYW5zbGF0aW9ucyBmcm9tIHRoZSBjYWNoZS5cbiAgICogXG4gICAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2aW5nIHRvIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0cmFuc2xhdGlvbnNcbiAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkYXRhYmFzZSBpcyBub3QgaW5pdGlhbGl6ZWRcbiAgICovXG4gIGFzeW5jIGdldEFsbEZyb21DYWNoZSgpOiBQcm9taXNlPHsgW2tleTogc3RyaW5nXTogVHJhbnNsYXRpb25WYWx1ZSB9PiB7XG4gICAgdGhpcy5lbnN1cmVEQkluaXRpYWxpemVkKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGFsbEVudHJpZXMgPSBhd2FpdCB0aGlzLmRiLmdldEFsbCh0aGlzLlNUT1JFX05BTUUpO1xuICAgICAgY29uc3QgYWxsS2V5cyA9IGF3YWl0IHRoaXMuZGIuZ2V0QWxsS2V5cyh0aGlzLlNUT1JFX05BTUUpO1xuICAgICAgXG4gICAgICByZXR1cm4gYWxsRW50cmllcy5yZWR1Y2UoKGFjYywgdmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGFsbEtleXNbaW5kZXhdPy50b1N0cmluZygpO1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgYWNjW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30gYXMgeyBba2V5OiBzdHJpbmddOiBUcmFuc2xhdGlvblZhbHVlIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZXRyaWV2aW5nIGFsbCB0cmFuc2xhdGlvbnMgZnJvbSBjYWNoZTonLCBlcnJvcik7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyBhbGwgdHJhbnNsYXRpb25zIGZyb20gdGhlIGNhY2hlLlxuICAgKiBcbiAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkYXRhYmFzZSBpcyBub3QgaW5pdGlhbGl6ZWQgb3IgY2xlYXIgZmFpbHNcbiAgICovXG4gIGFzeW5jIGNsZWFyQ2FjaGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5lbnN1cmVEQkluaXRpYWxpemVkKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZGIuY2xlYXIodGhpcy5TVE9SRV9OQU1FKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgY2xlYXJpbmcgdHJhbnNsYXRpb24gY2FjaGU6JywgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIHRoZSBlbnRpcmUgZGF0YWJhc2UuXG4gICAqIENsb3NlcyB0aGUgY3VycmVudCBjb25uZWN0aW9uIGJlZm9yZSBkZWxldGlvbi5cbiAgICogXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBkYXRhYmFzZSBkZWxldGlvbiBmYWlsc1xuICAgKi9cbiAgYXN5bmMgY2xlYXJEQigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKHRoaXMuZGIpIHtcbiAgICAgICAgY29uc3QgZGJOYW1lID0gdGhpcy5kYi5uYW1lO1xuICAgICAgICBhd2FpdCB0aGlzLmRiLmNsb3NlKCk7XG4gICAgICAgIGF3YWl0IGRlbGV0ZURCKGRiTmFtZSk7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsIGFzIGFueTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVsZXRpbmcgdHJhbnNsYXRpb24gZGF0YWJhc2U6JywgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSB0cmFuc2xhdGlvbnMgb2JqZWN0IHN0b3JlIGluIHRoZSBkYXRhYmFzZS5cbiAgICogXG4gICAqIEBwYXJhbSBkYiAtIEluZGV4ZWREQiBkYXRhYmFzZSBpbnN0YW5jZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVPYmplY3RTdG9yZShkYjogSURCUERhdGFiYXNlKTogdm9pZCB7XG4gICAgaWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKHRoaXMuU1RPUkVfTkFNRSkpIHtcbiAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKHRoaXMuU1RPUkVfTkFNRSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZXMgdGhlIGRhdGFiYXNlIGlzIGluaXRpYWxpemVkIGJlZm9yZSBvcGVyYXRpb25zLlxuICAgKiBcbiAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkYXRhYmFzZSBpcyBub3QgaW5pdGlhbGl6ZWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgZW5zdXJlREJJbml0aWFsaXplZCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgIGNvbnNvbGUud2FybignVHJhbnNsYXRpb24gZGF0YWJhc2Ugbm90IGluaXRpYWxpemVkLiBDYWxsIGluaXQoKSBmaXJzdC4nKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
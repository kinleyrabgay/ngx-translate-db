# @ngfly/translate-db

A robust, offline-first translation library for Angular applications with IndexedDB support.

## Features

- 🔄 Dynamic language switching
- 💾 Offline-first with IndexedDB storage
- 🚀 Reactive translations using Observables
- 🔍 Type-safe translation keys
- 📱 Memory efficient with automatic cleanup
- 🎯 Zero dependencies (except Angular core)

## Installation

```bash
npm install @ngfly/translate-db
```

## Quick Start

### 1. Configure in app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideTranslate } from '@ngfly/translate-db';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideTranslate({
      projectId: 'your-project-id',
      endpoint: 'https://your-api-endpoint',
      defaultLang: 'en',
      apiKey: 'optional-api-key',
      acceptedLanguages: ['en', 'fr', 'it', 'de', '...'],
    }),
  ],
};
```

### 2. Use in Components

```typescript
import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngfly/translate-db';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <!-- Using the pipe -->
      <p>{{ 'WELCOME_MESSAGE' | appTranslate | async }}</p>
      
      <!-- Language switcher -->
      <button (click)="changeLanguage('en')">English</button>
      <button (click)="changeLanguage('fr')">Français</button>
    </div>
  `,
  imports: [TranslatePipe],
  standalone: true
})
export class AppComponent {
  constructor(private translate: TranslateService) {}

  changeLanguage(lang: string): void {
    this.translate.setLanguage(lang);
  }
}
```

### 3. Using the Translation Pipe

The `appTranslate` pipe is designed to be used with Angular's `async` pipe:

```html
<!-- Basic usage -->
{{ 'TRANSLATION_KEY' | appTranslate | async }}

<!-- With variables -->
{{ dynamicKey | appTranslate | async }}

<!-- In attributes -->
<div [title]="'TOOLTIP_KEY' | appTranslate | async">
```
<!-- Passing dynamic parameter to the translation pipe -->
{{ 'LABEL_HELLO' | appTranslate: { name: 'DevFlow' } | async }}

## API Reference

### TranslateService

The core service for handling translations.

```typescript
class TranslateService {
  // Get current language
  get currentLanguage(): string;
  
  // Get list of supported languages
  get supportedLanguages(): string[];
  
  // Change language
  async setLanguage(lang: string): Promise<void>;
  
  // Get translation synchronously
  instant(key: string): string;
  
  // Get translation asynchronously
  async translate(key: string): Promise<string>;
  
  // Observable for language changes
  get onLangChange(): Observable<string>;
}
```

### Configuration Options

```typescript
interface TranslationConfig {
  projectId: string;                // Your project identifier
  endpoint: string;                 // API endpoint for fetching translations
  defaultLang: string;              // Default language to use
  apiKey?: string;                  // Optional API key for authentication
  acceptedLanguages: string[];      // List of supported languages
}
```

## Memory Management

The library is designed to be memory efficient:

- Uses Angular's async pipe for automatic subscription cleanup
- No memory leaks as subscriptions are properly managed
- Efficient change detection through Observable pattern
- IndexedDB for offline storage without memory overhead

## Performance Considerations

- Translations are cached in IndexedDB
- Change detection only triggers when needed
- Lazy loading of translations
- Efficient pipe implementation with minimal overhead

## Browser Support

- All modern browsers with IndexedDB support
- Fallback mechanism for older browsers
- Tested on latest Chrome, Firefox, Safari, and Edge

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT License - see LICENSE file for details 
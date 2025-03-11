# ngx-translate-db

A lightweight, efficient Angular translation library that uses IndexedDB for offline storage. Perfect for applications that need to handle translations without network dependency.

[![npm version](https://badge.fury.io/js/ngx-translate-db.svg)](https://www.npmjs.com/package/ngx-translate-db)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 Lightweight and fast
- 💾 Offline-first using IndexedDB
- 🔄 Automatic caching
- 📦 Standalone components support
- 🎯 Type-safe
- ⚡ Synchronous translations
- 🔌 Easy API integration
- 📱 Mobile-friendly

## Installation

```bash
npm install ngx-translate-db
# or
yarn add ngx-translate-db
```

## Requirements

- Angular 17+
- IndexedDB support in the browser

## Quick Start

1. **Configure in your app.config.ts using the provider:**

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideTranslate } from 'ngx-translate-db';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslate({
      projectId: 'your-project-id',
      endpoint: 'https://your-api.com/translations',
      defaultLang: 'en',
    })
  ]
};
```

2. **Use in your standalone components:**

```typescript
import { Component } from '@angular/core';
import { TranslatePipe } from 'ngx-translate-db';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{ 'WELCOME_MESSAGE' | translate }}</h1>
    <button>{{ 'BTN_LOGIN' | translate }}</button>
  `,
  standalone: true,
  imports: [TranslatePipe]
})
export class AppComponent {}
```

3. **Or configure for specific features:**

```typescript
@Component({
  // ...
  providers: [
    provideTranslate({
      ...config,
    })
  ]
})
export class AdminFeatureComponent {}
```

## Translation Format

Translations should follow this structure:

```typescript
{
  "BTN_LOGIN": {
    "en": "Login",
    "fr": "Connexion",
    "es": "Iniciar sesión"
  },
  "WELCOME_MESSAGE": {
    "en": "Welcome",
    "fr": "Bienvenue",
    "es": "Bienvenido"
  }
}
```

## API Reference

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| projectId | string | Unique identifier for your project |
| endpoint | string | API endpoint for fetching translations |
| defaultLang | string | Default language code |
| apiKey? | string | Optional API key for authentication |
| dbName | string | Name for IndexedDB database |
| moduleName | string | Feature identifier for translations |

### TranslateService

```typescript
class TranslateService {
  // Change current language
  async setLanguage(lang: string): Promise<void>

  // Get translation synchronously
  instant(key: string): string

  // Clear feature-specific cache
  async clearModuleCache(): Promise<void>

  // Clear all translations
  async clearAllCache(): Promise<void>
}
```

### TranslatePipe

```typescript
{{ 'TRANSLATION_KEY' | appTranslate }}
```

## Feature-Specific Translations

Configure translations for specific features using the provider:

```typescript
provideTranslate({
  ...config,
  moduleName: 'admin-feature'
})
```

## Caching Strategy

- Translations are stored in IndexedDB per feature
- In-memory cache for fast synchronous access
- Background sync with API
- Automatic cache invalidation on language change

## Best Practices

1. Use meaningful translation keys (e.g., 'BTN_LOGIN' instead of 'button1')
2. Group translations by feature to improve load time
3. Implement proper error handling for missing translations
4. Use type-safe translation keys when possible
5. Leverage standalone components for better tree-shaking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[Kinley Rabgay](https://kinleyrabgay.vercel.app/)

## Support

If you find this package helpful, please consider giving it a star ⭐ on GitHub! 
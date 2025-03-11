# ngx-translate-db

A lightweight, efficient Angular translation library that uses IndexedDB for offline storage. Perfect for applications that need to handle translations without network dependency.

[![npm version](https://badge.fury.io/js/ngx-translate-db.svg)](https://www.npmjs.com/package/ngx-translate-db)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 Lightweight and fast
- 💾 Offline-first using IndexedDB
- 🔄 Automatic caching
- 📦 Module-specific translations
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

1. **Import and configure in your app.config.ts:**

```typescript
import { ApplicationConfig } from '@angular/core';
import { TranslateDBService } from 'ngx-translate-db';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: 'TRANSLATE_CONFIG',
      useValue: {
        projectId: 'your-project-id',
        endpoint: 'https://your-api.com/translations',
        defaultLang: 'en',
        dbName: 'your-app-name',
        moduleName: 'root'
      }
    }
  ]
};
```

2. **Use in your components:**

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
| moduleName | string | Module identifier for translations |

### TranslateDBService

```typescript
class TranslateDBService {
  // Change current language
  async setLanguage(lang: string): Promise<void>

  // Get translation synchronously
  instant(key: string): string

  // Clear module-specific cache
  async clearModuleCache(): Promise<void>

  // Clear all translations
  async clearAllCache(): Promise<void>
}
```

### TranslatePipe

```typescript
{{ 'TRANSLATION_KEY' | translate }}
```

## Module-Specific Translations

For feature modules, configure with a different moduleName:

```typescript
{
  provide: 'TRANSLATE_CONFIG',
  useValue: {
    ...config,
    moduleName: 'admin-module'
  }
}
```

## Caching Strategy

- Translations are stored in IndexedDB per module
- In-memory cache for fast synchronous access
- Background sync with API
- Automatic cache invalidation on language change

## Best Practices

1. Use meaningful translation keys (e.g., 'BTN_LOGIN' instead of 'button1')
2. Group translations by module to improve load time
3. Implement proper error handling for missing translations
4. Use type-safe translation keys when possible

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
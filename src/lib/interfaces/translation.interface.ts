export interface TranslationValue {
  [key: string]: string;
}

export interface Translations {
  [lang: string]: {
    [key: string]: string;
  };
}

export interface TranslationConfig {
  projectId: string;
  endpoint: string;
  defaultLang: string;
  apiKey?: string;
}

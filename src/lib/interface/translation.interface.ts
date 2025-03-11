export interface TranslationValue {
  [lang: string]: string;
}

export interface TranslationConfig {
  projectId: string;
  endpoint: string;
  defaultLang: string;
  apiKey?: string;
}

export const languagesArray = [
  'en',
  'he'
  // 'ro'
] as const

export type LanguageType = 'ltr' | 'rtl'

export type Language = typeof languagesArray[number]

export type Translation = Readonly<Record<Language, string>>

export interface TranslationModel {
  [key: string]: Translation | string
}

export type LanguagesConfigs = {
  [key in Language]: {
    name: string,
    cfg: LanguageConfig
  }
}

export interface LanguageConfig {
  lg: Language
  type: LanguageType
}


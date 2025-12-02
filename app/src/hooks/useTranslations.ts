// Hook para usar traducciones fácilmente en componentes
import { Language, translations } from './translations';

export function useTranslations(lang: Language, section: keyof typeof translations['es']) {
  return translations[lang][section];
}

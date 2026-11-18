import { ar } from './ar.js';
import { en } from './en.js';

export const translations = { ar, en };

/**
 * Resolves a bilingual string or key based on current language
 * @param {string|Object} val String key or bilingual object { ar: '...', en: '...' }
 * @param {string} lang 'ar' | 'en'
 * @returns {string}
 */
export function getLocalizedText(val, lang = 'ar') {
  if (!val) return '';
  if (typeof val === 'string') {
    const dict = translations[lang] || translations.ar;
    return dict[val] || val;
  }
  if (typeof val === 'object') {
    return val[lang] || val.ar || val.en || '';
  }
  return String(val);
}

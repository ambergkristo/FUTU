import { Lang } from '../i18n/lang';
import { uiEt } from './ui.et';
import { uiEn } from './ui.en';
import { uiRu } from './ui.ru';

export function getUi(lang: Lang) {
  switch (lang) {
    case 'et':
      return uiEt;
    case 'en':
      return uiEn;
    case 'ru':
      return uiRu;
    default:
      return uiEt;
  }
}

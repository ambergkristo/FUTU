import { Lang } from '../i18n/lang';
import { roomsEt } from './rooms.et';
import { roomsEn } from './rooms.en';
import { roomsRu } from './rooms.ru';
import type { Room } from '../types/room';

export function getRooms(lang: Lang): Room[] {
  switch (lang) {
    case 'et':
      return roomsEt;
    case 'en':
      return roomsEn;
    case 'ru':
      return roomsRu;
    default:
      return roomsEt;
  }
}

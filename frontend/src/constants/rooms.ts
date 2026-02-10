// Room ID constants for consistency across the app
export const ROOM_IDS = {
  VR: 1,
  COOKING: 2,
  ART: 3,
  TRAMPOLINE_1: 4,
  TRAMPOLINE_2: 5,
} as const;

export type RoomId = typeof ROOM_IDS[keyof typeof ROOM_IDS];

// Room mapping for reverse lookup
export const ROOM_NAMES: Record<RoomId, string> = {
  [ROOM_IDS.VR]: 'VR Ruum',
  [ROOM_IDS.COOKING]: 'Köögiruum',
  [ROOM_IDS.ART]: 'Kunstituba',
  [ROOM_IDS.TRAMPOLINE_1]: 'Trampoliin 1',
  [ROOM_IDS.TRAMPOLINE_2]: 'Trampoliin 2',
} as const;

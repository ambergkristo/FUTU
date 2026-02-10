export type RoomId = 1 | 2 | 3 | 4 | 5;

export type Room = {
  id: RoomId;
  slug: "vr" | "cooking" | "art" | "trampoline-1" | "trampoline-2";
  name: string;
  short: string;        // 1-liner for cards
  description: string;  // modal intro
  highlights: string[]; // 3-6 bullets
  suitableFor: string[]; // optional bullets
  priceHint: string;    // e.g. "E–N 210 € · R–P 260 €"
  durationHint: string; // e.g. "150 min + 30 min puhverdus"
  image?: { src: string; alt: string };
};

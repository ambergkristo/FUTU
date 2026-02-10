import type { Room } from '../types/room';

export const roomsEt: Room[] = [
  {
    id: 1,
    slug: "vr",
    name: "VR Ruum",
    short: "FUTU tehnoloogiline süda – juhitud virtuaalreaalsuse seiklused",
    description: "Kogu perele sobiv VR-keskus, kus professionaalsed juhid viivad teid läbi mitmesuguste virtuaalsete seikluste. Turvaline ja lõbus keskus kõigile vanustele.",
    highlights: [
      "Professionaalsed juhitud VR-seiklused",
      "Mitmekasiksed mänguvalikud kõigile vanustele",
      "Turvaline ja järelevalvega keskus",
      "Mitme kasutaja kogemused korraga",
      "Pere- ja sõpruskondlikud tegevused"
    ],
    suitableFor: ["Sünnipäevad", "Perepeod", "Sõpruskondlikud üritused"],
    priceHint: "E–N 210 € · R–P 260 €",
    durationHint: "150 min + 30 min puhverdus"
  },
  {
    id: 2,
    slug: "cooking",
    name: "Köögiruum",
    short: "Modernne köögistuudio – käelis-küljel kogemus koos kokkamisega",
    description: "Kaasaegne ja hästi varustatud köögistuudio, kus saab koos sõpradega süüa valmistada ja nautida meeldivat aega. Ideaalne meeskondade töödeks ja ühisteks kogemusteks.",
    highlights: [
      "Modernne ja täielikult varustatud köök",
      "Käelis-küljel kogemus kõigile osalejatele",
      "Suur töölaud ja kaasaegsed seadmed",
      "Sobib nii algajatele kui kogenudele kokkadele",
      "Ühine söögikogemus lõpus"
    ],
    suitableFor: ["Köögiklassid", "Töökohtade üritused", "Perepeod"],
    priceHint: "E–N 210 € · R–P 260 €",
    durationHint: "150 min + 30 min puhverdus"
  },
  {
    id: 3,
    slug: "art",
    name: "Kunstituba",
    short: "Loov stuudio – kunstiline eneseväljendus ja meeskondade loovus",
    description: "Loov ja inspireeriv keskus, kus saab koos sõpradega kunstiteoseid luua ja meeldivat aega veeta. Sobib nii algajatele kui edasijõudnud kunstnikele.",
    highlights: [
      "Loov ja inspireeriv keskkond",
      "Kõik vajalikud kunstitarbed ja materjalid",
      "Võimalus proovida erinevaid kunstimeetodeid",
      "Meeskondade loovülesanded ja projektid",
      "Igaüks saab oma teose kaasa võtta"
    ],
    suitableFor: ["Kunstiklassid", "Loovad töötoad", "Meeskondade üritused"],
    priceHint: "E–N 210 € · R–P 260 €",
    durationHint: "150 min + 30 min puhverdus"
  },
  {
    id: 4,
    slug: "trampoline-1",
    name: "Trampoliin 1",
    short: "Eraldi peoruum nr 1 – energiline ja lõbus kogemus",
    description: "Esimene kahest eraldi peoroost, mis võimaldab paralleelselt pidada kahte üritust. Suur ja energiline trampoliiniala koos peoruumiga, kus saab hüpata, sportida ja lõbut saada.",
    highlights: [
      "Eraldi peoruum privaatseks kogemuseks",
      "Suur turvaline trampoliiniala",
      "Muusika ja LED-valgustus efektidega",
      "Vahtkummide ala turvalisuseks",
      "Võimalus korraga pidada kahte üritust"
    ],
    suitableFor: ["Sünnipäevad", "Spordipäevad", "Laste peod"],
    priceHint: "E–N 210 € · R–P 260 €",
    durationHint: "150 min + 30 min puhverdus"
  },
  {
    id: 5,
    slug: "trampoline-2",
    name: "Trampoliin 2",
    short: "Eraldi peoruum nr 2 – sama suurepärane trampoliinikogemus",
    description: "Teine eraldi peoruum, mis jagab samut suurt ja laia trampoliiniala esimese ruumiga. Ideaalne suurematele gruppidele või paralleelsete ürituste korraldamiseks.",
    highlights: [
      "Teine eraldi peoruum suurematele gruppidele",
      "Jagatud suur trampoliiniala ruumiga 1",
      "Iseseisev helisüsteem ja valgustus",
      "Võimalus korraga pidada kahte üritust",
      "Sama suurepärane varustus ja turvalisus"
    ],
    suitableFor: ["Suuremad peod", "Kooliüritused", "Korporatiivsed üritused"],
    priceHint: "E–N 210 € · R–P 260 €",
    durationHint: "150 min + 30 min puhverdus"
  }
];

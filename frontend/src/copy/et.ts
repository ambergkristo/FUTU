export const et = {
  // Navigation
  nav: {
    rooms: 'Toad',
    pricing: 'Hinnad',
    pizza: 'Pizza',
    about: 'Meist',
    faq: 'KKK',
    faqFull: 'Korduma Kippuvad Küsimused',
    location: 'Asukoht',
    book: 'Broneeri',
    language: 'EE'
  },

  // Hero Section
  hero: {
    headline: 'Tulevik on siin',
    subheadline: 'FUTU kogemuskeskus - VR, toitkogukond ja meeldivaba aja veetmise koht',
    bookBirthday: 'Broneeri sünnipäev',
    viewRooms: 'Vaata tube',
    pizzaNote: 'Pizzeria avatud ka tänavalt'
  },

  // Why FUTU Section
  whyFutu: {
    title: 'Miks FUTU',
    features: [
      {
        title: 'Kaasaegne tehnoloogia',
        description: 'Uusimad VR-seadmed 4K resolutsiooniga ja haptiline tagasiside',
        icon: '🎮'
      },
      {
        title: 'Avalik pizzeria',
        description: 'Kõrgekvaliteedne pizza kättesaadav ka ilma broneeringuta',
        icon: '🍕'
      },
      {
        title: 'Privaatsed ruumid',
        description: 'Eksklusiivsed ruumid sinu ja sinu sõprade jaoks',
        icon: '🔒'
      },
      {
        title: 'Paindlik broneering',
        description: 'Broneeri mistahes ajal, päeval või öösel',
        icon: '🕐'
      }
    ]
  },

  // Rooms Section
  rooms: {
    title: 'Ruumid',
    weekdayPrice: 'E–N 210€',
    weekendPrice: 'R–P 260€',
    duration: '150 min + 30 min puhver',
    bookRoom: 'Broneeri ruum',
    types: [
      {
        name: 'VR Ruum',
        capacity: '2-4 mängijat',
        price: '210€/tund',
        features: ['VR prillid', 'Haptilised ülikonnad', 'Helisüsteem', 'Kliimakontroll']
      },
      {
        name: 'Köögiruum',
        capacity: '4-6 inimest',
        price: '180€/tund',
        features: ['Täielik köögivarustus', 'Kokka õpetamine', 'Koosviisud', 'Söögitarbed']
      },
      {
        name: 'Kunstituba',
        capacity: '3-5 inimest',
        price: '160€/tund',
        features: ['Kunstitarbed', 'Lõuendid', 'Värvid', 'Ekspert juhendaja']
      },
      {
        name: 'Trampoliin 1',
        capacity: '6-8 inimest',
        price: '200€/tund',
        features: ['Suur trampoliin', 'Vahtkummide ala', 'Muusika', 'LED valgustus']
      },
      {
        name: 'Trampoliin 2',
        capacity: '6-8 inimest',
        price: '200€/tund',
        features: ['Suur trampoliin', 'Vahtkummide ala', 'Muusika', 'LED valgustus']
      }
    ]
  },

  // Pricing Section
  pricing: {
    title: 'Hinnad',
    duration: 'Kestvus: 150 min + 30 min puhver',
    packages: [
      {
        name: 'Standard',
        weekdayPrice: '180€/tund',
        weekendPrice: '230€/tund',
        features: ['Ruumi kasutus', 'Põhivarustus', 'Klienditugi'],
        popular: false
      },
      {
        name: 'Premium',
        weekdayPrice: '210€/tund',
        weekendPrice: '260€/tund',
        features: ['Ruumi kasutus', 'Täielik varustus', 'Pizza ja joogid', 'Prioriteetne tugi'],
        popular: true
      },
      {
        name: 'VIP',
        weekdayPrice: '350€/tund',
        weekendPrice: '450€/tund',
        features: ['Luxury kogemus', 'Privaatne teenindus', 'Lõputu pizza', 'Isiklik assistent'],
        popular: false
      }
    ]
  },

  // Pizza Section
  pizza: {
    title: 'FUTU Pizzeria',
    subtitle: 'Avalik pizzeria FUTU aatriumis - tuli ka ilma broneeringuta!',
    menu: {
      pizzas: [
        { name: 'FUTU Margherita', description: 'Klassikaline tomat, mozzarella, basiilik' },
        { name: 'Pepperoni', description: 'Pepperoni, mozzarella, tomatakaste' },
        { name: 'Veggie', description: 'Paprika, seened, oliivid, sibul' },
        { name: 'FUTU Special', description: 'Neli juustu, prosciutto, rukola' }
      ],
      drinks: [
        { name: 'Energiajoogid', description: 'Red Bull, Monster, kohalikud brändid' },
        { name: 'Karastusjoogid', description: 'Coca-Cola, Sprite, Fanta, vesi' },
        { name: 'Snackid', description: 'Sipsid, pähklid, kommid' },
        { name: 'Kohv', description: 'Espresso, cappuccino, latte' }
      ]
    },
    orderNow: 'Telli kohe',
    viewMenu: 'Vaata menüüd'
  },

  // How It Works
  howItWorks: {
    title: 'Kuidas broneerimine käib',
    steps: [
      {
        step: '01',
        title: 'Vali tuba ja aeg',
        description: 'Vali sobiv tuba, kuupäev ja vaba kellaaeg.'
      },
      {
        step: '02',
        title: 'Kinnita andmed ja makse',
        description: 'Sisesta kontakt, kinnita broneering ning tasu turvaliselt.'
      },
      {
        step: '03',
        title: 'Saa kinnitus',
        description: 'Pärast makset saad kinnituse kohe ning näed broneeringu staatust ühes vaates.'
      }
    ]
  },

  // About Section
  about: {
    title: 'Meist',
    vision: 'FUTU on modernne kogemuskeskus Allikul, Instituudi tee 134, mis on valmimas. Keskus on loodud sünnipäevade, tiimiürituste, eratellimusel ürituste ja töötubade korraldamiseks.',
    values: [
      'Mitmekülgsed ruumid eri formaatidele',
      'Kvaliteetne teenindus ja selge korraldus',
      'Kaasaegne tehnoloogia ja professionaalne keskkond',
      'Lahendused nii lastele kui täiskasvanutele'
    ]
  },

  // FAQ Section
  faq: {
    title: 'Korduma kippuvad küsimused',
    questions: [
      {
        question: 'Kaua ette pean broneerima?',
        answer: 'Soovitame broneerida vähemalt 24 tundi ette, eriti nädalavahetustele. Samapäevased broneeringud on võimalikud, kui vabu kohti on.'
      },
      {
        question: 'Kas pizzeria on avalik?',
        answer: 'Jah! FUTU pizzeria asub aatriumis ja on avatud ka tänavalt. Saad tulla pizza sööma ka ilma broneeringuta.'
      },
      {
        question: 'Mis on broneeringu kestvus?',
        answer: 'Standardne broneering on 150 minutit + 30-minutine puhverruum koristamiseks ja ettevalmistusteks.'
      },
      {
        question: 'Kas saan kaasa tuua oma mänge?',
        answer: 'Meil on kureeritud VR-mängude kogu. Kui sul on spetsiifiline soov, palun võta meiega ette ühendust.'
      },
      {
        question: 'Kas on vanusepiirangud?',
        answer: 'Soovitatav vanus on 12+. Nooremad kui 18 aastatased vajavad vanema järelevalvet. Mõned mängid on vanusepiirangutega.'
      },
      {
        question: 'Mis juhtub kui pean tühistama?',
        answer: 'Tasuta tühistamine kuni 24 tundi enne broneeringut. 24 tunni sees kehtib 50% tasu. Ära tulemise korral tuleb maksta täis hind.'
      }
    ]
  },

  // Location Section
  location: {
    title: 'Asukoht',
    visit: 'Külasta FUTU-d',
    address: {
      title: 'Aadress',
      content: `FUTU Kogemuskeskus
Tehnika 123
Tallinn, Eesti 10111`
    },
    hours: {
      title: 'Lahtiolekuajad',
      content: `E - N: 12:00 - 24:00
R - L: 12:00 - 02:00
P: 12:00 - 22:00`
    },
    contact: {
      title: 'Kontakt',
      content: `Telefon: +372 555 12345
Email: info@futu.ee
Discord: FUTU#1234`
    },
    map: {
      title: 'Kaart',
      subtitle: 'Interaktiivne kaart tulemas peatselt'
    }
  },

  // Footer
  footer: {
    description: 'Tulevik on siin. Kogu VR-elu nagu kunagi varem.',
    quickLinks: 'Kiirlingid',
    legal: 'Juriidiline',
    followUs: 'Jälgi meid',
    copyright: '© 2024 FUTU Gaming. Kõik õigused kaitstud.',
    links: {
      about: 'Meist',
      rooms: 'Ruumid',
      pricing: 'Hinnad',
      book: 'Broneeri kohe',
      privacy: 'Privaatsuspoliitika',
      terms: 'Kasutustingimused',
      cookies: 'Küpsiste poliitika',
      refund: 'Tagastamispoliitika'
    }
  }
};

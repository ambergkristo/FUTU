import type { Room } from '../types/room';

export const roomsEn: Room[] = [
  {
    id: 1,
    slug: "vr",
    name: "VR Room",
    short: "FUTU tech heart – guided virtual reality adventures",
    description: "Family-friendly VR center where professional guides take you through various virtual adventures. Safe and fun center for all ages.",
    highlights: [
      "Professionally guided VR adventures",
      "Diverse game options for all ages",
      "Safe and supervised center",
      "Multi-user experiences simultaneously",
      "Family and friendship activities"
    ],
    suitableFor: ["Birthdays", "Family parties", "Friend group events"],
    priceHint: "Mon–Thu 210 € · Fri–Sun 260 €",
    durationHint: "150 min + 30 min buffer"
  },
  {
    id: 2,
    slug: "cooking",
    name: "Cooking Room",
    short: "Modern cooking studio – hands-on experience with cooking",
    description: "Contemporary and well-equipped cooking studio where you can cook together with friends and enjoy a pleasant time. Ideal for team building and shared experiences.",
    highlights: [
      "Modern and fully equipped kitchen",
      "Hands-on experience for all participants",
      "Large workspace and modern equipment",
      "Suitable for both beginners and experienced cooks",
      "Shared dining experience at the end"
    ],
    suitableFor: ["Cooking classes", "Workplace events", "Family parties"],
    priceHint: "Mon–Thu 210 € · Fri–Sun 260 €",
    durationHint: "150 min + 30 min buffer"
  },
  {
    id: 3,
    slug: "art",
    name: "Art Room",
    short: "Creative studio – artistic self-expression and team creativity",
    description: "Creative and inspiring center where you can create art pieces together with friends and have a pleasant time. Suitable for both beginners and advanced artists.",
    highlights: [
      "Creative and inspiring environment",
      "All necessary art supplies and materials",
      "Opportunity to try different art techniques",
      "Team creative tasks and projects",
      "Everyone can take their artwork home"
    ],
    suitableFor: ["Art classes", "Creative workshops", "Team events"],
    priceHint: "Mon–Thu 210 € · Fri–Sun 260 €",
    durationHint: "150 min + 30 min buffer"
  },
  {
    id: 4,
    slug: "trampoline-1",
    name: "Trampoline 1",
    short: "Separate party room #1 – energetic and fun experience",
    description: "First of two separate party rooms, allowing parallel hosting of two events. Large and energetic trampoline area with party room where you can jump, exercise, and have fun.",
    highlights: [
      "Separate party room for private experience",
      "Large safe trampoline area",
      "Music and LED lighting with effects",
      "Foam pit area for safety",
      "Ability to host two events simultaneously"
    ],
    suitableFor: ["Birthdays", "Sports days", "Kids parties"],
    priceHint: "Mon–Thu 210 € · Fri–Sun 260 €",
    durationHint: "150 min + 30 min buffer"
  },
  {
    id: 5,
    slug: "trampoline-2",
    name: "Trampoline 2",
    short: "Separate party room #2 – same excellent trampoline experience",
    description: "Second separate party room that shares the same large and wide trampoline area with the first room. Ideal for larger groups or hosting parallel events.",
    highlights: [
      "Second separate party room for larger groups",
      "Shared large trampoline area with room 1",
      "Independent sound system and lighting",
      "Ability to host two events simultaneously",
      "Same excellent equipment and safety"
    ],
    suitableFor: ["Larger parties", "School events", "Corporate events"],
    priceHint: "Mon–Thu 210 € · Fri–Sun 260 €",
    durationHint: "150 min + 30 min buffer"
  }
];

import { CommunityPledge } from '../types';

export const INITIAL_COMMUNITY_PLEDGES: CommunityPledge[] = [
  {
    id: 'zero-waste-burning',
    title: 'Zero Open Waste & Leaf Burning Pledge',
    category: 'waste',
    participantsCount: 1420,
    estimatedCommunityCO2SavedKg: 8520,
    userPledged: false,
    description: 'Pledge to report and halt any neighborhood garden waste, leaf, or plastic burning. Commit to composting dry foliage instead of incinerating.',
  },
  {
    id: 'clean-commute-tuesday',
    title: 'Clean Commute Metro & Carpool Tuesdays',
    category: 'commute',
    participantsCount: 2890,
    estimatedCommunityCO2SavedKg: 14450,
    userPledged: true,
    description: 'Switch solo vehicle commutes to public transit, EV cabs, or residential carpools every Tuesday during peak smog season.',
  },
  {
    id: 'clean-heating-transition',
    title: 'Smog-Free Warmth: No Open Angithi/Chulha',
    category: 'heating',
    participantsCount: 940,
    estimatedCommunityCO2SavedKg: 5640,
    userPledged: false,
    description: 'Provide electric heating blankets and radiant heaters to night security guards and domestic staff instead of open wood or coal fires.',
  },
  {
    id: 'diy-purifier-gifting',
    title: 'Community Corsi-Rosenthal Purifier Drive',
    category: 'neighborhood',
    participantsCount: 512,
    estimatedCommunityCO2SavedKg: 1024,
    userPledged: false,
    description: 'Build and donate low-cost DIY Corsi-Rosenthal boxes to local government primary schools, daycare centers, and community clinics.',
  },
];

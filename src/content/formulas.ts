import type { FormulaPlan } from '@/types/content';

export const formulaPlans: FormulaPlan[] = [
  {
    id: 'solo-premium',
    name: 'Solo',
    label: 'PREMIUM',
    description:
      'Idéal pour un suivi personnalisé et une progression accélérée. Pour celles et ceux qui recherchent un accompagnement individualisé.',
    imageUrl: '/images/formulas/solo.jpg',
    imageAlt: 'Élève suivant une formule individuelle devant son ordinateur',
    tiers: [
      { hoursPerWeek: '1h / semaine', hoursPerMonth: '4h / mois', price: '50€' },
      { hoursPerWeek: '2h / semaine', hoursPerMonth: '8h / mois', price: '90€' },
      { hoursPerWeek: '3h / semaine', hoursPerMonth: '12h / mois', price: '120€' },
    ],
  },
  {
    id: 'duo-excellence',
    name: 'Duo',
    label: 'EXCELLENCE',
    description:
      'Parfait pour apprendre à deux dans un cadre motivant et équilibré, avec un bon équilibre entre interaction et budget.',
    imageUrl: '/images/formulas/duo.jpg',
    imageAlt: 'Deux élèves suivant ensemble une formule en duo',
    tiers: [
      { hoursPerWeek: '1h / semaine', hoursPerMonth: '4h / mois', price: '35€' },
      { hoursPerWeek: '2h / semaine', hoursPerMonth: '8h / mois', price: '65€' },
      { hoursPerWeek: '3h / semaine', hoursPerMonth: '12h / mois', price: '90€' },
    ],
  },
  {
    id: 'groupe-prestige',
    name: 'Groupe',
    label: 'PRESTIGE',
    badge: 'Recommandé',
    recommended: true,
    description:
      'Le meilleur compromis pour apprendre sérieusement dans une dynamique de groupe, tout en gardant un cadre structuré.',
    imageUrl: '/images/formulas/groupe.jpg',
    imageAlt: 'Quatre élèves participant ensemble à une formule en groupe',
    tiers: [
      { hoursPerWeek: '1h / semaine', hoursPerMonth: '4h / mois', price: '25€' },
      { hoursPerWeek: '2h / semaine', hoursPerMonth: '8h / mois', price: '50€' },
      { hoursPerWeek: '3h / semaine', hoursPerMonth: '12h / mois', price: '70€' },
    ],
  },
];

export const includedItems = [
  'Cours en direct',
  'Support PDF',
  'Devoirs entre les séances (pour le prochain cours)',
  'Suivi hors cours en cas de besoin',
];

export const paymentMethods = ['PayPal', 'Wero', 'Virement bancaire'];

export const formulaChoice = [
  'Solo : pour un suivi individualisé',
  'Duo : pour apprendre à deux',
  'Groupe : pour bénéficier d’une dynamique collective',
];

export const formulasHelpingLine =
  'En cas de difficultés financières, nous ferons de notre mieux pour vous accompagner.';

export const absencePolicy =
  'En cas d’absence, il convient de prévenir au minimum 24h à l’avance. À défaut, le cours est décompté de la formule.';

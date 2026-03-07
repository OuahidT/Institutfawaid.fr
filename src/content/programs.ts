import type { Program } from '@/types/content';

export const programs: Program[] = [
  {
    id: 'al-baghdadiya',
    name: 'Al-Baghdadiya',
    subtitle: 'Apprendre à lire avec les règles de Tajwid',
    shortDescription:
      'Une méthode progressive pour apprendre à lire l’arabe avec les règles de base du Tajwid.',
    description:
      'Al-Baghdadiya (البغدادية) est un manuel d’apprentissage de la lecture en arabe, souvent utilisé dans les écoles traditionnelles, notamment en Afrique du Nord et en Mauritanie. Sa progression méthodique va des lettres aux syllabes, puis aux mots et aux phrases. De nombreux mots étudiés sont tirés du Coran, ce qui permet de se familiariser progressivement avec le vocabulaire coranique.',
    meta: {
      level: 'Débutant',
      volume: 'Moyenne 18 heures',
      prerequisites: 'Aucun',
      outcome:
        'Savoir lire progressivement les lettres, syllabes, mots et premières phrases avec une base de Tajwid.',
    },
  },
  {
    id: 'nour-al-bayan',
    name: 'Nour Al-Bayan',
    subtitle: 'Apprendre à lire avec le Tajwid, notamment pour les enfants',
    shortDescription:
      'Un support adapté aux enfants pour apprendre à lire avec une approche phonétique et visuelle.',
    description:
      'Nour Al-Bayan (نور البيان) est un manuel d’apprentissage de la lecture en arabe largement utilisé pour l’enseignement aux enfants. Il repose sur une approche phonétique qui facilite la prononciation correcte des lettres et des mots arabes. Sa pédagogie visuelle et progressive permet d’assimiler plus facilement les règles de lecture et de développer une bonne articulation.',
    meta: {
      level: 'Débutant',
      volume: 'Moyenne 15 heures',
      prerequisites: 'Aucun',
      outcome:
        'Acquérir une lecture plus fluide et une meilleure articulation, particulièrement adaptée à un apprentissage encadré.',
    },
  },
  {
    id: 'al-fourqan',
    name: 'Al-Fourqan',
    subtitle: 'Apprendre à parler et comprendre l’arabe',
    shortDescription:
      'Un programme complet pour développer compréhension, expression orale et écrite.',
    description:
      'Le programme Al-Fourqan est un enseignement complet de la langue arabe, conçu pour renforcer l’expression orale et écrite. Il couvre la grammaire, la morphologie, la poésie, les histoires des prophètes et d’autres matières complémentaires. Il suit une méthodologie rigoureuse permettant une progression structurée, avec un accent particulier sur la maîtrise de l’arabe à l’oral comme à l’écrit.',
    meta: {
      level: 'Intermédiaire',
      volume: 'Volume variable selon le niveau et les objectifs',
      prerequisites: 'Savoir lire correctement',
      outcome:
        'Développer la compréhension, l’expression et la structuration linguistique.',
    },
  },
  {
    id: 'tomes-de-medine',
    name: 'Les Tomes de Médine',
    subtitle: 'Une référence pour les non-arabophones',
    shortDescription:
      'Une référence incontournable pour les non-arabophones qui veulent apprendre l’arabe de manière structurée.',
    description:
      'Les Tomes de Médine, également connus sous le nom de Kitab Al-Madina, sont une série de manuels conçus pour les non-arabophones. Ils couvrent la grammaire, le vocabulaire, l’expression orale et écrite, avec une approche progressive et immersive qui facilite une compréhension durable.',
    meta: {
      level: 'Intermédiaire',
      volume: 'Volume variable selon le niveau et les objectifs',
      prerequisites: 'Savoir lire correctement',
      outcome: 'Construire des bases solides et structurées en arabe.',
    },
  },
  {
    id: 'al-ajroumiya',
    name: 'Al-Ajroumiya',
    subtitle: 'Les bases essentielles de la grammaire arabe',
    shortDescription:
      'Un ouvrage fondamental pour poser des bases solides en grammaire arabe.',
    description:
      'Al-Ajroumiya (الآجرومية) est un ouvrage fondamental pour l’étude de la grammaire arabe. Réputé pour sa clarté et sa simplicité d’approche, il permet de poser des bases solides sur les notions essentielles de la grammaire, les déclinaisons, les accords et les structures fondamentales de la langue.',
    meta: {
      level: 'Intermédiaire',
      volume: 'Volume variable selon le niveau et les objectifs',
      prerequisites: 'Savoir lire correctement',
      outcome: 'Débuter sérieusement l’étude de la grammaire arabe.',
    },
  },
  {
    id: 'apprendre-le-coran',
    name: 'Apprendre le Coran',
    subtitle: 'Lecture, Tajwid, mémorisation et correction',
    shortDescription:
      'Un accompagnement personnalisé pour améliorer lecture, Tajwid et mémorisation.',
    description:
      'Nous proposons des cours personnalisés pour vous aider à mémoriser le Coran, à améliorer la fluidité de votre lecture et à corriger vos erreurs de prononciation et de Tajwid. Chaque élève progresse à son rythme grâce à une méthode adaptée, avec des révisions régulières et des corrections précises dans une ambiance bienveillante et encourageante.',
    meta: {
      level: 'Intermédiaire',
      volume: 'Volume variable selon le niveau et les objectifs',
      prerequisites: 'Savoir lire',
      outcome: 'Perfectionner lecture, récitation, correction et mémorisation.',
    },
  },
];

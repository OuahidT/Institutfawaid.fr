import type { SiteConfig } from '@/types/content';

export const siteConfig: SiteConfig = {
  name: 'Institut Fawaid',
  baseline: 'Apprendre l\'arabe avec méthode, clarté et régularité.',
  shortDescription: 'Institut en ligne d’apprentissage de la langue arabe.',
  promise: 'Apprenez l’arabe avec méthode, clarté et régularité.',
  positionning:
    'L’Institut Fawaid accompagne ses élèves dans l’apprentissage de la langue arabe à travers des cours en direct, des programmes structurés, des professeurs qualifiés et un accompagnement humain adapté au rythme de chacun.',
  url: 'https://institutfawaid.fr',
  email: 'contact@institutfawaid.fr',
  whatsapp: '+20 122 614 0786',
  whatsappHref: 'https://wa.me/201226140786',
  inscriptionUrl: 'https://forms.gle/phCUaPi2eheNL7ny7',
  nav: [
    { label: 'Accueil', href: '/' },
    { label: 'Programmes', href: '/programmes' },
    { label: 'Formules', href: '/formules' },
    { label: 'À propos', href: '/a-propos' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  cta: {
    signup: 'Je m’inscris',
    whatsapp: 'Parler sur WhatsApp',
    contact: 'Nous contacter',
    orientation: 'Être orienté',
  },
  trustItems: [
    'Plus de 10 ans d’expérience',
    'Plus de 500 étudiants accompagnés',
    'Cours en direct en visio',
    'Programmes structurés pour chaque niveau',
  ],
  seo: {
    titleTemplate: '%s | Institut Fawaid',
    defaultTitle: 'Institut Fawaid | Cours d’arabe en ligne',
    defaultDescription:
      'Institut en ligne d’apprentissage de la langue arabe. Cours en direct, programmes structurés et accompagnement humain.',
    siteUrl: 'https://institutfawaid.fr',
    ogImage: '/images/logo.png',
  },
};

export type NavItem = {
  label: string;
  href: string;
};

export type SeoDefaults = {
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  siteUrl: string;
  ogImage: string;
};

export type SiteConfig = {
  name: string;
  baseline: string;
  shortDescription: string;
  promise: string;
  positionning: string;
  url: string;
  email: string;
  whatsapp: string;
  whatsappHref: string;
  inscriptionUrl: string;
  nav: NavItem[];
  cta: {
    signup: string;
    whatsapp: string;
    contact: string;
    orientation: string;
  };
  trustItems: string[];
  seo: SeoDefaults;
};

export type ProgramMeta = {
  level: string;
  volume?: string;
  prerequisites: string;
  outcome: string;
};

export type Program = {
  id: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  meta: ProgramMeta;
};

export type FormulaTier = {
  hoursPerWeek: string;
  hoursPerMonth: string;
  price: string;
};

export type FormulaPlan = {
  id: string;
  name: string;
  label: string;
  description: string;
  badge?: string;
  tiers: FormulaTier[];
  recommended?: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
};

export type Testimonial = {
  name: string;
  age: number;
  location: string;
  quote: string;
  posterUrl?: string;
  videoUrl?: string;
};

export type LegalConfig = {
  publisher: {
    publicationDirector: string;
    editorName?: string;
    legalForm?: string;
    address?: string;
  };
  host: {
    name: string;
    website?: string;
    address?: string;
  };
  contactEmail: string;
  collectedData: string[];
  processingPurposes: string[];
  retentionDuration?: string;
  cookiePolicy?: string;
  userRights: string[];
  paymentMethods: string[];
  absencePolicy: string;
  trialLesson: string;
  cancellationTerms?: string;
  refundTerms?: string;
};

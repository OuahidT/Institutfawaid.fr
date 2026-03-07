import type { LegalConfig } from '@/types/content';

export const legalConfig: LegalConfig = {
  publisher: {
    publicationDirector: 'Hadj Abou Salih',
  },
  host: {
    name: 'OVH',
    website: 'https://www.ovh.com',
  },
  contactEmail: 'contact@institutfawaid.fr',
  collectedData: [
    'Nom et prénom',
    'Adresse email',
    'Téléphone / WhatsApp',
    'Niveau actuel, objectif et formule souhaitée',
    'Contenu du message envoyé via le formulaire de contact',
  ],
  processingPurposes: [
    'Répondre aux demandes d’orientation et de contact',
    'Proposer une formule adaptée au profil de l’élève',
    'Assurer le suivi administratif des demandes',
  ],
  userRights: [
    'Droit d’accès',
    'Droit de rectification',
    'Droit d’opposition',
    'Droit à l’effacement',
    'Droit à la limitation du traitement',
  ],
  paymentMethods: ['PayPal', 'Wero', 'Virement bancaire'],
  absencePolicy:
    'Toute absence doit être signalée au minimum 24h à l’avance. Sinon, le cours est décompté de la formule.',
  trialLesson: 'L’institut ne propose pas de cours d’essai.',
};

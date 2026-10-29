export interface MotifReferentiel {
  libelle: string
  sousMotifs: string[]
}

export interface JourCreneaux {
  jour: string
  horaires: string[]
}

// Doit rester aligné avec les enums/constantes du backend (Motif, Creneau).
export const MOTIFS: MotifReferentiel[] = [
  { libelle: 'Comptes et cartes', sousMotifs: ['Ouverture de compte', 'Opposition ou renouvellement de carte'] },
  { libelle: 'Virements', sousMotifs: ['Virement international', 'Plafond de virement'] },
  { libelle: 'Crédits', sousMotifs: ['Crédit immobilier', 'Crédit à la consommation'] },
  { libelle: 'Épargne et placements', sousMotifs: ["Livret d'épargne", 'Assurance-vie'] },
  { libelle: 'Assurances', sousMotifs: ['Assurance habitation', 'Assurance emprunteur'] },
]

const HORAIRES_SEMAINE = ['09h00-09h30', '11h00-11h30', '14h00-14h30', '16h30-17h00']
const HORAIRES_SAMEDI = ['09h00-09h30', '10h00-10h30', '11h00-11h30']

export const CRENEAUX: JourCreneaux[] = [
  ...['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((jour) => ({ jour, horaires: HORAIRES_SEMAINE })),
  { jour: 'Samedi', horaires: HORAIRES_SAMEDI },
]

export function libelleCreneau(jour: string, horaire: string): string {
  return `${jour} ${horaire}`
}

export function trouverMotifParSousMotif(sousMotif: string): MotifReferentiel | undefined {
  return MOTIFS.find((motif) => motif.sousMotifs.includes(sousMotif))
}

export const TELEPHONE_REGEX = /^\+?[0-9 .()-]{8,20}$/

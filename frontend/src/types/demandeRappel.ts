export interface Identite {
  nom: string
  prenom: string
  numeroTelephone: string
}

export interface ChoixMotif {
  motif: string
  sousMotif: string
}

export interface DemandeRappelRequest extends Identite, ChoixMotif {
  creneau: string
}

export interface DemandeRappelResponse extends DemandeRappelRequest {
  id: number
  appele: boolean
}

import { createContext, useContext, type Dispatch } from 'react'
import type { ChoixMotif, DemandeRappelResponse, Identite } from '../types/demandeRappel'

export interface DemandeRappelState {
  identite: Identite
  choixMotif: ChoixMotif | null
  creneau: string | null
  confirmation: DemandeRappelResponse | null
}

export type DemandeRappelAction =
  | { type: 'SAISIR_IDENTITE'; identite: Identite }
  | { type: 'CHOISIR_MOTIF'; choixMotif: ChoixMotif }
  | { type: 'CHOISIR_CRENEAU'; creneau: string }
  | { type: 'CONFIRMER'; demande: DemandeRappelResponse }
  | { type: 'REINITIALISER' }

export const ETAT_INITIAL: DemandeRappelState = {
  identite: { nom: '', prenom: '', numeroTelephone: '' },
  choixMotif: null,
  creneau: null,
  confirmation: null,
}

export function demandeRappelReducer(
  state: DemandeRappelState,
  action: DemandeRappelAction,
): DemandeRappelState {
  switch (action.type) {
    case 'SAISIR_IDENTITE':
      return { ...state, identite: action.identite }
    case 'CHOISIR_MOTIF':
      return { ...state, choixMotif: action.choixMotif }
    case 'CHOISIR_CRENEAU':
      return { ...state, creneau: action.creneau }
    case 'CONFIRMER':
      return { ...ETAT_INITIAL, confirmation: action.demande }
    case 'REINITIALISER':
      return ETAT_INITIAL
  }
}

interface DemandeRappelContextValue {
  state: DemandeRappelState
  dispatch: Dispatch<DemandeRappelAction>
}

export const DemandeRappelContext = createContext<DemandeRappelContextValue | null>(null)

export function useDemandeRappel(): DemandeRappelContextValue {
  const contexte = useContext(DemandeRappelContext)
  if (!contexte) {
    throw new Error('useDemandeRappel doit être utilisé dans un DemandeRappelProvider')
  }
  return contexte
}

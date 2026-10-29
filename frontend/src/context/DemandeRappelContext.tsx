import { useReducer, type ReactNode } from 'react'
import { DemandeRappelContext, ETAT_INITIAL, demandeRappelReducer } from './demandeRappelState'

export function DemandeRappelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demandeRappelReducer, ETAT_INITIAL)
  return <DemandeRappelContext.Provider value={{ state, dispatch }}>{children}</DemandeRappelContext.Provider>
}

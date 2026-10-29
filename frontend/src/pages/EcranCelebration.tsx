import { Navigate, useNavigate } from 'react-router-dom'
import { useDemandeRappel } from '../context/demandeRappelState'

function EcranCelebration() {
  const navigate = useNavigate()
  const { state, dispatch } = useDemandeRappel()
  const demande = state.confirmation

  if (!demande) {
    return <Navigate to="/" replace />
  }

  function retourAccueil() {
    dispatch({ type: 'REINITIALISER' })
    navigate('/')
  }

  return (
    <main>
      <span className="eyebrow">Demande enregistrée</span>
      <h1>Merci {demande.prenom} !</h1>
      <p>
        Un conseiller vous rappellera le créneau suivant : <strong>{demande.creneau}</strong>, au sujet de
        « {demande.sousMotif} ».
      </p>
      <div className="actions">
        <button type="button" className="bouton-principal" onClick={retourAccueil}>
          Retour à l'accueil
        </button>
      </div>
    </main>
  )
}

export default EcranCelebration

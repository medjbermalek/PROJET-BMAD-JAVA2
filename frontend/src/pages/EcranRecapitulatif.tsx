import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { creerDemande } from '../api/demandeRappelApi'
import NavigationEtape from '../components/NavigationEtape'
import { useDemandeRappel } from '../context/demandeRappelState'

function EcranRecapitulatif() {
  const navigate = useNavigate()
  const { state, dispatch } = useDemandeRappel()
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  // Après CONFIRMER l'état est vidé : cette redirection évite de renvoyer vers l'identité.
  if (state.confirmation) {
    return <Navigate to="/client/confirmation" replace />
  }
  if (!state.choixMotif || !state.creneau) {
    return <Navigate to="/client/creneau" replace />
  }

  const { identite, choixMotif, creneau } = state

  async function valider(evenement: FormEvent) {
    evenement.preventDefault()
    if (enCours) return
    setEnCours(true)
    setErreur(null)
    try {
      const demande = await creerDemande({ ...identite, ...choixMotif!, creneau: creneau! })
      dispatch({ type: 'CONFIRMER', demande })
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Une erreur est survenue, veuillez réessayer.')
      setEnCours(false)
    }
  }

  return (
    <main>
      <span className="eyebrow">Étape 4 sur 4</span>
      <h1>Récapitulatif</h1>
      <p>Vérifiez vos informations avant de valider votre demande.</p>
      <form onSubmit={valider}>
        <dl className="recap">
          <div>
            <dt>Nom</dt>
            <dd>{identite.nom}</dd>
          </div>
          <div>
            <dt>Prénom</dt>
            <dd>{identite.prenom}</dd>
          </div>
          <div>
            <dt>Téléphone</dt>
            <dd>{identite.numeroTelephone}</dd>
          </div>
          <div>
            <dt>Motif</dt>
            <dd>
              {choixMotif.motif} – {choixMotif.sousMotif}
            </dd>
          </div>
          <div>
            <dt>Créneau</dt>
            <dd>{creneau}</dd>
          </div>
        </dl>
        {erreur && (
          <p role="alert" className="erreur">
            {erreur}
          </p>
        )}
        <NavigationEtape
          onRetour={() => navigate('/client/creneau')}
          libelleContinuer={enCours ? 'Envoi en cours…' : 'Valider'}
          desactive={enCours}
        />
      </form>
    </main>
  )
}

export default EcranRecapitulatif

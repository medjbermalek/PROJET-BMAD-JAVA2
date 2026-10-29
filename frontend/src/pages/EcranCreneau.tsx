import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import NavigationEtape from '../components/NavigationEtape'
import RadioListe from '../components/RadioListe'
import { useDemandeRappel } from '../context/demandeRappelState'
import { CRENEAUX, libelleCreneau } from '../data/referentiel'

function EcranCreneau() {
  const navigate = useNavigate()
  const { state, dispatch } = useDemandeRappel()

  if (!state.choixMotif) {
    return <Navigate to="/client/motif" replace />
  }

  function continuer(evenement: FormEvent) {
    evenement.preventDefault()
    if (state.creneau) navigate('/client/recapitulatif')
  }

  return (
    <main>
      <span className="eyebrow">Étape 3 sur 4</span>
      <h1>Créneau de rappel</h1>
      <p>Choisissez le moment où le conseiller vous appellera (30 minutes).</p>
      <form onSubmit={continuer}>
        {CRENEAUX.map(({ jour, horaires }) => (
          <RadioListe
            key={jour}
            name="creneau"
            legend={jour}
            options={horaires.map((horaire) => ({ value: libelleCreneau(jour, horaire), label: horaire }))}
            valeur={state.creneau}
            onChange={(creneau) => dispatch({ type: 'CHOISIR_CRENEAU', creneau })}
          />
        ))}
        <NavigationEtape onRetour={() => navigate('/client/motif')} desactive={!state.creneau} />
      </form>
    </main>
  )
}

export default EcranCreneau

import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import NavigationEtape from '../components/NavigationEtape'
import RadioListe from '../components/RadioListe'
import { useDemandeRappel } from '../context/demandeRappelState'
import { MOTIFS, trouverMotifParSousMotif } from '../data/referentiel'

function EcranMotif() {
  const navigate = useNavigate()
  const { state, dispatch } = useDemandeRappel()

  if (!state.identite.nom || !state.identite.prenom || !state.identite.numeroTelephone) {
    return <Navigate to="/client/identite" replace />
  }

  const sousMotifChoisi = state.choixMotif?.sousMotif ?? null

  function choisir(sousMotif: string) {
    const motif = trouverMotifParSousMotif(sousMotif)
    if (motif) dispatch({ type: 'CHOISIR_MOTIF', choixMotif: { motif: motif.libelle, sousMotif } })
  }

  function continuer(evenement: FormEvent) {
    evenement.preventDefault()
    if (sousMotifChoisi) navigate('/client/creneau')
  }

  return (
    <main>
      <span className="eyebrow">Étape 2 sur 4</span>
      <h1>Motif de votre demande</h1>
      <p>Sélectionnez le sujet pour lequel vous souhaitez être rappelé.</p>
      <form onSubmit={continuer}>
        {MOTIFS.map((motif) => (
          <RadioListe
            key={motif.libelle}
            name="motif"
            legend={motif.libelle}
            options={motif.sousMotifs.map((sousMotif) => ({ value: sousMotif, label: sousMotif }))}
            valeur={sousMotifChoisi}
            onChange={choisir}
          />
        ))}
        <NavigationEtape onRetour={() => navigate('/client/identite')} desactive={!sousMotifChoisi} />
      </form>
    </main>
  )
}

export default EcranMotif

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import ChampTexte from '../components/ChampTexte'
import NavigationEtape from '../components/NavigationEtape'
import { useDemandeRappel } from '../context/demandeRappelState'
import { TELEPHONE_REGEX } from '../data/referentiel'

interface Erreurs {
  nom?: string
  prenom?: string
  numeroTelephone?: string
}

function EcranIdentite() {
  const navigate = useNavigate()
  const { state, dispatch } = useDemandeRappel()
  const [nom, setNom] = useState(state.identite.nom)
  const [prenom, setPrenom] = useState(state.identite.prenom)
  const [numeroTelephone, setNumeroTelephone] = useState(state.identite.numeroTelephone)
  const [erreurs, setErreurs] = useState<Erreurs>({})

  function valider(evenement: FormEvent) {
    evenement.preventDefault()
    const identite = { nom: nom.trim(), prenom: prenom.trim(), numeroTelephone: numeroTelephone.trim() }
    const nouvellesErreurs: Erreurs = {}
    if (!identite.nom) nouvellesErreurs.nom = 'Le nom est obligatoire'
    if (!identite.prenom) nouvellesErreurs.prenom = 'Le prénom est obligatoire'
    if (!identite.numeroTelephone) {
      nouvellesErreurs.numeroTelephone = 'Le numéro de téléphone est obligatoire'
    } else if (!TELEPHONE_REGEX.test(identite.numeroTelephone)) {
      nouvellesErreurs.numeroTelephone = 'Le numéro de téléphone est invalide'
    }
    setErreurs(nouvellesErreurs)
    if (Object.keys(nouvellesErreurs).length > 0) return

    dispatch({ type: 'SAISIR_IDENTITE', identite })
    navigate('/client/motif')
  }

  return (
    <main>
      <span className="eyebrow">Étape 1 sur 4</span>
      <h1>Vos informations</h1>
      <p>Indiquez comment le conseiller peut vous joindre.</p>
      <form noValidate onSubmit={valider}>
        <ChampTexte id="nom" label="Nom" valeur={nom} onChange={setNom} erreur={erreurs.nom} autoComplete="family-name" />
        <ChampTexte id="prenom" label="Prénom" valeur={prenom} onChange={setPrenom} erreur={erreurs.prenom} autoComplete="given-name" />
        <ChampTexte
          id="telephone"
          label="Numéro de téléphone"
          type="tel"
          valeur={numeroTelephone}
          onChange={setNumeroTelephone}
          erreur={erreurs.numeroTelephone}
          autoComplete="tel"
        />
        <NavigationEtape onRetour={() => navigate('/')} />
      </form>
    </main>
  )
}

export default EcranIdentite

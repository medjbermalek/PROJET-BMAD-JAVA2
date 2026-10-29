import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { seConnecter } from '../api/demandeRappelApi'
import ChampTexte from '../components/ChampTexte'

function ConseillerLogin() {
  const navigate = useNavigate()
  const [identifiant, setIdentifiant] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, setEnCours] = useState(false)

  async function valider(evenement: FormEvent) {
    evenement.preventDefault()
    if (enCours) return
    setEnCours(true)
    setErreur(null)
    try {
      await seConnecter(identifiant.trim(), motDePasse)
      navigate('/conseiller/dashboard')
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Une erreur est survenue, veuillez réessayer.')
      setEnCours(false)
    }
  }

  return (
    <main>
      <span className="eyebrow">Espace conseiller</span>
      <h1>Connexion conseiller</h1>
      <form onSubmit={valider}>
        <ChampTexte id="identifiant" label="Identifiant" valeur={identifiant} onChange={setIdentifiant} autoComplete="username" />
        <ChampTexte
          id="mot-de-passe"
          label="Mot de passe"
          type="password"
          valeur={motDePasse}
          onChange={setMotDePasse}
          autoComplete="current-password"
        />
        {erreur && (
          <p role="alert" className="erreur">
            {erreur}
          </p>
        )}
        <div className="actions">
          <button type="submit" className="bouton-principal" disabled={enCours}>
            Se connecter
          </button>
        </div>
      </form>
      <Link className="retour" to="/">Retour à l'accueil</Link>
    </main>
  )
}

export default ConseillerLogin

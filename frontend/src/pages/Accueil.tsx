import { useNavigate } from 'react-router-dom'

function Accueil() {
  const navigate = useNavigate()

  return (
    <main className="accueil">
      <span className="eyebrow">Votre espace</span>
      <h1>Demande de rappel</h1>
      <p>Choisissez votre profil pour continuer.</p>
      <div className="choix-profil">
        <button type="button" onClick={() => navigate('/client/identite')}>
          Client
        </button>
        <button type="button" onClick={() => navigate('/conseiller/login')}>
          Conseiller
        </button>
      </div>
    </main>
  )
}

export default Accueil

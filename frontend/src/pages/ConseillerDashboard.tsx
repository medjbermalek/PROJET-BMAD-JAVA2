import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, listerDemandes, marquerAppele, seDeconnecter } from '../api/demandeRappelApi'
import type { DemandeRappelResponse } from '../types/demandeRappel'

function ConseillerDashboard() {
  const navigate = useNavigate()
  const [demandes, setDemandes] = useState<DemandeRappelResponse[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, setEnCours] = useState<number[]>([])

  useEffect(() => {
    let annule = false
    listerDemandes()
      .then((liste) => {
        if (annule) return
        setDemandes(liste)
        setChargement(false)
      })
      .catch((e) => {
        if (annule) return
        if (e instanceof ApiError && e.status === 401) {
          navigate('/conseiller/login', { replace: true })
          return
        }
        setErreur('Impossible de charger les demandes.')
        setChargement(false)
      })
    return () => {
      annule = true
    }
  }, [navigate])

  async function basculer(demande: DemandeRappelResponse, appele: boolean) {
    setErreur(null)
    setEnCours((ids) => [...ids, demande.id])
    try {
      const misAJour = await marquerAppele(demande.id, appele)
      setDemandes((liste) => liste.map((d) => (d.id === misAJour.id ? misAJour : d)))
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        navigate('/conseiller/login', { replace: true })
        return
      }
      setErreur('La mise à jour a échoué, veuillez réessayer.')
    } finally {
      setEnCours((ids) => ids.filter((id) => id !== demande.id))
    }
  }

  async function deconnecter() {
    try {
      await seDeconnecter()
    } finally {
      navigate('/')
    }
  }

  return (
    <main className="large">
      <span className="eyebrow">Espace conseiller</span>
      <h1>Demandes de rappel</h1>
      {erreur && (
        <p role="alert" className="erreur">
          {erreur}
        </p>
      )}
      {chargement ? (
        <p>Chargement des demandes…</p>
      ) : demandes.length === 0 ? (
        <p>Aucune demande de rappel pour le moment.</p>
      ) : (
        <table className="tableau">
          <thead>
            <tr>
              <th scope="col">Appelé</th>
              <th scope="col">Nom</th>
              <th scope="col">Prénom</th>
              <th scope="col">Téléphone</th>
              <th scope="col">Motif</th>
              <th scope="col">Créneau</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((demande) => (
              <tr key={demande.id} className={demande.appele ? 'appelee' : undefined}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Marquer ${demande.prenom} ${demande.nom} comme appelé`}
                    checked={demande.appele}
                    disabled={enCours.includes(demande.id)}
                    onChange={(evenement) => basculer(demande, evenement.target.checked)}
                  />
                </td>
                <td>{demande.nom}</td>
                <td>{demande.prenom}</td>
                <td>{demande.numeroTelephone}</td>
                <td>
                  {demande.motif} – {demande.sousMotif}
                </td>
                <td>{demande.creneau}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="actions">
        <button type="button" className="bouton-secondaire" onClick={deconnecter}>
          Se déconnecter
        </button>
      </div>
    </main>
  )
}

export default ConseillerDashboard

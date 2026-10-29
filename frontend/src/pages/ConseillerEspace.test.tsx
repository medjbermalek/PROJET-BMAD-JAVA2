import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { installerFetch } from '../test/fetchMock'
import type { DemandeRappelResponse } from '../types/demandeRappel'

function renderApp(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

const DEMANDES: DemandeRappelResponse[] = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Alice',
    numeroTelephone: '0612345678',
    motif: 'Virements',
    sousMotif: 'Virement international',
    creneau: 'Mercredi 14h00-14h30',
    appele: false,
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Marc',
    numeroTelephone: '0698765432',
    motif: 'Crédits',
    sousMotif: 'Crédit immobilier',
    creneau: 'Lundi 09h00-09h30',
    appele: true,
  },
]

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Connexion conseiller', () => {
  it('ouvre le tableau de bord avec des identifiants valides', async () => {
    const fetchMock = installerFetch((url) => (url === '/api/auth/login' ? { status: 200 } : { status: 200, corps: [] }))
    const user = userEvent.setup()
    renderApp('/conseiller/login')

    await user.type(screen.getByLabelText('Identifiant'), 'admin')
    await user.type(screen.getByLabelText('Mot de passe'), 'admin')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByRole('heading', { name: 'Demandes de rappel' })).toBeInTheDocument()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/auth/login')
    expect((init?.body as URLSearchParams).toString()).toBe('username=admin&password=admin')
  })

  it("affiche une erreur et reste sur l'écran si les identifiants sont incorrects", async () => {
    installerFetch(() => ({ status: 401 }))
    const user = userEvent.setup()
    renderApp('/conseiller/login')

    await user.type(screen.getByLabelText('Identifiant'), 'admin')
    await user.type(screen.getByLabelText('Mot de passe'), 'faux')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Identifiant ou mot de passe incorrect')
    expect(screen.getByRole('heading', { name: 'Connexion conseiller' })).toBeInTheDocument()
  })
})

describe('Tableau de bord conseiller', () => {
  it("redirige vers la connexion si l'utilisateur n'est pas authentifié", async () => {
    installerFetch(() => ({ status: 401 }))
    renderApp('/conseiller/dashboard')

    expect(await screen.findByRole('heading', { name: 'Connexion conseiller' })).toBeInTheDocument()
  })

  it('liste les demandes avec leur statut', async () => {
    installerFetch(() => ({ status: 200, corps: DEMANDES }))
    renderApp('/conseiller/dashboard')

    expect(await screen.findByText('Dupont')).toBeInTheDocument()
    expect(screen.getByText('0612345678')).toBeInTheDocument()
    expect(screen.getByText('Virements – Virement international')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Marquer Alice Dupont comme appelé' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Marquer Marc Martin comme appelé' })).toBeChecked()
  })

  it("indique qu'il n'y a aucune demande", async () => {
    installerFetch(() => ({ status: 200, corps: [] }))
    renderApp('/conseiller/dashboard')

    expect(await screen.findByText('Aucune demande de rappel pour le moment.')).toBeInTheDocument()
  })

  it('permet de cocher puis décocher une demande', async () => {
    const fetchMock = installerFetch((url, init) => {
      if (init?.method === 'PATCH') {
        const id = Number(url.split('/')[3])
        const { appele } = JSON.parse(init.body as string)
        return { status: 200, corps: { ...DEMANDES.find((d) => d.id === id), appele } }
      }
      return { status: 200, corps: DEMANDES }
    })
    const user = userEvent.setup()
    renderApp('/conseiller/dashboard')

    const caseAlice = await screen.findByRole('checkbox', { name: 'Marquer Alice Dupont comme appelé' })
    await user.click(caseAlice)
    expect(caseAlice).toBeChecked()
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/demandes-rappel/1/appele',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ appele: true }) }),
    )

    await user.click(caseAlice)
    expect(caseAlice).not.toBeChecked()
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/demandes-rappel/1/appele',
      expect.objectContaining({ body: JSON.stringify({ appele: false }) }),
    )
  })

  it("garde l'état précédent et signale l'erreur si la mise à jour échoue", async () => {
    installerFetch((_url, init) =>
      init?.method === 'PATCH' ? { status: 500 } : { status: 200, corps: DEMANDES },
    )
    const user = userEvent.setup()
    renderApp('/conseiller/dashboard')

    const caseAlice = await screen.findByRole('checkbox', { name: 'Marquer Alice Dupont comme appelé' })
    await user.click(caseAlice)

    expect(await screen.findByRole('alert')).toHaveTextContent('La mise à jour a échoué')
    expect(caseAlice).not.toBeChecked()
  })

  it("déconnecte le conseiller et revient à l'accueil", async () => {
    const fetchMock = installerFetch((url) =>
      url === '/api/auth/logout' ? { status: 200 } : { status: 200, corps: [] },
    )
    const user = userEvent.setup()
    renderApp('/conseiller/dashboard')

    await user.click(await screen.findByRole('button', { name: 'Se déconnecter' }))

    expect(await screen.findByRole('heading', { name: 'Demande de rappel' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenLastCalledWith('/api/auth/logout', expect.objectContaining({ method: 'POST' }))
  })
})

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { installerFetch } from '../test/fetchMock'

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

async function remplirIdentite(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nom'), 'Dupont')
  await user.type(screen.getByLabelText('Prénom'), 'Alice')
  await user.type(screen.getByLabelText('Numéro de téléphone'), '06 12 34 56 78')
  await user.click(screen.getByRole('button', { name: 'Continuer' }))
}

async function choisirMotif(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('radio', { name: 'Virement international' }))
}

async function choisirCreneau(user: ReturnType<typeof userEvent.setup>) {
  const mercredi = within(screen.getByRole('group', { name: 'Mercredi' }))
  await user.click(mercredi.getByRole('radio', { name: '14h00-14h30' }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Parcours client', () => {
  it("refuse l'identité incomplète ou invalide sans changer d'écran", async () => {
    const user = userEvent.setup()
    renderApp('/client/identite')

    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    expect(screen.getByText('Le nom est obligatoire')).toBeInTheDocument()
    expect(screen.getByText('Le prénom est obligatoire')).toBeInTheDocument()
    expect(screen.getByText('Le numéro de téléphone est obligatoire')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Numéro de téléphone'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    expect(screen.getByText('Le numéro de téléphone est invalide')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Vos informations' })).toBeInTheDocument()
  })

  it('exige un motif et un créneau avant de continuer', async () => {
    const user = userEvent.setup()
    renderApp('/client/identite')
    await remplirIdentite(user)

    expect(screen.getByRole('heading', { name: 'Motif de votre demande' })).toBeInTheDocument()
    expect(screen.getAllByRole('group')).toHaveLength(5)
    expect(screen.getByRole('button', { name: 'Continuer' })).toBeDisabled()

    await choisirMotif(user)
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    expect(screen.getByRole('heading', { name: 'Créneau de rappel' })).toBeInTheDocument()
    expect(screen.getAllByRole('group')).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Continuer' })).toBeDisabled()
  })

  it('un seul motif peut être sélectionné à la fois', async () => {
    const user = userEvent.setup()
    renderApp('/client/identite')
    await remplirIdentite(user)

    await choisirMotif(user)
    await user.click(screen.getByRole('radio', { name: 'Crédit immobilier' }))

    expect(screen.getByRole('radio', { name: 'Crédit immobilier' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Virement international' })).not.toBeChecked()
  })

  it('conserve les saisies et sélections lors des retours en arrière', async () => {
    const user = userEvent.setup()
    renderApp('/client/identite')
    await remplirIdentite(user)
    await choisirMotif(user)
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await choisirCreneau(user)

    await user.click(screen.getByRole('button', { name: 'Retour' }))
    expect(screen.getByRole('radio', { name: 'Virement international' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Retour' }))
    expect(screen.getByLabelText('Nom')).toHaveValue('Dupont')
    expect(screen.getByLabelText('Prénom')).toHaveValue('Alice')
    expect(screen.getByLabelText('Numéro de téléphone')).toHaveValue('06 12 34 56 78')

    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    expect(
      within(screen.getByRole('group', { name: 'Mercredi' })).getByRole('radio', { name: '14h00-14h30' }),
    ).toBeChecked()
  })

  it('affiche le récapitulatif, enregistre la demande puis confirme', async () => {
    const fetchMock = installerFetch(() => ({
      status: 201,
      corps: {
        id: 1,
        nom: 'Dupont',
        prenom: 'Alice',
        numeroTelephone: '06 12 34 56 78',
        motif: 'Virements',
        sousMotif: 'Virement international',
        creneau: 'Mercredi 14h00-14h30',
        appele: false,
      },
    }))
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('button', { name: 'Client' }))
    await remplirIdentite(user)
    await choisirMotif(user)
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await choisirCreneau(user)
    await user.click(screen.getByRole('button', { name: 'Continuer' }))

    expect(screen.getByRole('heading', { name: 'Récapitulatif' })).toBeInTheDocument()
    expect(screen.getByText('Dupont')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('06 12 34 56 78')).toBeInTheDocument()
    expect(screen.getByText('Virements – Virement international')).toBeInTheDocument()
    expect(screen.getByText('Mercredi 14h00-14h30')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Valider' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/demandes-rappel')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(init?.body as string)).toEqual({
      nom: 'Dupont',
      prenom: 'Alice',
      numeroTelephone: '06 12 34 56 78',
      motif: 'Virements',
      sousMotif: 'Virement international',
      creneau: 'Mercredi 14h00-14h30',
    })

    expect(await screen.findByRole('heading', { name: 'Merci Alice !' })).toBeInTheDocument()
    expect(screen.getByText('Mercredi 14h00-14h30')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: "Retour à l'accueil" }))
    expect(screen.getByRole('heading', { name: 'Demande de rappel' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Client' }))
    expect(screen.getByLabelText('Nom')).toHaveValue('')
  })

  it("affiche l'erreur de l'API et permet de réessayer", async () => {
    installerFetch(() => ({ status: 400, corps: { message: 'Créneau inconnu', status: 400 } }))
    const user = userEvent.setup()
    renderApp('/client/identite')
    await remplirIdentite(user)
    await choisirMotif(user)
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await choisirCreneau(user)
    await user.click(screen.getByRole('button', { name: 'Continuer' }))

    await user.click(screen.getByRole('button', { name: 'Valider' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Créneau inconnu')
    expect(screen.getByRole('heading', { name: 'Récapitulatif' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Valider' })).toBeEnabled()
  })

  it("renvoie vers l'étape manquante en cas d'accès direct", () => {
    renderApp('/client/recapitulatif')
    expect(screen.getByRole('heading', { name: 'Vos informations' })).toBeInTheDocument()
  })

  it("renvoie vers l'accueil si aucune demande n'a été confirmée", () => {
    renderApp('/client/confirmation')
    expect(screen.getByRole('heading', { name: 'Demande de rappel' })).toBeInTheDocument()
  })
})

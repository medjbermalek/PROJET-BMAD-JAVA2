import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'

function renderAccueil() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

describe('Accueil', () => {
  it('affiche les deux boutons Client et Conseiller', () => {
    renderAccueil()
    expect(screen.getByRole('button', { name: 'Client' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Conseiller' })).toBeInTheDocument()
  })

  it('navigue vers /client/identite au clic sur Client', async () => {
    const { user } = await setupUserEvent(renderAccueil)
    await user.click(screen.getByRole('button', { name: 'Client' }))
    expect(screen.getByRole('heading', { name: 'Vos informations' })).toBeInTheDocument()
  })

  it('navigue vers /conseiller/login au clic sur Conseiller', async () => {
    const { user } = await setupUserEvent(renderAccueil)
    await user.click(screen.getByRole('button', { name: 'Conseiller' }))
    expect(screen.getByRole('heading', { name: 'Connexion conseiller' })).toBeInTheDocument()
  })
})

async function setupUserEvent(renderFn: () => void) {
  const { default: userEvent } = await import('@testing-library/user-event')
  renderFn()
  return { user: userEvent.setup() }
}

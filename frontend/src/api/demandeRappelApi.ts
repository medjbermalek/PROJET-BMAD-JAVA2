import type { DemandeRappelRequest, DemandeRappelResponse } from '../types/demandeRappel'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function appeler(url: string, init?: RequestInit): Promise<Response> {
  const reponse = await fetch(url, init)
  if (!reponse.ok) {
    let message = 'Une erreur est survenue, veuillez réessayer.'
    try {
      const corps = await reponse.json()
      if (typeof corps?.message === 'string') message = corps.message
    } catch {
      // corps absent ou non JSON : message par défaut
    }
    throw new ApiError(reponse.status, message)
  }
  return reponse
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function creerDemande(demande: DemandeRappelRequest): Promise<DemandeRappelResponse> {
  const reponse = await appeler('/api/demandes-rappel', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(demande),
  })
  return reponse.json()
}

export async function listerDemandes(): Promise<DemandeRappelResponse[]> {
  const reponse = await appeler('/api/demandes-rappel')
  return reponse.json()
}

export async function marquerAppele(id: number, appele: boolean): Promise<DemandeRappelResponse> {
  const reponse = await appeler(`/api/demandes-rappel/${id}/appele`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ appele }),
  })
  return reponse.json()
}

export async function seConnecter(username: string, password: string): Promise<void> {
  try {
    await appeler('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    })
  } catch (erreur) {
    if (erreur instanceof ApiError && erreur.status === 401) {
      throw new ApiError(401, 'Identifiant ou mot de passe incorrect')
    }
    throw erreur
  }
}

export async function seDeconnecter(): Promise<void> {
  await appeler('/api/auth/logout', { method: 'POST' })
}

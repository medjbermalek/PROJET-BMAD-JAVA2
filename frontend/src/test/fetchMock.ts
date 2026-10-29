import { vi } from 'vitest'

type Gestionnaire = (url: string, init?: RequestInit) => { status: number; corps?: unknown }

export function installerFetch(gestionnaire: Gestionnaire) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const { status, corps } = gestionnaire(url, init)
    return new Response(corps === undefined ? null : JSON.stringify(corps), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

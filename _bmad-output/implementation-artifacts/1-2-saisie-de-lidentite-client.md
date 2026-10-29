# Story 1.2: Saisie de l'identité client

Status: review

## Story

As a client,
I want saisir mon nom, prénom et numéro de téléphone,
so that le conseiller puisse me recontacter.

## Acceptance Criteria

1. **Given** je suis sur l'écran de saisie d'identité (`/client/identite`) **When** je remplis nom, prénom, téléphone et clique "Continuer" **Then** mes informations sont conservées dans l'état du formulaire (Context) **And** je suis redirigé vers l'écran de sélection du motif.
2. Un champ vide ou un téléphone invalide bloque la navigation et affiche un message sous le champ concerné.

## Tasks / Subtasks

- [x] Task 1: Mettre en place l'état du formulaire multi-étapes (AC: #1)
  - [x] `context/demandeRappelState.ts` : état, actions, `useReducer` immuable, hook `useDemandeRappel`
  - [x] `context/DemandeRappelContext.tsx` : provider monté dans `App`
- [x] Task 2: Écran d'identité (AC: #1, #2)
  - [x] `pages/EcranIdentite.tsx` (remplace le placeholder `ClientIdentite.tsx` de la Story 1.1) avec composant réutilisable `components/ChampTexte.tsx`
  - [x] Validation : champs obligatoires, téléphone `^\+?[0-9 .()-]{8,20}$` (identique au backend)
  - [x] Champs préremplis depuis le Context lors d'un retour en arrière
- [x] Task 3: Tests (AC: #1, #2)
  - [x] Vitest : erreurs sur champs vides/téléphone invalide sans changement d'écran

## Dev Notes

- Le reducer est dans un fichier `.ts` séparé du provider pour respecter la règle ESLint `react-refresh/only-export-components`.
- Les écrans suivants ne sont accessibles qu'avec une identité complète (redirection vers `/client/identite` sinon).

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Completion Notes List

- Identité conservée dans le Context au clic sur "Continuer" (valeurs nettoyées par `trim`).
- Vérifié dans Edge : erreurs affichées sur formulaire vide, navigation vers `/client/motif` après saisie valide.

### File List

- `frontend/src/context/demandeRappelState.ts`, `frontend/src/context/DemandeRappelContext.tsx`
- `frontend/src/components/ChampTexte.tsx`, `frontend/src/components/NavigationEtape.tsx`
- `frontend/src/pages/EcranIdentite.tsx` (remplace `ClientIdentite.tsx`, supprimé)
- `frontend/src/types/demandeRappel.ts`, `frontend/src/data/referentiel.ts`
- `frontend/src/App.tsx`, `frontend/src/index.css`, `frontend/src/pages/ParcoursClient.test.tsx`, `frontend/src/test/fetchMock.ts`

### Change Log

- 2026-10-29 : Story 1.2 implémentée ; statut `review`.

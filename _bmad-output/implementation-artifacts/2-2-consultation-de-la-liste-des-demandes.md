# Story 2.2: Consultation de la liste des demandes

Status: review

## Story

As a conseiller authentifié,
I want consulter la liste de toutes les demandes de rappel soumises,
so that je sache qui rappeler et pourquoi.

## Acceptance Criteria

1. **Given** je suis authentifié et des demandes existent en base **When** j'accède au tableau de bord **Then** je vois un tableau listant nom, prénom, téléphone et motif de chaque demande.
2. **And** si je ne suis pas authentifié, l'accès au tableau de bord est refusé.

## Tasks / Subtasks

- [x] Task 1: API de liste (AC: #1, #2)
  - [x] `GET /api/demandes-rappel` (rôle `CONSEILLER`), ordre d'arrivée
- [x] Task 2: Tableau de bord (AC: #1, #2)
  - [x] `pages/ConseillerDashboard.tsx` : tableau (appelé, nom, prénom, téléphone, motif – sous-motif, créneau), états chargement/vide/erreur
  - [x] Réponse `401` : redirection vers `/conseiller/login` ; bouton "Se déconnecter"
- [x] Task 3: Tests
  - [x] MockMvc : `401` sans session, liste avec session
  - [x] Vitest : affichage, état vide, redirection si non authentifié, déconnexion

## Dev Notes

- Le créneau est affiché en plus des champs demandés : utile au conseiller pour choisir quand rappeler.

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Completion Notes List

- Vérifié dans Edge : demande créée côté client visible dans le tableau ; rechargement direct du tableau possible tant que la session est valide ; après déconnexion, `/conseiller/dashboard` renvoie vers la connexion.

### File List

- `frontend/src/pages/ConseillerDashboard.tsx`, `frontend/src/pages/ConseillerEspace.test.tsx`, `frontend/src/index.css`

### Change Log

- 2026-10-29 : Story 2.2 implémentée ; statut `review`.

# Story 2.3: Marquage et démarquage des demandes appelées

Status: review

## Story

As a conseiller,
I want cocher une demande après l'avoir appelée (et décocher en cas d'erreur),
so that je garde une vue claire des rappels restants à effectuer.

## Acceptance Criteria

1. **Given** je consulte le tableau de bord des demandes **When** je coche la case d'une demande **Then** son statut `appele` passe à `true` et est persisté en base.
2. **And** si je décoche une case précédemment cochée, son statut repasse à `false`.

## Tasks / Subtasks

- [x] Task 1: API de mise à jour (AC: #1, #2)
  - [x] `PATCH /api/demandes-rappel/{id}/appele` avec `{ "appele": true|false }` (valeur explicite, donc idempotent) ; `404` si l'id est inconnu, `400` si le statut est absent
- [x] Task 2: Case à cocher (AC: #1, #2)
  - [x] `ConseillerDashboard` : mise à jour depuis la réponse du serveur, case désactivée pendant l'appel, ligne cochée atténuée
  - [x] Échec : état précédent conservé et message d'erreur
- [x] Task 3: Tests
  - [x] MockMvc : cocher/décocher persisté, `404`, `400`, `401`
  - [x] Vitest : cocher/décocher, échec de mise à jour

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Completion Notes List

- Vérifié dans Edge : la case cochée reste cochée après rechargement de la page (persistance), puis se décoche.

### File List

- `backend/src/main/java/com/bmad/callback/controller/DemandeRappelController.java`, `service/DemandeRappelService.java`, `dto/AppeleRequest.java`
- `frontend/src/pages/ConseillerDashboard.tsx`

### Change Log

- 2026-10-29 : Story 2.3 implémentée ; statut `review`.

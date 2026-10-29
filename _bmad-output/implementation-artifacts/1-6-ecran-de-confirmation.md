# Story 1.6: Écran de confirmation

Status: review

## Story

As a client,
I want voir un message de confirmation après validation,
so that je sois rassuré qu'un conseiller va me rappeler.

## Acceptance Criteria

1. **Given** ma demande vient d'être validée et enregistrée **When** j'arrive sur l'écran de confirmation (`/client/confirmation`) **Then** je vois un message m'indiquant qu'un conseiller va me rappeler au créneau choisi.
2. **And** un bouton "Retour à l'accueil" me ramène à l'écran d'accueil, avec un formulaire vierge pour une nouvelle demande.

## Tasks / Subtasks

- [x] Task 1: Écran de confirmation (AC: #1, #2)
  - [x] `pages/EcranCelebration.tsx` : prénom, créneau et sous-motif issus de la réponse de l'API (état `confirmation`)
  - [x] "Retour à l'accueil" : action `REINITIALISER` puis navigation vers `/`
  - [x] Accès direct sans demande confirmée : redirection vers `/`
- [x] Task 2: Tests
  - [x] Vitest : parcours complet jusqu'à la confirmation, retour à l'accueil, formulaire vide au parcours suivant

## Dev Notes

- L'action `CONFIRMER` vide le formulaire ; `EcranRecapitulatif` redirige alors vers la confirmation (évite un renvoi vers l'identité).

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Completion Notes List

- Vérifié dans Edge : après "Valider", la page affiche « Merci Alice ! » et le créneau ; "Retour à l'accueil" revient sur `/`.

### File List

- `frontend/src/pages/EcranCelebration.tsx`

### Change Log

- 2026-10-29 : Story 1.6 implémentée ; statut `review`.

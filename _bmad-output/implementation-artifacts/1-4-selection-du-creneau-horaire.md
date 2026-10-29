# Story 1.4: Sélection du créneau horaire

Status: review

## Story

As a client,
I want choisir un créneau de 30 minutes parmi une liste hebdomadaire statique (lundi-samedi),
so that le conseiller m'appelle à un moment qui me convient.

## Acceptance Criteria

1. **Given** je suis sur l'écran des créneaux (`/client/creneau`) après avoir choisi mon motif **When** je sélectionne un créneau et clique "Continuer" **Then** je suis redirigé vers l'écran de récapitulatif avec toutes mes informations.
2. **And** si je clique "Retour", je reviens à l'écran des motifs sans perdre ma sélection de créneau précédente.
3. Le référentiel propose 3 à 5 créneaux de 30 minutes par jour, du lundi au samedi.

## Tasks / Subtasks

- [x] Task 1: Référentiel des créneaux (AC: #3)
  - [x] Backend : `model/Creneau.java` (lundi-vendredi : 4 créneaux ; samedi : 3 créneaux) avec `estValide`
  - [x] Frontend : `CRENEAUX` et `libelleCreneau` dans `data/referentiel.ts` (format `Mercredi 14h00-14h30`)
- [x] Task 2: Écran créneau (AC: #1, #2)
  - [x] `pages/EcranCreneau.tsx` : un groupe par jour, radio exclusifs, sélection enregistrée dans le Context
  - [x] Accès direct sans motif : redirection vers `/client/motif`
- [x] Task 3: Tests (AC: #1, #2)
  - [x] Vitest : bouton désactivé sans choix, créneau conservé après allers-retours

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Completion Notes List

- 22 créneaux (5 jours x 4 + samedi x 3). Contrôlé dans Edge : le créneau reste coché après Retour puis Continuer.

### File List

- `backend/src/main/java/com/bmad/callback/model/Creneau.java`
- `frontend/src/pages/EcranCreneau.tsx`, `frontend/src/data/referentiel.ts`

### Change Log

- 2026-10-29 : Story 1.4 implémentée ; statut `review`.

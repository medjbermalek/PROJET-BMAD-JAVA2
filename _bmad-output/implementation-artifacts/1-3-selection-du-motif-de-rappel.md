# Story 1.3: Sélection du motif de rappel

Status: review

## Story

As a client,
I want choisir un motif et un sous-motif parmi une liste de 5 catégories,
so that le conseiller sache pourquoi je souhaite être rappelé.

## Acceptance Criteria

1. **Given** je suis sur l'écran des motifs (`/client/motif`) après avoir saisi mon identité **When** je sélectionne un motif/sous-motif via les radio boutons et clique "Continuer" **Then** mon choix est conservé et je suis redirigé vers l'écran des créneaux.
2. Un seul sous-motif peut être sélectionné à la fois, et "Continuer" reste désactivé tant qu'aucun choix n'est fait.
3. **And** si je clique "Retour", je reviens à l'écran d'identité sans perdre mes informations déjà saisies.

## Tasks / Subtasks

- [x] Task 1: Référentiel des motifs (AC: #1)
  - [x] Backend : enum `model/Motif.java` (5 motifs, 2 sous-motifs chacun) avec validation `estValide`
  - [x] Frontend : constante `MOTIFS` dans `data/referentiel.ts`
- [x] Task 2: Écran motif (AC: #1, #2, #3)
  - [x] `components/RadioListe.tsx` (fieldset/legend, radio exclusifs)
  - [x] `pages/EcranMotif.tsx` : un groupe par motif, tous partageant `name="motif"` ; sélection enregistrée dans le Context dès le choix
  - [x] "Retour" vers `/client/identite`, champs préremplis
- [x] Task 3: Tests (AC: #1–#3)
  - [x] Vitest : 5 groupes, bouton désactivé, exclusivité, conservation au retour

## Dev Notes

- Les listes sont dupliquées côté frontend/backend (décision d'architecture : données statiques) ; le backend refuse toute valeur hors référentiel.

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Completion Notes List

- Vérifié dans Edge : sélection de "Virement international", "Retour" puis retour sur l'écran conservent la saisie et le choix.

### File List

- `backend/src/main/java/com/bmad/callback/model/Motif.java`
- `frontend/src/components/RadioListe.tsx`, `frontend/src/pages/EcranMotif.tsx`, `frontend/src/data/referentiel.ts`

### Change Log

- 2026-10-29 : Story 1.3 implémentée ; statut `review`.

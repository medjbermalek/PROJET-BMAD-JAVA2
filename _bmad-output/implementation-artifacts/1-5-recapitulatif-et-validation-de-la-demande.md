# Story 1.5: Récapitulatif et validation de la demande

Status: review

## Story

As a client,
I want consulter un récapitulatif complet de ma demande avant de la valider,
so that je sois sûr que les informations transmises sont correctes.

## Acceptance Criteria

1. **Given** je suis sur l'écran de récapitulatif (`/client/recapitulatif`) avec identité, motif et créneau renseignés **When** je clique "Valider" **Then** une entité `DemandeRappel` est créée et persistée en base H2 avec `appele = false` **And** je suis redirigé vers l'écran de confirmation.
2. Aucune donnée n'est enregistrée avant le clic sur "Valider".
3. Une erreur de l'API s'affiche sous le formulaire et permet de réessayer.

## Tasks / Subtasks

- [x] Task 1: Persistance (AC: #1)
  - [x] `model/DemandeRappel.java` (entité), `repository/DemandeRappelRepository.java`
  - [x] H2 fichier (`jdbc:h2:file:./data/callback`), `ddl-auto=update`, `open-in-view=false` ; `backend/data/` ajouté au `.gitignore`
- [x] Task 2: API de création (AC: #1, #3)
  - [x] `POST /api/demandes-rappel` public, `201` + `DemandeRappelResponse` ; `DemandeRappelRequest` avec Bean Validation
  - [x] `DemandeRappelService.creer` : motif/sous-motif et créneau contrôlés contre le référentiel
  - [x] `GlobalExceptionHandler` (`@RestControllerAdvice`) : réponses `{ message, status }`
- [x] Task 3: Écran récapitulatif (AC: #1, #2, #3)
  - [x] `pages/EcranRecapitulatif.tsx` + `api/demandeRappelApi.ts` ; double envoi empêché pendant la requête
- [x] Task 4: Tests
  - [x] JUnit/MockMvc : création, téléphone invalide, motif/créneau hors référentiel
  - [x] Vitest : contenu du récapitulatif, corps de la requête, erreur API

## Dev Notes

- Dépendances ajoutées : `spring-boot-starter-validation`, `spring-boot-starter-security` (Story 2.1).
- Les tests backend utilisent une H2 mémoire (`src/test/resources/application.properties`) pour ne pas toucher `./data`.

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Completion Notes List

- Vérifié sur le jar : `POST` renvoie `201`, `appele=false`, la demande est relue ensuite par le conseiller.

### File List

- `backend/pom.xml`, `backend/.gitignore`, `backend/src/main/resources/application.properties`, `backend/src/test/resources/application.properties`
- `backend/src/main/java/com/bmad/callback/model/DemandeRappel.java`, `repository/DemandeRappelRepository.java`, `service/DemandeRappelService.java`, `controller/DemandeRappelController.java`
- `backend/src/main/java/com/bmad/callback/dto/{DemandeRappelRequest,DemandeRappelResponse,AppeleRequest,ErreurApi}.java`, `exception/{GlobalExceptionHandler,DonneeInvalideException,DemandeIntrouvableException}.java`
- `backend/src/test/java/com/bmad/callback/controller/DemandeRappelControllerTest.java`
- `frontend/src/pages/EcranRecapitulatif.tsx`, `frontend/src/api/demandeRappelApi.ts`

### Change Log

- 2026-10-29 : Story 1.5 implémentée ; statut `review`.

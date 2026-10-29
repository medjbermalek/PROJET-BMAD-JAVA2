# Story 2.1: Authentification conseiller

Status: review

## Story

As a conseiller,
I want m'authentifier avec un identifiant et mot de passe,
so that j'accède de façon sécurisée au tableau des demandes.

## Acceptance Criteria

1. **Given** je clique sur "Conseiller" depuis l'écran d'accueil **When** je saisis `admin`/`admin` et valide **Then** une session est créée et je suis redirigé vers le tableau de bord (`/conseiller/dashboard`).
2. **And** si les identifiants sont incorrects, un message d'erreur s'affiche et je reste sur l'écran de connexion.

## Tasks / Subtasks

- [x] Task 1: Sécurité backend (AC: #1, #2)
  - [x] `config/SecurityConfig.java` : utilisateur en mémoire `admin`/`admin` (rôle `CONSEILLER`), `formLogin` sur `POST /api/auth/login` (200/401), `POST /api/auth/logout`
  - [x] `POST /api/demandes-rappel` et routes frontend publics ; tout autre `/api/**` exige le rôle ; non authentifié = `401` (pas de redirection)
  - [x] Cookie de session `SameSite=Lax` ; CSRF désactivé (MVP local, commenté dans le code)
  - [x] `controller/SpaRoutesController.java` : renvoie `/client/{etape}` et `/conseiller/{page}` vers `index.html` (rechargement direct)
- [x] Task 2: Écran de connexion (AC: #1, #2)
  - [x] `pages/ConseillerLogin.tsx` (remplace le placeholder de la Story 1.1), message « Identifiant ou mot de passe incorrect »
- [x] Task 3: Tests
  - [x] MockMvc : login valide/invalide, session donnant accès à la liste, déconnexion
  - [x] Vitest : succès et échec de connexion

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Completion Notes List

- Vérifié sur le jar et dans Edge : mauvais mot de passe = alerte et reste sur `/conseiller/login` ; `admin`/`admin` ouvre le tableau de bord.
- Le proxy Vite redirige `/api` vers `localhost:8080` pour le développement.

### File List

- `backend/src/main/java/com/bmad/callback/config/SecurityConfig.java`, `controller/SpaRoutesController.java` (déplacé depuis le package racine)
- `backend/src/test/java/com/bmad/callback/CallbackBackendApplicationTests.java`
- `frontend/src/pages/ConseillerLogin.tsx`, `frontend/vite.config.ts`

### Change Log

- 2026-10-29 : Story 2.1 implémentée ; statut `review`.

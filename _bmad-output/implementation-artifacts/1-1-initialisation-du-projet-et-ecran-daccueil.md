# Story 1.1: Initialisation du projet et écran d'accueil

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client ou conseiller,
I want accéder à l'application via `localhost:8080` et voir un écran d'accueil avec deux choix,
so that je puisse démarrer le parcours qui me concerne.

## Acceptance Criteria

1. **Given** les projets backend (Spring Boot) et frontend (React/Vite) sont initialisés et le build frontend est servi par le backend, **When** j'accède à `localhost:8080`, **Then** je vois un écran d'accueil avec deux boutons "Client" et "Conseiller".
2. **And** cliquer sur "Client" me dirige vers l'écran de saisie d'identité (route `/client/identite`, créée vide/placeholder dans cette story — son implémentation complète est couverte par la Story 1.2).
3. Le bouton "Conseiller" peut pointer vers une route placeholder (`/conseiller/login`), implémentée en Story 2.1.

## Tasks / Subtasks

- [x] Task 1: Initialiser le projet backend Spring Boot (AC: #1)
  - [x] Générer le projet via Spring Initializr : Group `com.bmad`, Artifact `callback-backend`, Java 21, Maven, Spring Boot 4.1.2
  - [x] Ajouter les dépendances : Spring Web, Spring Data JPA, H2 Database
  - [x] Placer le projet dans `backend/` à la racine du dépôt
  - [x] Vérifier que `mvn spring-boot:run` démarre l'application sur le port 8080
- [x] Task 2: Initialiser le projet frontend React (AC: #1)
  - [x] Exécuter `npm create vite@latest frontend -- --template react-ts` à la racine du dépôt
  - [x] Installer les dépendances (`npm install`) et vérifier que `npm run dev` fonctionne
  - [x] Installer React Router (`react-router-dom`) pour la gestion des routes
- [x] Task 3: Créer l'écran d'accueil (AC: #1, #2, #3)
  - [x] Créer le composant `src/pages/Accueil.tsx` avec deux boutons "Client" et "Conseiller"
  - [x] Configurer le routage racine (`/`) vers `Accueil.tsx`
  - [x] Le bouton "Client" navigue vers `/client/identite` (route placeholder, contenu réel en Story 1.2)
  - [x] Le bouton "Conseiller" navigue vers `/conseiller/login` (route placeholder, contenu réel en Story 2.1)
- [x] Task 4: Unifier le service sur le port 8080 (AC: #1)
  - [x] Configurer le build Maven pour copier `frontend/dist` dans `backend/target/classes/static` avant le packaging (`mvn package`), sans écrire de fichiers générés dans les sources
  - [x] Vérifier qu'après un `mvn package` + exécution du jar, `localhost:8080` sert bien l'écran d'accueil React (et pas uniquement l'API)
- [x] Task 5: Vérification manuelle (AC: #1, #2, #3)
  - [x] Démarrer l'application packagée et confirmer que l'écran d'accueil s'affiche sur `localhost:8080`
  - [x] Confirmer la navigation vers les deux routes placeholder

## Dev Notes

- **Stack imposée** : Java 21, Maven, Spring Boot 4.1.2 (backend) ; React + TypeScript via Vite (frontend). Aucune autre option de starter ne doit être utilisée pour cette story. [Source: architecture.md#Starter Template Evaluation]
- **Pas de wrapper de réponse API custom à cette étape** — cette story ne crée aucun endpoint API, uniquement le scaffolding et l'UI statique.
- **Aucune entité de base de données n'est créée dans cette story** — `DemandeRappel` sera créée en Story 1.5, au moment où la persistance devient nécessaire (principe "créer uniquement quand nécessaire"). [Source: architecture.md#Data Architecture]
- **Service unifié obligatoire** : le PRD exige un accès unique via `localhost:8080` — ne pas laisser le frontend tourner sur un port séparé en production (Vite dev server reste uniquement pour le développement local, avec proxy vers l'API si besoin). [Source: architecture.md#Development Workflow Integration]
- **Conventions de nommage** : composants React en `PascalCase.tsx` dans `src/pages/` ; classes Java en `PascalCase` dans `com.bmad.callback.*`. [Source: architecture.md#Naming Patterns]

### Project Structure Notes

- Structure cible : mono-dépôt avec `backend/` (Maven standard `src/main/java`, `src/main/resources`) et `frontend/` (Vite standard `src/`). [Source: architecture.md#Complete Project Directory Structure]
- Le composant d'accueil doit être placé dans `frontend/src/pages/Accueil.tsx`, cohérent avec le mapping FR1/FR2 → `pages/Accueil.tsx` défini dans l'architecture.
- Aucune variance détectée entre cette story et la structure définie — première story du projet, structure à créer intégralement.

### References

- [Source: epics.md#Story 1.1: Initialisation du projet et écran d'accueil]
- [Source: prd.md#Navigation & Accueil] (FR1, FR2)
- [Source: architecture.md#Starter Template Evaluation]
- [Source: architecture.md#Complete Project Directory Structure]
- [Source: architecture.md#Development Workflow Integration]

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build` dans `frontend/`
- `mvn -q clean package`, `mvn spring-boot:run` dans `backend/`
- Requêtes HTTP et captures Edge headless sur `/`, `/client/identite` et `/conseiller/login` (jar packagé, port 8080)

### Completion Notes List

- Scaffolds Spring Boot 4.1.2 (cible Java 21) et React/Vite/TypeScript, routage et écran d'accueil responsive en français.
- Renvoi des deux routes React vers `index.html` côté Spring pour rendre possible l'accès direct et le rechargement ; les routes inconnues comme `/api/inconnue` restent en 404.
- Frontend embarqué dans le jar via le build Vite préalable ; trois tests React et deux tests Spring passent.
- Vérification visuelle de l'accueil (desktop et fenêtre compacte) et des deux placeholders ouverts directement dans Edge. Le JDK installé est 24.0.2 ; la compilation Maven cible Java 21.

### File List

- `README.md`
- `backend/pom.xml`, `backend/src/main/java/com/bmad/callback/CallbackBackendApplication.java`, `backend/src/main/java/com/bmad/callback/SpaRoutesController.java`, `backend/src/main/resources/application.properties`, `backend/src/test/java/com/bmad/callback/CallbackBackendApplicationTests.java`
- `backend/mvnw`, `backend/mvnw.cmd`, `backend/.mvn/wrapper/maven-wrapper.properties`, `backend/.gitignore`, `backend/.gitattributes` (scaffold Initializr)
- `frontend/package.json`, `frontend/package-lock.json`, `frontend/vite.config.ts`, `frontend/tsconfig.app.json`, `frontend/index.html`
- `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/src/index.css`, `frontend/src/pages/Accueil.tsx`, `frontend/src/pages/ClientIdentite.tsx` (placeholder, remplacé par `EcranIdentite.tsx` en Story 1.2), `frontend/src/pages/ConseillerLogin.tsx`, `frontend/src/pages/Accueil.test.tsx`, `frontend/src/test/setup.ts`
- `frontend/tsconfig.json`, `frontend/tsconfig.node.json`, `frontend/eslint.config.js`, `frontend/.gitignore`, `frontend/README.md`, `frontend/public/`, `frontend/src/assets/` (scaffold Vite)

### Change Log

- 2026-10-29 : Story 1.1 implémentée et validée ; statut passé en `review`.

---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-10-29'
project_name: 'PROJET-BMAD-JAVA2'
user_name: 'Malik'
date: '2026-10-29'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
21 FR organisées en 7 zones de capacité : Navigation & Accueil, Enregistrement Client, Sélection Motif, Sélection Créneau, Récapitulatif & Validation, Confirmation, Authentification Conseiller, Gestion des Demandes. Architecturalement, cela implique : un routage client multi-écrans avec état de formulaire préservé entre les étapes, une API REST exposant la création de demande et la gestion de son statut, et une authentification basique côté conseiller.

**Non-Functional Requirements:**
Performance légère (transitions < 1s, chargement < 2s) adaptée à un faible volume de données. Sécurité minimale assumée pour ce MVP (auth statique, aucune donnée financière sensible, environnement local sans exposition réseau) — ces NFR orientent vers une architecture simple sans complexité de sécurité avancée (pas de JWT, pas de gestion de rôles multiples pour le MVP).

**Scale & Complexity:**
- Primary domain: web_app full-stack (React SPA + API Spring Boot + H2)
- Complexity level: faible (CRUD simple, une seule entité métier principale)
- Estimated architectural components: Frontend SPA (routage, formulaire multi-étapes), API REST (3-4 endpoints), couche de persistance H2 (1-2 entités : DemandeRappel, éventuellement Motif/Creneau en données statiques)

### Technical Constraints & Dependencies

- Stack imposée : React (frontend), Spring Boot (backend), H2 (base de données)
- Exécution strictement locale (`localhost:8080`), pas de déploiement réseau pour ce MVP
- Motifs/sous-motifs et créneaux horaires sont des données statiques (codées en dur ou seedées), pas de gestion dynamique en base pour le MVP

### Cross-Cutting Concerns Identified

- Gestion de l'état du formulaire client à travers les écrans (préservation des données lors des retours en arrière)
- Authentification partagée pour protéger l'accès au back-office conseiller
- Cohérence du statut "appelé" (toggle réversible) entre l'interface et la base de données

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web_app : frontend SPA (React) + backend API (Spring Boot) + base de données H2.

### Starter Options Considered

- **Backend** : génération via start.spring.io (Spring Initializr) — standard de facto pour tout projet Spring Boot, garantit une structure Maven à jour.
- **Frontend** : `npm create vite@latest` avec template `react-ts` — remplace Create React App (déprécié), offre un serveur de dev rapide et une configuration TypeScript prête à l'emploi.

### Selected Starter: Spring Initializr + Vite (react-ts)

**Rationale for Selection:**
Combinaison standard et actuelle pour une stack React/Spring Boot/H2 ; aucune fonctionnalité avancée (SSR, PWA, temps réel) n'est nécessaire pour ce MVP, donc pas besoin de framework full-stack (Next.js, RedwoodJS).

**Initialization Commands:**

```bash
# Backend (depuis start.spring.io ou Spring CLI)
# Group: com.bmad, Artifact: callback-backend, Java 21, Maven, Spring Boot 4.1.2
# Dépendances : Spring Web, Spring Data JPA, H2 Database

# Frontend
npm create vite@latest frontend -- --template react-ts
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime :** Java 21 (backend), TypeScript (frontend)
**Styling Solution :** CSS simple (fichiers `.css` par composant), pas de librairie pour le MVP
**Build Tooling :** Maven (backend), Vite (frontend)
**Testing Framework :** JUnit 5 (inclus par défaut avec Spring Boot) ; Vitest à ajouter côté frontend si besoin de tests
**Code Organization :** Structure Maven standard (`src/main/java`, `src/main/resources`) pour le backend ; structure Vite standard (`src/`) pour le frontend ; un seul dépôt avec `frontend/` et `backend/`
**Development Experience :** Hot reload Vite côté frontend ; Spring Boot DevTools pour rechargement à chaud côté backend

**Note :** L'initialisation du projet avec ces commandes doit être la première story d'implémentation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Modèle de données (entité `DemandeRappel`), authentification conseiller (Spring Security + utilisateur en mémoire), style API (REST/JSON)

**Important Decisions (Shape Architecture):**
- Gestion d'état du formulaire multi-étapes (Context + useReducer), structure du routing frontend

**Deferred Decisions (Post-MVP):**
- Système de migration de schéma (Flyway/Liquibase) — différé car `ddl-auto=update` suffit pour ce MVP
- Rôles/permissions multiples — différé, un seul rôle `CONSEILLER` suffit
- CI/CD et hébergement distant — différé, exécution locale uniquement

### Data Architecture

- **Entité principale :** `DemandeRappel` (nom, prénom, téléphone, motif, sousMotif, créneau, `appele: boolean`)
- **Motifs/sous-motifs et créneaux horaires :** données statiques (enum Java ou constantes), pas de table dédiée
- **Validation :** Bean Validation (`jakarta.validation`) sur les DTOs de requête
- **Schéma DB :** génération automatique via Hibernate (`ddl-auto=update`), pas de migration nécessaire
- **Cache :** aucun

### Authentication & Security

- **Méthode :** Spring Security avec un utilisateur unique en mémoire (`admin`/`admin`), authentification par formulaire + session HTTP
- **Autorisation :** un seul rôle (`CONSEILLER`)
- **Exposition API :** endpoints du parcours client publics ; endpoints du tableau de bord conseiller protégés par session

### API & Communication Patterns

- **Style :** REST + JSON, `@RestController` Spring Web
- **Gestion des erreurs :** `@ControllerAdvice` centralisé
- Pas de GraphQL, pas de rate limiting, pas de versionnement d'API

### Frontend Architecture

- **Gestion d'état :** `useState`/`useReducer` + React Context pour le formulaire multi-étapes
- **Routing :** React Router
- **Organisation :** une page/composant par écran (Accueil, Identité, Motif, Créneau, Récapitulatif, Célébration, Login Conseiller, Dashboard Conseiller)

### Infrastructure & Deployment

- **Hébergement :** aucun — exécution locale (`localhost`) uniquement
- **CI/CD :** non applicable pour ce MVP
- **Monitoring/logs :** logs console standards Spring Boot

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialisation des deux projets (backend Spring Initializr, frontend Vite)
2. Modèle de données et persistance H2 (`DemandeRappel`)
3. Endpoints REST du parcours client (création de demande)
4. Sécurité Spring Security (authentification conseiller)
5. Endpoints REST du parcours conseiller (liste, toggle statut)
6. Composants frontend du parcours client (routing + Context)
7. Composants frontend du back-office conseiller

**Cross-Component Dependencies:**
- L'authentification conseiller (Spring Security) doit être en place avant d'exposer les endpoints du tableau de bord
- Le Context frontend du formulaire multi-étapes dépend du routing (React Router) pour fonctionner à travers les écrans

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 5 zones où des agents IA différents pourraient diverger (nommage, structure, formats API, gestion d'état frontend, gestion des erreurs)

### Naming Patterns

**Database Naming Conventions:**
- Tables : `snake_case` singulier (ex: `demande_rappel`) — convention standard Hibernate/JPA
- Colonnes : `snake_case` (ex: `numero_telephone`, `appele`)

**API Naming Conventions:**
- Endpoints REST : pluriel, kebab-case (ex: `/api/demandes-rappel`, `/api/auth/login`)
- Paramètres de route : `{id}` (format Spring standard)
- Champs JSON : `camelCase` (ex: `numeroTelephone`, `sousMotif`)

**Code Naming Conventions:**
- Backend (Java) : classes `PascalCase` (`DemandeRappel`, `DemandeRappelController`), méthodes/variables `camelCase`
- Frontend (React/TS) : composants `PascalCase.tsx` (ex: `EcranMotif.tsx`), hooks/fonctions `camelCase`

### Structure Patterns

**Project Organization (Backend) :**
- `com.bmad.callback.controller`, `.service`, `.repository`, `.model`, `.dto`
- Tests co-localisés dans `src/test/java` (structure miroir du `main`)

**Project Organization (Frontend) :**
- `src/pages/` (un composant par écran), `src/components/` (éléments réutilisables), `src/context/` (état du formulaire multi-étapes)
- Pas de séparation par type (containers/presentational) — trop complexe pour ce MVP

### Format Patterns

**API Response Formats :**
- Réponse directe en JSON (pas de wrapper `{data: ...}`) — simplicité pour ce MVP
- Erreurs : `{ "message": string, "status": number }` via `@ControllerAdvice`
- Dates : non utilisées dans les échanges (les créneaux sont des libellés statiques, ex: `"Mercredi 14h00-14h30"`)

### Communication Patterns

**State Management Patterns (Frontend) :**
- Mises à jour d'état immuables via `useReducer` dans le Context du formulaire
- Pas de système d'événements custom — React Context suffit pour cette échelle

### Process Patterns

**Error Handling Patterns :**
- Backend : exceptions métier capturées par `@ControllerAdvice`, retour JSON structuré
- Frontend : affichage d'un message d'erreur simple sous le formulaire en cas d'échec API (pas de toast/notification globale pour ce MVP)

**Loading State Patterns :**
- État de chargement local par écran (`isLoading` booléen), pas de gestion globale

### Enforcement Guidelines

**All AI Agents MUST:**
- Respecter le nommage `camelCase` pour le JSON et `snake_case` pour la base de données
- Placer chaque nouvel écran client dans `src/pages/` avec son propre fichier
- Utiliser `@ControllerAdvice` pour toute nouvelle exception métier, jamais de gestion d'erreur ad-hoc par contrôleur

### Pattern Examples

**Good Examples :**
- `GET /api/demandes-rappel` retourne `[{ "id": 1, "nom": "Dupont", "sousMotif": "Virement international", "appele": false }]`

**Anti-Patterns :**
- Mélanger `snake_case` et `camelCase` dans les mêmes réponses JSON
- Créer un nouveau système de gestion d'état (Redux) en parallèle du Context déjà choisi

## Project Structure & Boundaries

### Complete Project Directory Structure

```
PROJET-BMAD-JAVA2/
├── README.md
├── backend/
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/bmad/callback/
│   │   │   │   ├── CallbackApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── DemandeRappelController.java
│   │   │   │   │   └── AuthController.java
│   │   │   │   ├── service/
│   │   │   │   │   └── DemandeRappelService.java
│   │   │   │   ├── repository/
│   │   │   │   │   └── DemandeRappelRepository.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── DemandeRappel.java
│   │   │   │   │   ├── Motif.java (enum statique)
│   │   │   │   │   └── Creneau.java (enum/constante statique)
│   │   │   │   ├── dto/
│   │   │   │   │   ├── DemandeRappelRequest.java
│   │   │   │   │   └── DemandeRappelResponse.java
│   │   │   │   └── exception/
│   │   │   │       └── GlobalExceptionHandler.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       └── java/com/bmad/callback/
│   │           ├── controller/
│   │           └── service/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── pages/
│       │   ├── Accueil.tsx
│       │   ├── EcranIdentite.tsx
│       │   ├── EcranMotif.tsx
│       │   ├── EcranCreneau.tsx
│       │   ├── EcranRecapitulatif.tsx
│       │   ├── EcranCelebration.tsx
│       │   ├── ConseillerLogin.tsx
│       │   └── ConseillerDashboard.tsx
│       ├── components/
│       │   └── RadioListe.tsx
│       ├── context/
│       │   └── DemandeRappelContext.tsx
│       ├── api/
│       │   └── demandeRappelApi.ts
│       └── types/
│           └── demandeRappel.ts
└── .gitignore
```

### Architectural Boundaries

**API Boundaries:**
- `POST /api/demandes-rappel` : création d'une demande (public, parcours client)
- `POST /api/auth/login` : authentification conseiller
- `GET /api/demandes-rappel` : liste des demandes (protégé, session conseiller requise)
- `PATCH /api/demandes-rappel/{id}/appele` : toggle du statut "appelé" (protégé)

**Component Boundaries:**
- Les pages (`src/pages/`) ne contiennent que de la présentation ; la logique d'appel API passe par `src/api/`
- L'état du formulaire multi-étapes est centralisé dans `DemandeRappelContext` — aucune page ne gère son propre état partagé

**Service Boundaries:**
- `DemandeRappelController` ne contient aucune logique métier — tout passe par `DemandeRappelService`
- `DemandeRappelRepository` est le seul point d'accès à la base H2

**Data Boundaries:**
- Une seule table persistée : `demande_rappel`
- Motifs/sous-motifs et créneaux restent des constantes applicatives, jamais en base

### Requirements to Structure Mapping

**FR Mapping:**
- Navigation & Accueil (FR1-FR2) → `pages/Accueil.tsx`
- Enregistrement Client (FR3-FR4) → `pages/EcranIdentite.tsx`
- Sélection Motif (FR5-FR8) → `pages/EcranMotif.tsx`, `model/Motif.java`
- Sélection Créneau (FR9-FR12) → `pages/EcranCreneau.tsx`, `model/Creneau.java`
- Récapitulatif & Validation (FR13-FR15) → `pages/EcranRecapitulatif.tsx`, `DemandeRappelController.create()`
- Confirmation (FR16-FR17) → `pages/EcranCelebration.tsx`
- Authentification Conseiller (FR18) → `pages/ConseillerLogin.tsx`, `AuthController`, `SecurityConfig`
- Gestion des Demandes (FR19-FR21) → `pages/ConseillerDashboard.tsx`, `DemandeRappelController.list()/toggle()`

**Cross-Cutting Concerns:**
- Validation des données : `dto/DemandeRappelRequest.java` (Bean Validation)
- Gestion des erreurs : `exception/GlobalExceptionHandler.java` (backend), gestion locale par page (frontend)

### Integration Points

**Internal Communication:** Frontend → Backend via appels REST JSON (`fetch`/`axios` dans `src/api/`)
**External Integrations:** Aucune pour ce MVP
**Data Flow:** Formulaire client (Context) → API POST → H2 ; Dashboard conseiller → API GET/PATCH → H2

### File Organization Patterns

**Configuration Files:** `application.properties` (backend), `vite.config.ts`/`tsconfig.json` (frontend)
**Source Organization:** voir arborescence ci-dessus
**Test Organization:** `src/test/java` (backend, structure miroir) ; tests frontend différés post-MVP
**Asset Organization:** aucun asset statique complexe pour ce MVP

### Development Workflow Integration

**Development Server Structure:** `mvn spring-boot:run` (backend, port 8080 par défaut pour l'API) ; `npm run dev` (frontend, serveur Vite séparé avec proxy vers l'API) — pratique de développement uniquement
**Build Process Structure:** `mvn package` (backend) ; `npm run build` (frontend, build statique)
**Deployment Structure:** le PRD exige un accès unique via `localhost:8080`. Pour le respecter, le build frontend (`frontend/dist`) est copié dans `backend/src/main/resources/static` avant packaging Maven, afin que Spring Boot serve l'application React en plus de l'API sur le même port 8080. Pas de déploiement distant pour ce MVP.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** Spring Boot 4.1.2 (Java 21, Maven) et Vite/React/TypeScript sont compatibles et n'imposent aucune contrainte croisée. Le build frontend servi en statique par Spring Boot satisfait l'exigence d'accès unique `localhost:8080`.

**Pattern Consistency:** Les conventions de nommage (camelCase JSON / snake_case DB) sont cohérentes avec les choix Spring Data JPA + React/TS standards.

**Structure Alignment:** La structure `backend/` + `frontend/` en mono-dépôt respecte les boundaries définies (API, composants, données).

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:** Les 21 FR du PRD sont toutes mappées à des composants précis (voir Requirements to Structure Mapping).

**Non-Functional Requirements Coverage:** Performance (transitions <1s, chargement <2s) couverte par l'absence de complexité technique superflue ; Sécurité (auth statique, pas de données sensibles, environnement local) couverte par Spring Security minimal et l'absence d'exposition réseau.

### Implementation Readiness Validation ✅

**Decision Completeness:** Toutes les décisions critiques (données, sécurité, API, frontend, infra) sont documentées avec justification.
**Structure Completeness:** Arborescence complète définie pour backend et frontend.
**Pattern Completeness:** Conventions de nommage, structure, formats, état et erreurs toutes spécifiées.

### Gap Analysis Results

Aucun gap critique identifié. Point mineur déjà résolu en cours de route : clarification sur le service unifié du frontend par Spring Boot pour respecter `localhost:8080`.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (faible)
- [x] Technical constraints identified (stack imposée, local uniquement)
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions (Spring Boot 4.1.2, Java 21, Vite/React/TS)
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** Élevé — périmètre simple, stack standard, décisions toutes documentées et cohérentes.

**Key Strengths:** Scope volontairement restreint, stack éprouvée, mapping FR → structure explicite, aucune zone d'ambiguïté pour les agents IA.

**Areas for Future Enhancement:** Authentification renforcée, migrations de schéma (Flyway), tests frontend, déploiement multi-agences — tous différés en Post-MVP comme prévu.

### Implementation Handoff

**AI Agent Guidelines:**
- Suivre exactement les décisions architecturales documentées
- Appliquer les patterns d'implémentation de façon uniforme
- Respecter la structure et les boundaries définies
- Se référer à ce document pour toute question architecturale

**First Implementation Priority:**
Initialisation des deux projets : Spring Initializr (Java 21, Maven, Spring Boot 4.1.2, dépendances Web/Data JPA/H2) et `npm create vite@latest frontend -- --template react-ts`.

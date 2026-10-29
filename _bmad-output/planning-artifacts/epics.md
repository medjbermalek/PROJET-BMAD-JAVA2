---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md']
---

# PROJET-BMAD-JAVA2 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for PROJET-BMAD-JAVA2, decomposing the requirements from the PRD and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Le visiteur peut accéder à l'écran d'accueil via `localhost:8080`
FR2: Le visiteur peut choisir d'entrer dans le parcours "Client" ou le parcours "Conseiller" depuis l'écran d'accueil
FR3: Le client peut saisir son nom, prénom et numéro de téléphone
FR4: Le client peut valider sa saisie et passer à l'étape suivante via "Continuer"
FR5: Le client peut consulter une liste de 5 motifs de rappel, chacun avec 1 à 2 sous-motifs
FR6: Le client peut sélectionner un seul motif/sous-motif parmi la liste (choix exclusif)
FR7: Le client peut revenir à l'écran précédent via "Retour" sans perdre ses informations déjà saisies
FR8: Le client peut valider son choix de motif et passer à l'étape suivante via "Continuer"
FR9: Le client peut consulter une liste de créneaux horaires disponibles répartis du lundi au samedi (3 à 5 créneaux de 30 minutes par jour)
FR10: Le client peut sélectionner un seul créneau horaire parmi la liste
FR11: Le client peut revenir à l'écran précédent via "Retour" sans perdre ses informations déjà saisies
FR12: Le client peut valider son choix de créneau et passer à l'étape suivante via "Continuer"
FR13: Le client peut consulter un récapitulatif de sa demande (nom, prénom, téléphone, motif, créneau) avant validation finale
FR14: Le client peut valider définitivement sa demande de rappel via "Valider"
FR15: Le système enregistre la demande de rappel uniquement au moment de la validation finale
FR16: Le client voit un écran de confirmation lui indiquant qu'un conseiller le rappellera
FR17: Le client peut retourner à l'écran d'accueil depuis l'écran de confirmation
FR18: Le conseiller peut s'authentifier via un identifiant et mot de passe statiques (admin/admin pour ce MVP)
FR19: Le conseiller peut consulter la liste de toutes les demandes de rappel soumises (nom, prénom, téléphone, motif)
FR20: Le conseiller peut marquer une demande comme "appelée" via une case à cocher
FR21: Le conseiller peut démarquer une demande précédemment cochée par erreur (toggle réversible)

### NonFunctional Requirements

NFR1: Les transitions entre écrans du parcours client s'effectuent en moins d'1 seconde
NFR2: Le chargement du tableau de bord conseiller s'effectue en moins de 2 secondes
NFR3: L'authentification conseiller (admin/admin) protège l'accès au tableau de bord contre un accès non authentifié
NFR4: Aucune donnée bancaire sensible n'est collectée ou stockée — seules des données de contact et le motif de rappel sont persistées
NFR5: Les échanges entre le frontend et l'API restent en local (`localhost`), sans exposition réseau externe

### Additional Requirements

- **Starter Template (Epic 1 Story 1)** : initialisation Spring Initializr (Java 21, Maven, Spring Boot 4.1.2, dépendances Web/Data JPA/H2) pour le backend, et `npm create vite@latest frontend -- --template react-ts` pour le frontend
- Build frontend copié dans `backend/src/main/resources/static` avant packaging Maven, pour servir l'app React et l'API sur le même port 8080 (`localhost:8080`)
- Entité unique `DemandeRappel` persistée en H2 ; motifs/sous-motifs et créneaux horaires codés en dur (enums/constantes), pas de table dédiée
- Spring Security avec un utilisateur unique en mémoire (`admin`/`admin`), authentification par formulaire + session
- Gestion d'état du formulaire multi-étapes côté frontend via React Context + `useReducer`
- `@ControllerAdvice` centralisé pour la gestion des erreurs backend

### FR Coverage Map

FR1: Epic 1 - Accès à l'écran d'accueil
FR2: Epic 1 - Choix du parcours Client/Conseiller
FR3: Epic 1 - Saisie identité client
FR4: Epic 1 - Validation identité et navigation
FR5: Epic 1 - Consultation des motifs
FR6: Epic 1 - Sélection exclusive d'un motif/sous-motif
FR7: Epic 1 - Retour sans perte de données
FR8: Epic 1 - Validation du motif et navigation
FR9: Epic 1 - Consultation des créneaux horaires
FR10: Epic 1 - Sélection d'un créneau
FR11: Epic 1 - Retour sans perte de données
FR12: Epic 1 - Validation du créneau et navigation
FR13: Epic 1 - Consultation du récapitulatif
FR14: Epic 1 - Validation finale de la demande
FR15: Epic 1 - Enregistrement en base à la validation
FR16: Epic 1 - Écran de confirmation
FR17: Epic 1 - Retour à l'accueil
FR18: Epic 2 - Authentification conseiller
FR19: Epic 2 - Consultation de la liste des demandes
FR20: Epic 2 - Marquage "appelé"
FR21: Epic 2 - Démarquage réversible

## Epic List

### Epic 1: Demande de rappel client
Le client peut soumettre une demande de rappel complète — de la saisie de son identité jusqu'à la confirmation — sans assistance, via un parcours guidé en plusieurs étapes.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17

### Epic 2: Traitement des demandes par le conseiller
Le conseiller peut s'authentifier et consulter l'ensemble des demandes de rappel soumises, puis marquer chaque demande traitée comme "appelée" (ou revenir en arrière en cas d'erreur).
**FRs covered:** FR18, FR19, FR20, FR21

## Epic 1: Demande de rappel client

Le client peut soumettre une demande de rappel complète — de la saisie de son identité jusqu'à la confirmation — sans assistance, via un parcours guidé en plusieurs étapes.

### Story 1.1: Initialisation du projet et écran d'accueil

As a client ou conseiller,
I want accéder à l'application via `localhost:8080` et voir un écran d'accueil avec deux choix,
So that je puisse démarrer le parcours qui me concerne.

**Acceptance Criteria:**

**Given** les projets backend (Spring Boot) et frontend (React/Vite) sont initialisés et le build frontend est servi par le backend
**When** j'accède à `localhost:8080`
**Then** je vois un écran d'accueil avec deux boutons "Client" et "Conseiller"
**And** cliquer sur "Client" me dirige vers l'écran de saisie d'identité

### Story 1.2: Saisie de l'identité client

As a client,
I want saisir mon nom, prénom et numéro de téléphone,
So that le conseiller puisse me recontacter.

**Acceptance Criteria:**

**Given** je suis sur l'écran de saisie d'identité
**When** je remplis les champs nom, prénom, téléphone et clique "Continuer"
**Then** mes informations sont conservées dans l'état du formulaire (Context)
**And** je suis redirigé vers l'écran de sélection du motif

### Story 1.3: Sélection du motif de rappel

As a client,
I want choisir un motif et un sous-motif parmi une liste de 5 catégories,
So that le conseiller sache pourquoi je souhaite être rappelé.

**Acceptance Criteria:**

**Given** je suis sur l'écran des motifs après avoir saisi mon identité
**When** je sélectionne un motif/sous-motif via les radio boutons et clique "Continuer"
**Then** mon choix est conservé et je suis redirigé vers l'écran des créneaux
**And** si je clique "Retour", je reviens à l'écran d'identité sans perdre mes informations déjà saisies

### Story 1.4: Sélection du créneau horaire

As a client,
I want choisir un créneau de 30 minutes parmi une liste hebdomadaire statique (lundi-samedi),
So that le conseiller m'appelle à un moment qui me convient.

**Acceptance Criteria:**

**Given** je suis sur l'écran des créneaux après avoir choisi mon motif
**When** je sélectionne un créneau et clique "Continuer"
**Then** je suis redirigé vers l'écran de récapitulatif avec toutes mes informations
**And** si je clique "Retour", je reviens à l'écran des motifs sans perdre ma sélection de créneau précédente

### Story 1.5: Récapitulatif et validation de la demande

As a client,
I want consulter un récapitulatif complet de ma demande avant de la valider,
So that je sois sûr que les informations transmises sont correctes.

**Acceptance Criteria:**

**Given** je suis sur l'écran de récapitulatif avec identité, motif et créneau renseignés
**When** je clique "Valider"
**Then** une entité `DemandeRappel` est créée et persistée en base H2 avec le statut `appele = false`
**And** je suis redirigé vers l'écran de confirmation

### Story 1.6: Écran de confirmation

As a client,
I want voir un message de confirmation après validation,
So that je sois rassuré qu'un conseiller va me rappeler.

**Acceptance Criteria:**

**Given** ma demande vient d'être validée et enregistrée
**When** j'arrive sur l'écran de confirmation
**Then** je vois un message m'indiquant qu'un conseiller va me rappeler au créneau choisi
**And** un bouton "Retour à l'accueil" me ramène à l'écran d'accueil

## Epic 2: Traitement des demandes par le conseiller

Le conseiller peut s'authentifier et consulter l'ensemble des demandes de rappel soumises, puis marquer chaque demande traitée comme "appelée" (ou revenir en arrière en cas d'erreur).

### Story 2.1: Authentification conseiller

As a conseiller,
I want m'authentifier avec un identifiant et mot de passe,
So that j'accède de façon sécurisée au tableau des demandes.

**Acceptance Criteria:**

**Given** je clique sur "Conseiller" depuis l'écran d'accueil
**When** je saisis `admin`/`admin` et valide
**Then** une session est créée et je suis redirigé vers le tableau de bord
**And** si les identifiants sont incorrects, un message d'erreur s'affiche et je reste sur l'écran de connexion

### Story 2.2: Consultation de la liste des demandes

As a conseiller authentifié,
I want consulter la liste de toutes les demandes de rappel soumises,
So that je sache qui rappeler et pourquoi.

**Acceptance Criteria:**

**Given** je suis authentifié et des demandes existent en base
**When** j'accède au tableau de bord
**Then** je vois un tableau listant nom, prénom, téléphone et motif de chaque demande
**And** si je ne suis pas authentifié, l'accès au tableau de bord est refusé

### Story 2.3: Marquage et démarquage des demandes appelées

As a conseiller,
I want cocher une demande après l'avoir appelée (et décocher en cas d'erreur),
So that je garde une vue claire des rappels restants à effectuer.

**Acceptance Criteria:**

**Given** je consulte le tableau de bord des demandes
**When** je coche la case d'une demande
**Then** son statut `appele` passe à `true` et est persisté en base
**And** si je décoche une case précédemment cochée, son statut repasse à `false`

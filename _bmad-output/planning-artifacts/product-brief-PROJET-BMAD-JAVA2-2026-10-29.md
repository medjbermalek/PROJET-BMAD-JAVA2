---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
date: 2026-10-29
author: Malik
---

# Product Brief: PROJET-BMAD-JAVA2

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

PROJET-BMAD-JAVA2 est une application web desktop interne destinée à une agence, permettant à un client de demander lui-même à être rappelé par un conseiller, en précisant son motif de contact et le créneau horaire qui lui convient. L'objectif est de donner au conseiller une vue claire et priorisée des demandes de rappel, afin de maximiser le nombre de clients effectivement recontactés — plutôt que de s'appuyer sur des appels téléphoniques entrants non qualifiés.

---

## Core Vision

### Problem Statement

Aujourd'hui, un client qui souhaite être rappelé par un conseiller de l'agence passe par le téléphone. Cette demande arrive de façon non structurée : le conseiller ne connaît ni le motif précis du rappel, ni le créneau souhaité par le client avant de décrocher ou de le recontacter.

### Problem Impact

Ce n'est pas un problème critique pour l'agence aujourd'hui, mais cela reste une source d'inefficacité : le conseiller perd du temps à découvrir le motif au moment de l'appel, sans pouvoir prioriser ses rappels, et rien ne garantit qu'un client ayant demandé un rappel soit effectivement recontacté.

### Why Existing Solutions Fall Short

Il n'existe aujourd'hui aucun outil dédié : la gestion des demandes de rappel repose entièrement sur le téléphone et l'organisation manuelle du conseiller, sans suivi structuré ni vue d'ensemble priorisée des demandes en attente.

### Proposed Solution

Une application web desktop (React + Spring Boot + H2) permettant :
- au client de s'enregistrer lui-même (nom, prénom, numéro de téléphone),
- de sélectionner un motif de rappel parmi une liste structurée de 5 motifs (avec sous-motifs),
- de choisir un créneau horaire parmi une liste statique de disponibilités hebdomadaires (créneaux de 30 min, lundi à samedi),
- de valider sa demande après un récapitulatif,

et donnant au conseiller, via un espace back-office authentifié, une liste consolidée et priorisée des demandes (nom, prénom, téléphone, motif) qu'il peut cocher au fur et à mesure des rappels effectués.

### Key Differentiators

Le vrai différenciateur n'est pas le formulaire web en lui-même, mais le fait que **le conseiller sait quoi dire avant même de décrocher** : motif et créneau sont connus à l'avance, ce qui transforme un volume d'appels non qualifiés en une liste priorisée et exploitable.

Ce MVP est volontairement scopé comme un **outil interne, mono-poste, sans exposition réseau** : l'application est desktop-only car le conseiller travaille sur un poste fixe toute la journée, et les choix de simplicité (base H2 embarquée, authentification conseiller statique admin/admin) sont assumés pour ce périmètre — pas des oublis, mais des arbitrages de scope MVP.

## Target Users

### Primary Users

**Le Client bancaire**
Un client de la banque qui souhaite être rappelé par son conseiller pour une question ou une démarche précise (motif + sous-motif). Il accède directement à l'application via `localhost:8080`, probablement depuis un poste en agence, et clique sur le bouton "Client" dès l'écran d'accueil.

- **Contexte** : il n'a pas de compte à créer, pas de mot de passe à retenir — juste nom, prénom et numéro de téléphone à saisir.
- **Frustration actuelle** : pour être rappelé, il devait auparavant passer par le téléphone, sans garantie de délai ni de bon interlocuteur.
- **Moment de succès** : il arrive à l'écran de célébration final qui lui confirme qu'un conseiller va le recontacter sur le créneau choisi, pour le motif choisi.

**Le Conseiller bancaire**
Le collaborateur de l'agence chargé de rappeler les clients. Il clique sur le bouton "Conseiller" depuis le même écran d'accueil, s'authentifie (admin/admin pour ce MVP), puis accède à un tableau de bord listant toutes les demandes de rappel.

- **Contexte** : il consulte ce tableau pour organiser ses appels de la journée.
- **Frustration actuelle** : sans motif ni créneau connu à l'avance, il perd du temps à qualifier chaque appel.
- **Moment de succès** : il traite une demande, coche la case correspondante, et voit sa liste de rappels en attente se réduire au fil de la journée.

### Secondary Users

N/A pour ce MVP — pas de rôle de supervision (ex. responsable d'agence) prévu à ce stade. Pourra être envisagé dans une itération future (reporting, statistiques de rappels).

### User Journey

**Parcours Client :**
Accueil (`localhost:8080`) → clic "Client" → saisie nom/prénom/téléphone → choix du motif (liste à choix unique avec sous-motifs) → choix du créneau horaire (semaine type, créneaux de 30 min, lundi-samedi) → récapitulatif → validation → écran de célébration → retour à l'accueil.

**Parcours Conseiller :**
Accueil (`localhost:8080`) → clic "Conseiller" → authentification (admin/admin) → tableau des demandes (nom, prénom, téléphone, motif) → appel du client → coche la case "appelé" une fois le rappel effectué.

## Success Metrics

Pour ce MVP exécuté en local (`localhost`), l'objectif principal est de **valider l'usage** de l'outil par les deux populations cibles (clients et conseillers), plutôt que d'atteindre un objectif chiffré de volume. Le MVP sert à vérifier que le parcours est compris, utilisé sans friction, et qu'il apporte une réelle valeur au quotidien du conseiller.

### Business Objectives

- **Adoption côté client** : les clients parviennent à compléter le parcours de bout en bout (saisie → motif → créneau → récapitulatif → validation) sans abandon ni confusion.
- **Adoption côté conseiller** : les conseillers utilisent effectivement le tableau de bord pour organiser leurs rappels, plutôt que de revenir à leurs anciennes habitudes (téléphone, notes manuelles).
- **Horizon de validation** : une période d'usage test en agence permettra de confirmer si le parcours répond au besoin avant d'envisager une évolution (déploiement plus large, authentification renforcée, etc.).

### Key Performance Indicators

- **Taux de complétion du parcours client** : % de sessions démarrées (saisie nom/prénom/téléphone) qui vont jusqu'à l'écran de célébration.
- **Taux de traitement des demandes** : % de demandes de rappel cochées comme "appelées" par les conseillers dans le tableau de bord.
- **Usage du back-office conseiller** : fréquence de connexion des conseillers à l'espace "Conseiller" (indicateur d'adoption de l'outil au quotidien).

## MVP Scope

### Core Features

**Parcours Client :**
1. Écran d'accueil (`localhost:8080`) — 2 boutons "Client" / "Conseiller"
2. Saisie nom, prénom, numéro de téléphone + bouton "Continuer"
3. Choix du motif de rappel (5 motifs, chacun avec 1-2 sous-motifs, sélection unique via radio boutons) + boutons "Retour" / "Continuer"
4. Choix du créneau horaire (liste statique, lundi-samedi, créneaux de 30 min, 3 à 5 par jour) + boutons "Retour" / "Continuer"
5. Récapitulatif (nom, prénom, tél, motif, créneau) + bouton "Valider"
6. Écran de célébration ("Félicitations, un conseiller vous rappellera...") + bouton "Retour à l'accueil"

**Parcours Conseiller :**
1. Authentification statique (admin/admin)
2. Tableau de bord : liste des clients (nom, prénom, tél, motif) avec case à cocher "appelé"

### Out of Scope for MVP

- Modification ou annulation d'une demande déjà soumise par le client
- Notifications au client (email, SMS) confirmant ou rappelant le rendez-vous
- Gestion dynamique des motifs/sous-motifs et des créneaux horaires (ils sont codés en dur pour ce MVP)
- Statistiques, reporting ou export de données pour l'agence
- Authentification conseiller robuste (gestion de comptes, rôles, mots de passe)
- Accès mobile ou responsive (l'application est strictement desktop)

### MVP Success Criteria

Le MVP est jugé concluant si, après une période de test en agence, les conseillers constatent un gain de temps réel dans la gestion de leurs rappels (motif et créneau connus à l'avance) et si les clients parviennent à compléter le parcours sans assistance ni confusion.

### Future Vision

Au-delà du MVP, des évolutions possibles incluent : une authentification conseiller renforcée, des créneaux horaires gérés dynamiquement par le conseiller, des notifications automatiques au client (SMS/email), un accès multi-agences, des statistiques de suivi pour les responsables d'agence, et potentiellement un accès mobile si le besoin se confirme.

---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish]
inputDocuments: ['_bmad-output/planning-artifacts/product-brief-PROJET-BMAD-JAVA2-2026-10-29.md']
workflowType: 'prd'
classification:
  projectType: web_app
  domain: fintech
  complexity: low-medium (MVP scope, no financial transactions or PII beyond name/phone/motif)
  projectContext: greenfield
---

# Product Requirements Document - PROJET-BMAD-JAVA2

**Author:** Malik
**Date:** 2026-10-29

## Executive Summary

PROJET-BMAD-JAVA2 est une application web interne (React + Spring Boot + H2) destinée à une agence bancaire. Elle permet à un client de demander lui-même à être rappelé par un conseiller, en précisant un motif (parmi 5 catégories avec sous-motifs) et un créneau horaire hebdomadaire (créneaux de 30 min, lundi-samedi). Le conseiller accède à un back-office authentifié listant les demandes, qu'il traite en les cochant au fur et à mesure.

### What Makes This Special

Le différenciateur n'est pas le formulaire en lui-même, mais la **structuration de l'information en amont de l'appel** : motif et créneau sont connus avant même que le conseiller décroche, transformant un flux d'appels non qualifiés en file de rappels priorisée et actionnable. Ce MVP assume volontairement un périmètre restreint (desktop-only, mono-poste, authentification statique admin/admin, base H2 embarquée) pour valider rapidement l'usage réel avant d'investir davantage.

## Project Classification

- **Project Type :** web_app (SPA React + API Spring Boot, desktop-only)
- **Domain :** fintech (contexte bancaire)
- **Complexity :** basse à moyenne pour ce périmètre MVP (aucune transaction financière, données limitées à nom/prénom/téléphone/motif)
- **Project Context :** greenfield

## Success Criteria

### User Success

- **Client** : complète le parcours de bout en bout (saisie → motif → créneau → récapitulatif → validation) sans abandon ni confusion, et atteint l'écran de célébration confirmant sa demande.
- **Conseiller** : utilise le tableau de bord pour organiser ses rappels plutôt que de revenir à ses anciennes habitudes (téléphone, notes manuelles), et sait quoi dire avant même de décrocher grâce au motif/créneau affichés.

### Business Success

- **À court terme (période de test MVP)** : les conseillers et clients adoptent effectivement l'outil en agence — validation d'usage plutôt qu'objectif de volume chiffré.
- **Signal de réussite** : un taux élevé de demandes de rappel effectivement traitées (cochées) par les conseillers, et un taux de complétion élevé du parcours client.
- **Décision de la suite** : si l'usage est validé, envisager un déploiement multi-agences avec authentification renforcée et créneaux dynamiques (cf. Future Vision du brief).

### Technical Success

- L'application fonctionne de manière fiable en local (`localhost:8080`), sans erreur bloquante sur le parcours client ou conseiller.
- Les données (client, motif, créneau, statut "appelé") sont correctement persistées dans la base H2 entre les sessions.
- Les temps de réponse entre écrans sont immédiats (pas de latence perceptible), le volume de données étant faible pour ce MVP.

### Measurable Outcomes

- **Taux de complétion du parcours client** : % de sessions démarrées qui atteignent l'écran de célébration.
- **Taux de traitement des demandes** : % de demandes cochées "appelées" par les conseillers.
- **Fréquence de connexion conseiller** : nombre de connexions à l'espace back-office par jour/semaine.

## Product Scope

### MVP Strategy & Philosophy

MVP de type "validation d'usage" (Problem-solving MVP) : l'objectif n'est pas de maximiser les fonctionnalités mais de vérifier que le parcours structuré (motif + créneau connus à l'avance) crée réellement de la valeur pour le conseiller par rapport au canal téléphonique actuel. Réalisable par une petite équipe (1-2 développeurs full-stack React/Spring Boot), sans ressources DevOps/sécurité dédiées pour ce périmètre local.

### MVP - Minimum Viable Product

- Écran d'accueil avec 2 boutons ("Client" / "Conseiller")
- Parcours client : saisie identité → choix motif (5 motifs, sous-motifs, radio boutons) → choix créneau (liste statique, lundi-samedi, créneaux 30 min) → récapitulatif → validation → célébration
- Parcours conseiller : authentification statique (admin/admin) → tableau des demandes avec case à cocher réversible "appelé"
- Persistance des données en base H2 locale

### Growth Features (Post-MVP)

- Authentification conseiller renforcée (comptes, rôles, mots de passe)
- Gestion dynamique des créneaux horaires par le conseiller
- Notifications automatiques au client (SMS/email)
- Statistiques et reporting pour les responsables d'agence

### Vision (Future)

- Déploiement multi-agences
- Accès mobile si le besoin se confirme
- Intégration avec le système d'information client existant de la banque

### Risk Mitigation Strategy

**Risques techniques :** Faibles — stack éprouvée (React/Spring Boot/H2), pas de fonctionnalité technique complexe (pas de temps réel, pas d'intégration tierce). Point d'attention : s'assurer que la base H2 persiste correctement entre les sessions de test.

**Risques marché :** Faibles pour ce MVP local — adoption testée en interne avec un périmètre d'utilisateurs maîtrisé (conseillers d'une agence), sans exposition publique.

**Risques ressources :** Faibles — scope volontairement restreint, réalisable par une petite équipe sans dépendances externes.

## User Journeys

### Journey 1 — Client bancaire, chemin nominal

**Ouverture :** Sophie, cliente de la banque, est en agence et doit poser une question sur un virement international. Elle n'a pas le temps d'attendre au guichet et aperçoit le poste dédié affichant l'écran d'accueil de l'application.

**Action montante :** Elle clique sur "Client", saisit son nom, prénom et numéro de téléphone, puis clique sur "Continuer". Sur l'écran suivant, elle parcourt les 5 motifs proposés et sélectionne "Virements" puis le sous-motif "Virement international". Elle clique "Continuer".

**Climax :** Elle visualise la liste des créneaux disponibles sur la semaine et choisit "Mercredi 14h00-14h30", un moment où elle sera disponible. Elle clique "Continuer", arrive sur le récapitulatif qui affiche toutes ses informations, et clique "Valider".

**Résolution :** L'écran de célébration lui confirme qu'un conseiller la rappellera au créneau choisi pour ce motif précis. Elle clique "Retour à l'accueil", rassurée d'avoir une réponse sans avoir attendu au téléphone.

### Journey 2 — Client bancaire, cas limite (retour en arrière)

**Ouverture :** Marc commence sa demande mais se trompe de motif en cours de route.

**Action montante :** Arrivé sur l'écran des créneaux horaires, il réalise que le motif choisi ne correspond pas à sa vraie question. Il clique "Retour" pour revenir à l'écran des motifs.

**Climax :** Il sélectionne le bon motif et sous-motif, clique "Continuer" — il retombe sur l'écran des créneaux avec sa sélection de motif mise à jour, sans perdre ses informations personnelles déjà saisies.

**Résolution :** Il choisit son créneau, valide, et arrive à la célébration. Aucune donnée n'a été perdue durant les retours en arrière — seule la validation finale enregistre la demande en base.

### Journey 3 — Conseiller bancaire, gestion quotidienne

**Ouverture :** Amina, conseillère, arrive le matin et veut organiser ses appels de rappel du jour.

**Action montante :** Elle clique sur "Conseiller" depuis l'écran d'accueil, s'authentifie (admin/admin), et arrive sur le tableau de bord listant toutes les demandes en attente (nom, prénom, téléphone, motif).

**Climax :** Elle identifie les demandes par motif, appelle chaque client au moment approprié de sa journée, en sachant déjà de quoi parler grâce au motif affiché.

**Résolution :** Après chaque appel traité, elle coche la case correspondante. Sa liste de demandes en attente diminue visuellement au fil de la journée, lui donnant une vue claire de ce qu'il lui reste à faire.

### Journey 4 — Conseiller bancaire, erreur de saisie

**Ouverture :** Amina coche par erreur une case pour un client qu'elle n'a pas encore réellement appelé.

**Action montante :** Elle se rend compte de l'erreur en voyant que ce client ne figure plus dans sa liste de rappels à traiter.

**Climax :** Elle décoche la case pour remettre la demande en attente.

**Résolution :** Le client réapparaît dans la liste des demandes à traiter, et Amina peut l'appeler comme prévu. *(Révèle une exigence : la case à cocher doit être réversible, pas un état à sens unique.)*

### Journey Requirements Summary

- **Parcours client** : formulaire multi-étapes avec navigation Retour/Continuer qui préserve les données déjà saisies ; persistance uniquement à la validation finale.
- **Parcours conseiller** : authentification simple (session), tableau de données filtrable/triable par motif, case à cocher **réversible** (toggle), mise à jour en temps réel de la liste.
- **Intégrité des données** : chaque demande de rappel doit conserver nom, prénom, téléphone, motif, sous-motif, créneau et statut "appelé" (booléen togglable) en base H2.

## Web App Specific Requirements

### Project-Type Overview

Application web de type SPA (Single Page Application) React, consommant une API REST Spring Boot. Usage strictement interne et local — pas de déploiement public.

### Technical Architecture Considerations

- **SPA vs MPA** : SPA (React) avec navigation côté client entre les 5 écrans du parcours client et les 2 écrans du parcours conseiller.
- **Support navigateur** : navigateur moderne desktop uniquement (Chrome/Edge récents) — pas de matrice de compatibilité étendue, environnement maîtrisé (poste interne agence).
- **SEO** : non applicable — application interne non indexée, accessible uniquement via `localhost:8080`.
- **Temps réel** : non requis pour le MVP — le conseiller rafraîchit ou recharge le tableau de bord pour voir les nouvelles demandes (pas de WebSocket/push).
- **Accessibilité** : bonnes pratiques de base (HTML sémantique, labels de formulaire, contraste suffisant) suffisantes pour ce MVP interne — pas de certification WCAG formelle requise.

### Implementation Considerations

- Routage client géré par React Router (ou équivalent) pour les transitions entre écrans sans rechargement de page.
- L'API Spring Boot expose les endpoints nécessaires : création de demande de rappel, liste des demandes (conseiller), mise à jour du statut "appelé".
- Base H2 en mode fichier ou mémoire persistante le temps de la session de test, selon besoin de conservation des données entre redémarrages.

## Functional Requirements

### Navigation & Accueil

- FR1: Le visiteur peut accéder à l'écran d'accueil via `localhost:8080`
- FR2: Le visiteur peut choisir d'entrer dans le parcours "Client" ou le parcours "Conseiller" depuis l'écran d'accueil

### Enregistrement du Client

- FR3: Le client peut saisir son nom, prénom et numéro de téléphone
- FR4: Le client peut valider sa saisie et passer à l'étape suivante via "Continuer"

### Sélection du Motif de Rappel

- FR5: Le client peut consulter une liste de 5 motifs de rappel, chacun avec 1 à 2 sous-motifs
- FR6: Le client peut sélectionner un seul motif/sous-motif parmi la liste (choix exclusif)
- FR7: Le client peut revenir à l'écran précédent via "Retour" sans perdre ses informations déjà saisies
- FR8: Le client peut valider son choix de motif et passer à l'étape suivante via "Continuer"

### Sélection du Créneau Horaire

- FR9: Le client peut consulter une liste de créneaux horaires disponibles répartis du lundi au samedi (3 à 5 créneaux de 30 minutes par jour)
- FR10: Le client peut sélectionner un seul créneau horaire parmi la liste
- FR11: Le client peut revenir à l'écran précédent via "Retour" sans perdre ses informations déjà saisies
- FR12: Le client peut valider son choix de créneau et passer à l'étape suivante via "Continuer"

### Récapitulatif & Validation

- FR13: Le client peut consulter un récapitulatif de sa demande (nom, prénom, téléphone, motif, créneau) avant validation finale
- FR14: Le client peut valider définitivement sa demande de rappel via "Valider"
- FR15: Le système enregistre la demande de rappel uniquement au moment de la validation finale

### Confirmation

- FR16: Le client voit un écran de confirmation lui indiquant qu'un conseiller le rappellera
- FR17: Le client peut retourner à l'écran d'accueil depuis l'écran de confirmation

### Authentification Conseiller

- FR18: Le conseiller peut s'authentifier via un identifiant et mot de passe statiques (admin/admin pour ce MVP)

### Gestion des Demandes de Rappel (Conseiller)

- FR19: Le conseiller peut consulter la liste de toutes les demandes de rappel soumises (nom, prénom, téléphone, motif)
- FR20: Le conseiller peut marquer une demande comme "appelée" via une case à cocher
- FR21: Le conseiller peut démarquer une demande précédemment cochée par erreur (toggle réversible)

## Non-Functional Requirements

### Performance

- Les transitions entre écrans du parcours client s'effectuent en moins d'1 seconde (navigation côté client, pas de rechargement de page).
- Le chargement du tableau de bord conseiller (liste des demandes) s'effectue en moins de 2 secondes, pour un volume de données attendu faible (quelques dizaines à centaines de demandes).

### Security

- L'authentification conseiller (admin/admin) protège l'accès au tableau de bord contre un accès non authentifié — niveau de protection volontairement minimal pour ce MVP interne, à renforcer avant tout déploiement au-delà du test local.
- Aucune donnée bancaire sensible (compte, montant, transaction) n'est collectée ou stockée — seules des données de contact (nom, prénom, téléphone) et le motif de rappel sont persistées.
- Les échanges entre le frontend React et l'API Spring Boot restent en local (`localhost`), sans exposition réseau externe pour ce MVP.

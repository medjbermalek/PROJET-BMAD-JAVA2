# PROJET-BMAD-JAVA2
projet pour tester bmad2

## Démarrage

Prérequis : JDK 21 ou supérieur, Maven et Node.js avec npm.

Depuis `frontend/`, installer les dépendances avec `npm install`, puis lancer `npm run build`.
Depuis `backend/`, lancer `mvn clean package`, puis `java -jar target/callback-backend-0.0.1-SNAPSHOT.jar`.
L'application est accessible sur <http://localhost:8080/>. Pour développer l'interface seule, lancer `npm run dev` dans `frontend/`.

Le build Maven copie les fichiers générés par Vite dans le jar. Après une modification de l'interface, reconstruire le frontend avant de reconstruire le backend. Sous PowerShell, utiliser `npm.cmd` si l'exécution de `npm.ps1` est bloquée.

## Utilisation

- **Client** : Accueil, "Client", puis identité, motif, créneau, récapitulatif et validation.
- **Conseiller** : Accueil, "Conseiller", connexion avec `admin` / `admin`, puis tableau des demandes avec case "appelé".

Les demandes sont stockées dans une base H2 fichier créée dans `data/` (relatif au dossier de lancement du jar, ignoré par Git) ; supprimer ce dossier réinitialise les données. En développement, `npm run dev` dans `frontend/` redirige `/api` vers `localhost:8080` (backend lancé en parallèle). Tests : `npm test` dans `frontend/`, `mvn test` dans `backend/`.

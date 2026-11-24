# Documentation du projet Replay

## Architecture

Le projet est composé de trois services Docker :

- `frontend` : interface SolidJS, TypeScript et Vite, accessible sur http://localhost:5173.
- `backend` : API Laravel, accessible sur http://localhost:8000.
- `db` : base PostgreSQL. Le port du conteneur est `5432`; le port exposé sur la machine est défini par `POSTGRES_PORT` (par défaut `5436`).

Le fichier `.env` actif se trouve à la racine. Il est ignoré par Git et monté dans le conteneur Laravel sous `/app/.env`. Le fichier `.env.example` à la racine est le modèle à copier pour une nouvelle installation. Les fichiers `backend/.env.example` et `frontend/.env.example` sont des modèles pour les lancements de ces applications hors Docker.

## Premier démarrage

À la racine du dépôt :

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec backend php artisan key:generate
docker compose restart backend
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan games:import
```

La génération de clé est nécessaire une seule fois après la création du `.env`. Le redémarrage du backend lui fait relire cette clé. Ne remplace pas ensuite une clé déjà utilisée sans raison : elle sert notamment au chiffrement des sessions.

Pour les démarrages suivants :

```bash
docker compose up -d
```

Si le `Dockerfile` ou les dépendances d’image changent, reconstruis le service concerné, par exemple :

```bash
docker compose up -d --build backend
```

`games:import` copie des jeux IGDB dans PostgreSQL. Il faut `TWITCH_CLIENT_ID` et `TWITCH_CLIENT_SECRET` dans le `.env` racine (voir [documentation/catalogue.md](documentation/catalogue.md)). On peut le relancer pour mettre à jour le catalogue. Il ne faut pas utiliser `docker compose down -v` sauf si tu veux supprimer aussi le volume PostgreSQL et les données locales.

## Catalogue des jeux

Les jeux sont stockés dans PostgreSQL. La migration `backend/database/migrations/2026_11_12_000000_create_games_table.php` crée la table, le modèle est `App\Models\Game`, et `php artisan games:import` copie le catalogue depuis IGDB. Le détail de cette copie et le contrat de l'API locale sont dans [documentation/catalogue.md](documentation/catalogue.md).

Routes disponibles :

| Méthode | Route | Rôle |
| --- | --- | --- |
| `GET` | `/api/health` | Vérifie que l’API répond. |
| `GET` | `/api/games` | Retourne le catalogue complet. |
| `GET` | `/api/games/search?q=elden` | Recherche dans les titres; `q` est obligatoire et limité à 100 caractères. |
| `GET` | `/api/games/{slug}` | Retourne la fiche d’un jeu identifié par son slug. |
| `GET` | `/api/user` | Retourne l’utilisateur connecté via Sanctum. |

Les réponses de jeux sont mises au format frontend par `GameResource` (`release_year` devient `releaseYear`, `cover_url` devient `coverUrl`, etc.).

## Recherche et genres

La page d’accueil charge le catalogue avec `GET /api/games`. La recherche par nom appelle `GET /api/games/search`. Les fiches de jeu utilisent `GET /api/games/{slug}`.

Le menu des genres est construit à partir des genres présents dans les jeux reçus de l’API. Il permet de rechercher un genre dans la liste et d’en sélectionner plusieurs. Un jeu est affiché s’il correspond à au moins un genre sélectionné. Quand un titre est aussi saisi, le frontend filtre par genre les résultats de la recherche API. Le tri (insertion, rapide ou fusion) reste exécuté dans le frontend.

## Authentification

Le dépôt inclut les routes d’authentification Laravel Breeze et l’authentification API par Sanctum. Les requêtes du frontend utilisent les sessions Laravel; les origines locales figurent dans `SANCTUM_STATEFUL_DOMAINS` et `FRONTEND_URL`.

Voir aussi [documentation/authentification.md](documentation/authentification.md).

## Vérification et dépannage

État des services :

```bash
docker compose ps
```

Tester l’API et le catalogue :

```bash
curl -i http://localhost:8000/api/health
curl -i -H 'Origin: http://localhost:5173' -H 'Accept: application/json' http://localhost:8000/api/games
```

Si le frontend reste sur « Chargement du catalogue » :

1. Vérifie que le service `backend` est `Up` avec `docker compose ps`.
2. Consulte les erreurs avec `docker compose logs --tail=100 backend`.
3. Vérifie que la requête `/api/games` retourne `HTTP 200`.
4. Vérifie que le `.env` racine contient une `APP_KEY` générée et les paramètres PostgreSQL. Après une modification de `.env`, redémarre le backend avec `docker compose restart backend`.
5. Après un changement du `Dockerfile`, reconstruis le backend avec `docker compose up -d --build backend`.

Pour le détail de la clé et des valeurs locales, ne partage pas le fichier `.env` et ne l’ajoute pas à Git. Seul `.env.example` doit être versionné.

## Tests et qualité

Tests backend :

```bash
docker compose exec backend php artisan test
```

Vérifications frontend :

```bash
docker compose exec frontend npm run typecheck
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
```

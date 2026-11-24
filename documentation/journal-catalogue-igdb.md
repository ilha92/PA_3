# Journal : passage du catalogue de test à IGDB

Ce document explique ce qui a été fait, dans quel ordre et pourquoi. Il sert à présenter le travail et à aider l'équipe à reprendre le code. Le mode d'emploi de l'import et le format de l'API sont dans [catalogue.md](catalogue.md).

## Le problème de départ

- Le catalogue était une liste de 42 jeux écrits à la main dans `GameSeeder.php`, avec des jaquettes stockées dans `frontend/public/covers/`.
- Le système de notation (travail d'un collègue) permettait donc de noter seulement ces 42 jeux de démonstration.
- L'objectif : un vrai catalogue (tous les jeux connus, avec jaquette, description, studio, genres), stocké dans notre base pour ne pas dépendre d'un service extérieur à chaque visite, **sans modifier la notation**.

## Étape 0 : remettre l'application en marche

Avant de toucher au catalogue, l'accueil restait bloqué sur « Chargement du catalogue… ». Deux causes, toutes deux de configuration :

| Symptôme | Cause | Correction |
| --- | --- | --- |
| `/api/games` en erreur 500 : `relation "game_ratings" does not exist` | La migration de la notation n'avait pas été lancée en local. | `docker compose exec backend php artisan migrate --force` |
| Toujours 500, mais seulement depuis le navigateur | Le `.env` racine (celui monté dans Docker) n'avait pas d'`APP_KEY`. Les requêtes du frontend ouvrent une session Sanctum, qui doit être chiffrée. Sans clé, Laravel plante. Un `curl` sans en-tête `Origin` ne passait pas par la session, d'où l'erreur invisible en ligne de commande. | Le `.env` racine a été complété à partir de `.env.example`, puis `php artisan key:generate` et `docker compose restart backend`. |

À retenir : après un `git pull` qui ajoute une migration, il faut relancer `migrate`. Et le `.env` utilisé par Docker est celui **de la racine**, pas `backend/.env`.

## Étape 1 : choisir une source de données

Trois sources ont été essayées. Le choix final est IGDB.

| Source | Avantage | Pourquoi elle n'a pas été gardée |
| --- | --- | --- |
| Steam (SteamSpy + magasin Steam) | Aucune clé, réponses en français. | Uniquement les jeux PC vendus sur Steam : pas de Kingdom Hearts 1, pas d'exclusivités console. Certaines fiches n'ont pas de jaquette verticale. Import lent (un appel par jeu, environ 20 minutes pour 1 000 jeux). |
| RAWG | Une seule clé. | L'inscription a été jugée trop contraignante, et l'image fournie est une capture large, pas une vraie jaquette. Le code a été écrit puis remplacé. |
| **IGDB (Twitch)** | Base la plus complète (environ 230 000 jeux avec jaquette, toutes plateformes), vraies jaquettes, 500 fiches par appel. | Retenue. Il faut une application Twitch gratuite (Client ID et Client Secret), créée en deux minutes. |

## Étape 2 : copier IGDB dans PostgreSQL

Choix principal : **on copie les données une fois** au lieu d'appeler IGDB à chaque visite.

- Le site reste rapide et fonctionne même si IGDB ou Twitch tombent.
- Les clés Twitch restent sur le serveur, le navigateur ne les voit jamais.
- La table `games` existante est réutilisée telle quelle : aucune migration, et le format JSON renvoyé au frontend (`GameResource`) ne change pas.

Tout tient dans une commande Artisan : `backend/app/Console/Commands/ImportGames.php`.

```bash
docker compose exec backend php artisan games:import
```

Elle fonctionne en quatre temps :

1. Elle demande un jeton à Twitch avec `TWITCH_CLIENT_ID` et `TWITCH_CLIENT_SECRET`.
2. Elle interroge IGDB par pages de 500, les jeux les plus notés d'abord. Elle ne garde que les jeux qui ont une jaquette et une date de sortie, de type jeu principal, remake, remaster ou édition enrichie, et exclut les simples versions d'un autre jeu.
3. Pour chaque jeu, elle fait un `updateOrCreate` sur le slug : un jeu déjà présent est mis à jour, un nouveau est ajouté.
4. Elle supprime les anciens jeux (Steam ou démonstration) **seulement s'ils n'ont aucune note**.

Détails de conversion :

| Champ en base | Valeur IGDB |
| --- | --- |
| `cover_url` | Jaquette en taille `cover_big_2x` (assez nette pour la fiche) |
| `background_url` | Premier artwork, sinon première capture, en 1080p |
| `rating` | Note IGDB sur 100, divisée par 20 pour obtenir une note sur 5 |
| `developer` | Première société marquée comme développeur |
| `summary` | Résumé IGDB (en anglais) |

Pourquoi 5 000 jeux par défaut : avec 2 000, des titres moins notés comme Metal Gear Survive manquaient. Il en faut environ 3 900 pour l'atteindre. 5 000 se copient en une vingtaine de secondes.

Problème rencontré : Kingdom Hearts 1 n'apparaissait pas, car IGDB le classe comme « édition enrichie » (`game_type = 10`). Ce type a été ajouté au filtre.

## Étape 3 : séparer le mur 3D du catalogue

Le mur three.js de l'accueil affichait les jaquettes du catalogue. Avec IGDB, il aurait téléchargé des milliers d'images. Il lit désormais une petite liste fixe : `frontend/src/data/coverWall.json`, qui pointe vers les jaquettes locales de `frontend/public/covers/`. Ce fichier ne sert **qu'à** ce mur.

## Étape 4 : tests et documentation

- `backend/tests/Feature/ImportGamesTest.php` simule Twitch et IGDB (`Http::fake`). Il vérifie qu'un jeu est bien converti, qu'un ancien jeu sans note est supprimé et qu'un jeu noté est conservé avec sa note. Il n'appelle jamais internet.
- Les tests existants de recherche et de notation passent toujours.
- [catalogue.md](catalogue.md) explique comment obtenir les clés et lancer l'import, et décrit les routes à utiliser.

## Fichiers modifiés

| Fichier | Changement |
| --- | --- |
| `backend/app/Console/Commands/ImportGames.php` | Nouveau : import IGDB. |
| `backend/config/services.php` | Ajout de `services.igdb` (lit `TWITCH_CLIENT_ID` et `TWITCH_CLIENT_SECRET`). |
| `backend/database/seeders/GameSeeder.php` | Ne remplit plus rien, renvoie vers `games:import`. |
| `backend/database/seeders/DatabaseSeeder.php` | N'appelle plus `GameSeeder`. |
| `backend/tests/Feature/ImportGamesTest.php` | Nouveau test de l'import. |
| `frontend/src/data/coverWall.json` | Nouveau : jaquettes du mur 3D. |
| `frontend/src/components/home/Hero.tsx`, `CoverWall.tsx`, `lib/coverWall.ts` | Le mur lit le JSON au lieu du catalogue. |
| `.env.example` | Ajout de `TWITCH_CLIENT_ID` et `TWITCH_CLIENT_SECRET`. |
| `DOCUMENTATION_PROJET.md` | Premier démarrage : `games:import` remplace le seeder. || `documentation/catalogue.md` | Mode d'emploi et format de l'API. |

Les fichiers de la notation (`GameRatingController`, `GameRating`, `GameRating.tsx`, `ratings.ts`) n'ont pas été modifiés.

## Mise en place pour un collègue

```bash
git pull
cp .env.example .env              # seulement si tu n'as pas encore de .env racine
# remplir TWITCH_CLIENT_ID et TWITCH_CLIENT_SECRET (voir catalogue.md)
docker compose up -d
docker compose exec backend php artisan key:generate   # seulement si APP_KEY est vide
docker compose restart backend
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan games:import
```

Chacun peut créer sa propre application Twitch, ou l'équipe peut partager une seule paire de clés en privé. Les clés ne doivent jamais être commitées : `.env` est ignoré par Git, seul `.env.example` (vide) est versionné.

## Problèmes à régler

Par ordre d'importance.

1. **L'accueil charge tout le catalogue d'un coup.** `GET /api/games` renvoie les 5 000 jeux, soit environ 4,7 Mo. C'est rapide en local, mais lourd en production (performances, Core Web Vitals, mobile). Il faut paginer cette route (par exemple `?page=1`, 40 jeux par page) et adapter l'accueil et le filtre par genre, qui travaille aujourd'hui sur la liste complète côté navigateur. Le filtre par genre devra sans doute passer côté serveur.
2. **Doublon The Witcher 3.** L'ancienne fiche de démonstration (`the-witcher-3`, jaquette locale) a été conservée parce qu'elle a des notes, à côté de la fiche IGDB (`the-witcher-3-wild-hunt`). Il faut déplacer ces notes vers la fiche IGDB (mettre à jour `game_id` dans `game_ratings`, en gérant le cas d'un utilisateur qui a noté les deux), puis supprimer l'ancienne fiche.
3. **Liens vers les anciens slugs.** Les slugs viennent maintenant d'IGDB (`the-witcher-3-wild-hunt` au lieu de `the-witcher-3`, par exemple). Un lien ou un favori vers un ancien slug renvoie 404.
4. **Textes en anglais.** Les résumés et les noms de genres IGDB sont en anglais, alors que le site est en français et en anglais. Pistes : traduire les genres via les fichiers i18n (la liste est courte et fixe), et afficher un libellé « résumé en anglais » sur la fiche.
5. **Quelques résumés inexacts.** IGDB décrit parfois une autre édition du jeu (le résumé de Kingdom Hearts parle de la version internationale). C'est une donnée IGDB, pas un bug du code.
6. **Note du catalogue et note des joueurs.** `rating` vient maintenant d'IGDB (note sur 100 ramenée sur 5). La fiche l'affiche à côté de la moyenne des utilisateurs Replay. Il faut décider si l'on garde les deux.
7. **Le catalogue ne se met pas à jour seul.** Les nouvelles sorties n'arrivent que si quelqu'un relance `games:import`. Si besoin, on peut le planifier dans `routes/console.php` (par exemple une fois par semaine).
8. **Images hébergées chez IGDB.** Les jaquettes sont chargées depuis `images.igdb.com`. Si IGDB change ses URLs, il suffit de relancer l'import, mais les images ne sont pas stockées chez nous.
9. **Textes en dur dans la fiche jeu.** `frontend/src/pages/jeuxDetail.tsx` contient du texte français écrit en dur (« Chargement du jeu… », « Retour », « Aucune description disponible. »). Ce n'est pas lié à IGDB, mais à corriger pour l'i18n.
10. **Ne pas lancer `npm run dev` dans `backend/`.** Ce Vite utilise aussi le port 5173 et entre en conflit avec le frontend Docker.

## Comment l'expliquer en une phrase

On remplace la liste de test par une copie locale d'IGDB, faite par une commande Artisan. Le site reste rapide et indépendant, les jeux sans jaquette sont filtrés dès l'import, et la notation n'a pas eu à changer car les jeux restent identifiés par leur slug.

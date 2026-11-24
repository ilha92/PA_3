# Catalogue des jeux

L'historique des choix (pourquoi IGDB, étapes, problèmes restants) est dans [journal-catalogue-igdb.md](journal-catalogue-igdb.md).

Les fiches (titre, année, studio, genres, jaquette, visuel, description, note du catalogue) viennent d'IGDB, la base de jeux de Twitch. On les copie **une fois** dans PostgreSQL. Ensuite le site lit uniquement la base : si IGDB est indisponible, le catalogue déjà importé continue de s'afficher.

Les notes des utilisateurs ne passent pas par IGDB. Elles restent dans `game_ratings`, liées au jeu local. L'import ne supprime jamais un jeu qui a déjà reçu une note.

## Obtenir les clés (une seule fois)

1. Se connecter sur https://dev.twitch.tv/console avec un compte Twitch. La double authentification doit être activée.
2. « Enregistrer votre application » : un nom au choix, URL de redirection `http://localhost`, catégorie « Application Integration ».
3. Copier le **Client ID**, puis cliquer sur « Nouveau secret » pour obtenir le **Client Secret**.

Les coller dans le `.env` racine, puis redémarrer le backend :

```env
TWITCH_CLIENT_ID=ton_client_id
TWITCH_CLIENT_SECRET=ton_client_secret
```

```bash
docker compose restart backend
```

## Remplir ou mettre à jour la base

```bash
docker compose exec backend php artisan games:import
```

La commande copie 5 000 jeux en quelques secondes, les plus notés d'abord : jeux principaux, remakes, remasters et éditions enrichies, toutes plateformes. **Seuls les jeux qui ont une jaquette sont copiés.** IGDB en propose environ 230 000. Pour en copier davantage :

```bash
docker compose exec backend php artisan games:import --limit=20000
```

La taille du catalogue ne ralentit pas le site : `GET /api/games` est paginé (20 jeux, environ 20 Ko par page).

Relancer la commande met à jour les jeux déjà présents (même slug) et ajoute les nouveaux. Elle retire les anciens jeux qui ne viennent pas d'IGDB, **seulement** s'ils n'ont aucune note.

`php artisan db:seed --class=GameSeeder` ne remplit plus le catalogue.

## D'où viennent les données

| Rôle | Adresse |
| --- | --- |
| Jeton (valable environ deux mois, redemandé à chaque import) | `POST https://id.twitch.tv/oauth2/token` |
| Fiches, 500 par appel | `POST https://api.igdb.com/v4/games` |
| Jaquette | `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/IMAGE.jpg` |
| Visuel large | `https://images.igdb.com/igdb/image/upload/t_1080p/IMAGE.jpg` |

La description est le résumé IGDB, en anglais. La note du catalogue (`rating`, sur 5) est la note IGDB (sur 100) divisée par 20. Ce n'est pas la moyenne des utilisateurs Replay.

Le code qui fait cette copie est `backend/app/Console/Commands/ImportGames.php`.

## API locale à utiliser dans le frontend

Le frontend n'appelle jamais IGDB. Il appelle Laravel. La forme ci-dessous ne change pas quand on relance l'import : seuls les contenus (textes, images, slugs) changent.

| Méthode | Route | Rôle |
| --- | --- | --- |
| `GET` | `/api/games?page=1` | Catalogue paginé, 20 jeux par page, trié par id. |
| `GET` | `/api/games?genres[]=Adventure&genres[]=Puzzle` | Jeux qui ont au moins un des genres demandés (paginé aussi). |
| `GET` | `/api/genres` | Liste triée de tous les genres du catalogue : `{ "data": ["Adventure", ...] }`. |
| `GET` | `/api/games/search?q=kingdom` | Recherche sur le titre. `q` est obligatoire, 100 caractères maximum. |
| `GET` | `/api/games/{slug}` | Une fiche. 404 si le slug n'existe pas. |

Exemple de fiche :

```json
{
  "data": {
    "id": "12",
    "slug": "kingdom-hearts",
    "title": "Kingdom Hearts",
    "releaseYear": 2002,
    "developer": "Square",
    "genres": ["Role-playing (RPG)", "Adventure"],
    "coverUrl": "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co30zf.jpg",
    "backgroundUrl": "https://images.igdb.com/igdb/image/upload/t_1080p/ar5lw.jpg",
    "rating": 4.2,
    "communityRating": null,
    "communityRatingCount": 0,
    "summary": "Résumé renvoyé par IGDB."
  }
}
```

La liste paginée renvoie aussi `meta` (`current_page`, `last_page`, `total`, `per_page`) et `links`, au format standard de Laravel. Le frontend lit `data`, `meta.total` et `meta.last_page` dans `getGamePage()` (`frontend/src/services/games.ts`).

`id` est l'id PostgreSQL, pas l'id IGDB. `coverUrl` est toujours rempli. `backgroundUrl`, `rating` et `summary` peuvent être `null`. `communityRating` et `communityRatingCount` viennent des notes Replay.

Les routes de notation ne changent pas. Elles identifient le jeu par le **slug** :

| Méthode | Route | Corps |
| --- | --- | --- |
| `GET` | `/api/games/{slug}/rating` | — |
| `PUT` | `/api/games/{slug}/rating` | `{ "score": 1..5 }` |
| `DELETE` | `/api/games/{slug}/rating` | — |

Il faut être connecté (Sanctum). Voir [authentification.md](authentification.md).

## Mur 3D

`frontend/src/data/coverWall.json` ne sert qu'au mur three.js de l'accueil (`CoverWall`). Ce sont les jaquettes locales de démonstration. Le catalogue, la recherche et les fiches n'utilisent pas ce fichier.

## Fichiers

- `backend/app/Console/Commands/ImportGames.php` — copie IGDB vers la table `games`
- `backend/app/Models/Game.php` — modèle
- `backend/app/Http/Resources/GameResource.php` — forme JSON renvoyée au frontend
- `backend/app/Http/Controllers/GameController.php` — liste et fiche
- `backend/app/Http/Controllers/GameSearchController.php` — recherche
- `frontend/src/services/games.ts` — appels du frontend
- `frontend/src/types/game.ts` — type TypeScript correspondant à `GameResource`

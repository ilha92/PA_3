# Authentification

Premiere doc que je fait prenez l'habitude d'en faire en vrai :D

La connexion et l'inscription utilisent **Laravel Breeze** en mode API, avec **Sanctum** pour la session. Les écrans sont dans le frontend Solid, pas dans Blade.

## Commandes

À lancer dans `backend/` (ou dans le conteneur backend) :

```bash
composer require laravel/breeze --dev
php artisan breeze:install api
php artisan migrate
```

`breeze:install api` crée les contrôleurs, les routes et la config Sanctum. Il ne génère pas de pages React ou Vue : le frontend du projet reste celui de `frontend/`.

## Parcours

| Écran | Adresse | Route Laravel |
| --- | --- | --- |
| Inscription | `/register` | `POST /register` |
| Connexion | `/login` | `POST /login` |
| Déconnexion | bouton dans la barre | `POST /logout` |
| Utilisateur courant | — | `GET /api/user` |

Le mot de passe doit faire au moins 8 caractères. Après une inscription ou une connexion réussie, Laravel ouvre une session (cookie). Le frontend l'envoie avec `credentials: 'include'`.

Avant `POST /login`, `/register` et `/logout`, le frontend appelle `GET /sanctum/csrf-cookie` et renvoie le jeton dans l'en-tête `X-XSRF-TOKEN`.

## Fichiers utiles

Côté Laravel, seuls trois fichiers servent aux écrans actuels :

- `backend/app/Http/Controllers/Auth/RegisteredUserController.php` — créer un compte
- `backend/app/Http/Controllers/Auth/AuthenticatedSessionController.php` — connecter et déconnecter
- `backend/app/Http/Requests/Auth/LoginRequest.php` — vérifier l'e-mail, le mot de passe, et limiter les essais

Breeze ajoute aussi le mot de passe oublié et la vérification d'e-mail (`PasswordResetLinkController`, `NewPasswordController`, `VerifyEmailController`, `EmailVerificationNotificationController`). Ces routes existent, mais aucune page du site ne les affiche.

Côté frontend :

- `frontend/src/pages/Auth.tsx` — les deux formulaires
- `frontend/src/services/auth.ts` — les appels HTTP
- `frontend/src/auth.tsx` — l'utilisateur connecté, partagé dans l'application

## Session entre les deux ports

Le site est sur `localhost:5173`, l'API sur `localhost:8000`. Pour que le cookie de session soit accepté, `backend/.env` contient :

```env
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173,localhost:8000,127.0.0.1:8000
FRONTEND_URL=http://localhost:5173
```

`FRONTEND_URL` est aussi l'origine autorisée par le CORS (`backend/config/cors.php`), avec `supports_credentials` à `true`.

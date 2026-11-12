FROM php:8.4-cli AS backend

# libpq pour pdo_pgsql, git et unzip pour Composer.
RUN apt-get update \
  && apt-get install -y --no-install-recommends libpq-dev git unzip \
  && docker-php-ext-install pdo_pgsql \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

EXPOSE 8000

# Le code est monte en volume : on installe les dependances au demarrage.
CMD ["sh", "-c", "composer install --no-interaction && php artisan serve --host=0.0.0.0 --port=8000"]

FROM node:22-alpine AS frontend

WORKDIR /app

EXPOSE 5173

# Le code est monte en volume : on installe les dependances au demarrage.
# `npm ci` plutot que `npm install` pour ne jamais modifier le lockfile.
CMD ["sh", "-c", "npm ci && npm run dev -- --host 0.0.0.0"]
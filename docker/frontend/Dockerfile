FROM node:22-alpine

WORKDIR /app

EXPOSE 5173

# Le code est monte en volume : on installe les dependances au demarrage.
# `npm ci` plutot que `npm install` pour ne jamais modifier le lockfile.
CMD ["sh", "-c", "npm ci && npm run dev -- --host 0.0.0.0"]

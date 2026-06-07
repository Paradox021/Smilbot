# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Install build dependencies (required for compiling native Node modules like opus if needed)
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

COPY src ./src

# Compile TypeScript
RUN npm run build

# Prune development dependencies to keep node_modules minimal for production
RUN npm prune --omit=dev

# Stage 2: Production
FROM node:20-slim

# Install FFmpeg (required by discord-player for audio/music playback)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json ./

# Copy compiled code and pruned production node_modules from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Use non-root node user for security
RUN chown -R node:node /usr/src/app
USER node

ENV NODE_ENV=production

# Run node directly (PID 1) instead of 'npm start' to properly handle OS signals (like SIGTERM)
CMD ["node", "dist/index.js"]

FROM node:20

# 1. ROBO 1: Instalar las dependencias de audio nativas de Linux (FFmpeg + Opus nativo)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-venv \
    build-essential \
    libopus-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. ROBO 2: El truco maestro del Entorno Virtual (venv) para yt-dlp
# Crea una burbuja aislada para yt-dlp y le hace un acceso directo global
RUN python3 -m venv /opt/ytdlp \
    && /opt/ytdlp/bin/pip install --no-cache-dir --upgrade pip yt-dlp \
    && ln -s /opt/ytdlp/bin/yt-dlp /usr/local/bin/yt-dlp

WORKDIR /usr/src/app

# 3. Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# 4. Instalar todas las dependencias de Node juntas
RUN npm install

# 5. Copiar código fuente y compilar TypeScript
COPY src ./src
RUN npm run build

# Configurar permisos para el usuario seguro node
RUN chown -R node:node /usr/src/app
USER node

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
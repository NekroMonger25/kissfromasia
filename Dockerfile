FROM node:18-slim

# Installa git e chromium
RUN apt-get update && apt-get install -y \
    git \
    chromium \
    fonts-freefont-ttf \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Clona la repo kissfromasia
RUN git clone https://github.com/NekroMonger25/kissfromasia.git /app/kissfromasia

WORKDIR /app/kissfromasia

# Installa le dipendenze
RUN npm install --production

# Copia eventuali file locali (es. cache)
COPY ./cache ./cache

# Espone la porta
EXPOSE 3000

# Variabili d'ambiente di default (possono essere sovrascritte da compose)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

# Avvia l'addon
CMD ["node", "index.js"]

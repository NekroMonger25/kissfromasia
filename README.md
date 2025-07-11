# KissKH Stremio Addon v1.3.6

Addon Stremio per contenuti asiatici con bypass automatico Cloudflare tramite VPN integrata e FlareSolverr.

## 🚀 Setup Rapido

### 1. Configurazione
Crea un file `.env` con le tue credenziali ProtonVPN:
```bash
OPENVPN_USERNAME=your_protonvpn_username
OPENVPN_PASSWORD=your_protonvpn_password
ADDON_PORT=3000
FLARESOLVERR_PORT=8191
```

### 2. Avvio
```bash
docker-compose up -d
```

### 3. Accesso
- **Addon**: http://localhost:3000/manifest.json
- **FlareSolverr**: http://localhost:8191

## �️ Funzionalità

- ✅ **VPN automatica**: Rotazione geografica multi-paese europea
- ✅ **Bypass Cloudflare**: FlareSolverr + Puppeteer dual-layer
- ✅ **Ricerca intelligente**: Algoritmi di similarità avanzati  
- ✅ **Sottotitoli italiani**: Download automatico (.srt, .txt)
- ✅ **Cache ottimizzata**: Performance migliorate
- ✅ **Hosting ready**: Supporto completo per deployment remoto

## 🌍 VPN Integrata

L'addon utilizza automaticamente server VPN da:
- Germania, Italia, Paesi Bassi, Svizzera
- Francia, Spagna, Austria, Belgio  
- Polonia, Svezia, Danimarca, Norvegia
- Finlandia, Repubblica Ceca

La rotazione geografica avviene automaticamente ad ogni riavvio per ottimizzare il bypass Cloudflare.

## 🚀 Hosting Remoto

### Portainer

Per configurare in Portainer:

1. Vai alla sezione "Containers"
2. Seleziona "Add container" o modifica il container esistente
3. Scorri fino alla sezione "Environment"
4. Aggiungi le variabili d'ambiente:
   - `GITHUB_TOKEN` con il tuo token personale
   - `OPENVPN_USERNAME` con username ProtonVPN
   - `OPENVPN_PASSWORD` con password ProtonVPN
5. Imposta i limiti di risorse nella sezione "Resources":
   - Memory limit: `512M`
   - CPU limit: `0.5` (metà di un core)

### Railway/Render/Vercel

Configura nelle impostazioni del servizio:

- `OPENVPN_USERNAME=your_username`
- `OPENVPN_PASSWORD=your_password`
- `GITHUB_TOKEN=your_token`

#### Railway
1. Vai al tuo servizio → "Variables"
2. Aggiungi le variabili d'ambiente necessarie

#### Render
1. Vai al tuo servizio → "Environment"
2. Aggiungi le variabili d'ambiente necessarie

#### Vercel
1. Vai al tuo progetto → "Settings" → "Environment Variables"
2. Aggiungi le variabili d'ambiente necessarie

### Hugging Face Spaces

1. Vai al tuo Space
2. Seleziona "Settings" → "Repository secrets"
3. Aggiungi le variabili d'ambiente necessarie

### VPS/Server

```bash
# Clona il repository
git clone <repo-url>
cd kisskh-addon

# Configura .env
echo "OPENVPN_USERNAME=your_username" > .env
echo "OPENVPN_PASSWORD=your_password" >> .env
echo "GITHUB_TOKEN=your_token" >> .env

# Avvia
docker-compose up -d
```

## 🔧 Risoluzione Problemi

### Cloudflare Bypass

Se riscontri problemi con il bypass di Cloudflare:

- Verifica che Chromium sia installato correttamente nel container
- Controlla che le variabili d'ambiente siano configurate correttamente
- Aumenta il valore di `CF_MAX_RETRY` e `CF_RETRY_DELAY` per dare più tempo al bypass
- Controlla i log del container per eventuali errori

### Performance

**Requisiti minimi:**
- **Memoria**: 512MB RAM
- **CPU**: 0.5 core
- **Storage**: 500MB per Chromium e dipendenze
- **Rete**: Connessione internet stabile

### VPN Issues

Se hai problemi con la VPN:

- Verifica le credenziali ProtonVPN nel file `.env`
- Controlla che i privilegi NET_ADMIN siano abilitati
- Testa la connettività dei server VPN
- Controlla i log del container Gluetun

### Note Importanti

- **Memoria**: L'utilizzo di Puppeteer richiede una quantità significativa di memoria
- **CPU**: Per prestazioni ottimali, assicurati di avere almeno 0.5 CPU core disponibili
- **Storage**: Assicurati di avere almeno 500MB di spazio per Chromium e le dipendenze
- **Rete**: L'addon richiede una connessione internet stabile per accedere a KissKH e bypassare Cloudflare

## � Configurazione Avanzata

### Variabili d'Ambiente

#### Configurazione VPN (Richiesta)

| Variabile | Descrizione | Default |
|-----------|-------------|---------|
| `OPENVPN_USERNAME` | Username ProtonVPN | **Richiesto** |
| `OPENVPN_PASSWORD` | Password ProtonVPN | **Richiesto** |

#### Configurazione GitHub (Richiesta)

| Variabile | Descrizione | Default |
|-----------|-------------|---------|
| `GITHUB_TOKEN` | Token GitHub per sottotitoli gist | **Richiesto** |

> **IMPORTANTE**: Il token GitHub è necessario per il corretto funzionamento dei sottotitoli. Assicurati di:
> 1. Creare un token con almeno lo scope `gist`
> 2. Configurare la variabile d'ambiente prima di avviare il container
> 3. Non condividere il token con altri

#### Configurazione Porte

| Variabile | Valore Predefinito | Descrizione |
|-----------|-------------------|-------------|
| `ADDON_PORT` | `3000` | Porta addon |
| `FLARESOLVERR_PORT` | `8191` | Porta FlareSolverr |

#### Configurazione Puppeteer

| Variabile | Valore Predefinito | Descrizione |
|-----------|-------------------|-------------|
| `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` | `true` | Evita il download di Chromium durante l'installazione |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium` | Percorso dell'eseguibile Chromium nel container |
| `PUPPETEER_ARGS` | `--no-sandbox --disable-setuid-sandbox...` | Argomenti aggiuntivi per Chromium |

#### Configurazione Node.js

| Variabile | Valore Predefinito | Descrizione |
|-----------|-------------------|-------------|
| `NODE_ENV` | `production` | Modalità di esecuzione di Node.js |
| `ENABLE_GARBAGE_COLLECTION` | `true` | Abilita la garbage collection manuale |
| `GC_INTERVAL` | `300000` | Intervallo per la garbage collection in ms (5 minuti) |

#### Configurazione Cache

| Variabile | Valore Predefinito | Descrizione |
|-----------|-------------------|-------------|
| `CACHE_TTL` | `3600` | Tempo di cache in secondi (1 ora) |

#### Configurazione Cloudflare

| Variabile | Valore Predefinito | Descrizione |
|-----------|-------------------|-------------|
| `CF_COOKIE_MAX_AGE` | `3600000` | Durata massima del cookie Cloudflare in ms (1 ora) |
| `CF_MAX_RETRY` | `3` | Numero massimo di tentativi per ottenere il cookie |
| `CF_RETRY_DELAY` | `5000` | Ritardo iniziale tra i tentativi in ms (5 secondi) |

## 🔑 Guida Setup GitHub Token

Per il corretto funzionamento dei sottotitoli, è necessario configurare un token GitHub:

### Passo 1: Creazione Token
1. Vai su [GitHub Settings > Developer Settings > Personal Access Tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Clicca su "Generate new token (classic)"
3. Dai un nome al token (es. "KissKH Addon")
4. Seleziona **solo** lo scope `gist`
5. Clicca "Generate token"

### Passo 2: Configurazione
1. **IMPORTANTE**: Copia il token mostrato e salvalo in un posto sicuro
2. Aggiungi al file `.env`:
```bash
GITHUB_TOKEN=your_token_here
```
3. Oppure configura come variabile d'ambiente nel tuo hosting

### Passo 3: Verifica
Il token verrà utilizzato per creare gist pubblici contenenti i sottotitoli italiani per Stremio.

## �📋 Requisiti

- Docker & Docker Compose
- Account ProtonVPN (gratuito supportato)
- Token GitHub per sottotitoli gist
- 2GB RAM minimi | 0.5 CPU core
- Privilegi NET_ADMIN per VPN
- 500MB storage per Chromium

## 📄 Esempio docker-compose.yml Completo

```yaml
version: '3'
services:
  vpn:
    image: qmcgaw/gluetun
    container_name: kisskh-vpn
    cap_add:
      - NET_ADMIN
    environment:
      - VPN_SERVICE_PROVIDER=protonvpn
      - OPENVPN_USERNAME=${OPENVPN_USERNAME}
      - OPENVPN_PASSWORD=${OPENVPN_PASSWORD}
      - SERVER_COUNTRIES=Germany,Netherlands,Switzerland,Sweden
    volumes:
      - ./gluetun:/gluetun
    restart: unless-stopped

  flaresolverr:
    image: flaresolverr/flaresolverr:latest
    container_name: kisskh-flaresolverr
    network_mode: "service:vpn"
    environment:
      - BROWSER_TIMEOUT=120000
    depends_on:
      - vpn
    restart: unless-stopped

  addon:
    build: .
    container_name: kisskh-addon
    network_mode: "service:vpn"
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - FLARESOLVERR_URL=http://localhost:8191
    depends_on:
      - vpn
      - flaresolverr
    restart: unless-stopped
```

---

**🎭 KissKH Stremio Addon v1.3.6**  
*VPN-ready con rotazione geografica automatica per contenuti asiatici*
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

### Railway/Render/Vercel
Aggiungi le variabili d'ambiente:
- `OPENVPN_USERNAME=your_username`
- `OPENVPN_PASSWORD=your_password`

### VPS/Server
```bash
# Clona il repository
git clone <repo-url>
cd kisskh-addon

# Configura .env
echo "OPENVPN_USERNAME=your_username" > .env
echo "OPENVPN_PASSWORD=your_password" >> .env

# Avvia
docker-compose up -d
```

## 📋 Requisiti

- Docker & Docker Compose
- Account ProtonVPN (gratuito supportato)
- 2GB RAM minimi
- Privilegi NET_ADMIN per VPN

## 🔧 Configurazione Avanzata

### Variabili d'Ambiente

| Variabile | Descrizione | Default |
|-----------|-------------|---------|
| `OPENVPN_USERNAME` | Username ProtonVPN | **Richiesto** |
| `OPENVPN_PASSWORD` | Password ProtonVPN | **Richiesto** |
| `ADDON_PORT` | Porta addon | `3000` |
| `FLARESOLVERR_PORT` | Porta FlareSolverr | `8191` |

### Stack Completo

L'addon include:
- **VPN Container**: Gluetun con ProtonVPN
- **FlareSolverr**: Bypass Cloudflare via browser headless
- **KissKH Addon**: Server Node.js con dual bypass
- **Networking**: Tutto il traffico passa attraverso VPN

## 🎬 Uso con Stremio

1. Aggiungi addon: `http://localhost:3000/manifest.json`
2. Cerca contenuti asiatici dalla home di Stremio  
3. Sottotitoli italiani caricati automaticamente
4. Supporta ricerca per titolo e ID TMDB/IMDB

---

**Versione 1.3.6** - VPN-ready con rotazione geografica automatica
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
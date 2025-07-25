// Carica le variabili d'ambiente dal file .env
require('dotenv').config();

// Abilita la garbage collection manuale se l'app viene avviata con --expose-gc
if (process.env.ENABLE_GARBAGE_COLLECTION === 'true') {
  try {
    global.gc = global.gc || require('vm').runInNewContext('gc');
    console.log('[Memory] Garbage collection manuale abilitata');
    
    // Esegui garbage collection periodicamente
    const gcInterval = parseInt(process.env.GC_INTERVAL || '300000', 10); // Default 5 minuti
    setInterval(() => {
      const before = process.memoryUsage().heapUsed / 1024 / 1024;
      global.gc();
      const after = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`[Memory] Garbage collection eseguita: ${before.toFixed(2)} MB -> ${after.toFixed(2)} MB (liberati ${(before - after).toFixed(2)} MB)`);
    }, gcInterval);
  } catch (e) {
    console.warn('[Memory] Impossibile abilitare la garbage collection manuale:', e.message);
  }
}

// Verifica la presenza del token GitHub
if (!process.env.GITHUB_TOKEN) {
    console.error('[GitHub] GITHUB_TOKEN non impostato. I sottotitoli potrebbero non funzionare correttamente.');
    console.error('[GitHub] Per configurare, crea un token su https://github.com/settings/tokens e impostalo come variabile d\'ambiente GITHUB_TOKEN');
}

const { getRouter } = require('stremio-addon-sdk'); // Usa getRouter per ottenere solo la logica
const addonInterface = require('./api/stremio');
const path = require('path');
const http = require('http'); // Importa il modulo HTTP standard
const fs = require('fs').promises;

// Funzione per verificare la cartella cache
async function checkCacheFolder() {
    const cacheFolder = path.join(process.cwd(), 'cache');
    try {
        // Verifica se la cartella cache esiste
        await fs.access(cacheFolder);
        console.log('[Cache] Cartella cache trovata:', cacheFolder);
        
        // Lista i file nella cartella cache
        const files = await fs.readdir(cacheFolder);
        const subtitleFiles = files.filter(f => f.endsWith('.srt') || f.endsWith('.txt1') || f.endsWith('.txt'));
        
        if (subtitleFiles.length > 0) {
            console.log(`[Cache] Trovati ${subtitleFiles.length} file di sottotitoli in cache:`);
            for (const file of subtitleFiles) {
                const stats = await fs.stat(path.join(cacheFolder, file));
                console.log(`[Cache] - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
            }
        } else {
            console.log('[Cache] Nessun file di sottotitoli presente in cache');
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('[Cache] Cartella cache non trovata, verrà creata quando necessario');
            try {
                await fs.mkdir(cacheFolder, { recursive: true });
                console.log('[Cache] Cartella cache creata:', cacheFolder);
            } catch (mkdirError) {
                console.error('[Cache] Errore nella creazione della cartella cache:', mkdirError);
            }
        } else {
            console.error('[Cache] Errore nel controllo della cartella cache:', error);
        }
    }
}

// MODIFICA CHIAVE: Carica la configurazione da un file esterno se esiste.
// Questo è l'approccio più robusto e risolve il problema del binding a 127.0.0.1.
let options = {};
const configPath = './server-config.js';

try {
    options = require(configPath);
    console.log(`[Config] File di configurazione esterno caricato con successo da: ${configPath}`);
} catch (e) {
    console.warn(`[Config] File di configurazione non trovato in ${configPath}. Uso le opzioni di default.`);
    options = {
        port: process.env.PORT || 3000,
        host: '127.0.0.1', // Fallback sicuro se non c'è config
        logger: { 
            log: (msg) => console.log(`[Stremio] ${msg}`), 
            error: (msg) => console.error(`[Stremio] ${msg}`) 
        }
    };
}

// Funzione di inizializzazione asincrona
async function initServer() {
    try {
        // Verifica la cartella cache prima di avviare il server
        await checkCacheFolder();

        // Usa getRouter per ottenere solo la logica, senza avviare un server.
        // Questo è il modo corretto per evitare il server "fantasma" su 127.0.0.1.
        const router = getRouter(addonInterface);

        // Crea un nostro server HTTP per avere il pieno controllo su host e porta
        const server = http.createServer(router);

        // Avvia il nostro server sull'host e sulla porta specificati nel file di configurazione
        server.listen(options.port, options.host, () => {
            console.log(`[Server] Addon avviato e in ascolto su http://${options.host}:${options.port}`);
        });

    } catch (error) {
        console.error('[Server] Errore durante l\'inizializzazione:', error);
        process.exit(1);
    }
}

// Avvia il server
initServer();

const { serveHTTP } = require('stremio-addon-sdk');
const addonInterface = require('./api/stremio');
const path = require('path');
const fs = require('fs').promises;
const dotenv = require('dotenv');

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Verifica la presenza del token GitHub
if (!process.env.GITHUB_TOKEN) {
  console.error('[GitHub] GITHUB_TOKEN non impostato. I sottotitoli potrebbero non funzionare correttamente.');
  console.error('[GitHub] Per configurare, crea un token su https://github.com/settings/tokens e impostalo come variabile d\'ambiente GITHUB_TOKEN');
  process.exit(1); // Esci dall'applicazione se il token non è impostato
}

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


// Forza la porta desiderata (default 3000) per serveHTTP
process.env.PORT = process.env.PORT || '3000';

// Avvia la funzione di verifica cache
checkCacheFolder();

// Avvia l'addon Stremio sulla porta specificata
serveHTTP(addonInterface);

// Funzione per verificare la cartella cache
async function checkCacheFolder() {
  try {
    const cacheFolder = path.join(process.cwd(), 'cache');
    await fs.access(cacheFolder); // Verifica se la cartella cache esiste
    console.log('[Cache] Cartella cache trovata:', cacheFolder);
    
    const files = await fs.readdir(cacheFolder); // Lista i file nella cartella cache
    const subtitleFiles = files.filter(f => f.endsWith('.srt') || f.endsWith('.txt1') || f.endsWith('.txt'));
    console.log(`[Cache] Trovati ${subtitleFiles.length} file di sottotitoli in cache:`);
    for (const file of subtitleFiles) {
      console.log(`[Cache] - ${file}`);
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

// Esegui la funzione checkCacheFolder
checkCacheFolder();

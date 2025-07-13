const options = {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',  // Ascolta su tutte le interfacce
    logger: {
        log: (msg) => console.log(`[Stremio] ${msg}`),
        error: (msg) => console.error(`[Stremio] ${msg}`)
    }
};

module.exports = options;

const axios = require('axios');

class FlareSolverr {
    constructor() {
        this.url = process.env.FLARESOLVERR_URL || 'http://localhost:8191';
        this.enabled = process.env.FLARESOLVERR_ENABLED === 'true';
        this.timeout = parseInt(process.env.FLARESOLVERR_TIMEOUT) || 120000;
        this.sessionId = process.env.FLARESOLVERR_SESSION || 'kisskh_session';
        this.isSessionCreated = false;
    }

    async createSession() {
        if (this.isSessionCreated) return true;
        
        try {
            console.log('[FlareSolverr] Creating session...');
            const response = await axios.post(`${this.url}/v1`, {
                cmd: 'sessions.create',
                session: this.sessionId
            }, { timeout: this.timeout });

            if (response.data.status === 'ok') {
                this.isSessionCreated = true;
                console.log('[FlareSolverr] Session created successfully');
                return true;
            } else {
                console.error('[FlareSolverr] Failed to create session:', response.data.message);
                return false;
            }
        } catch (error) {
            console.error('[FlareSolverr] Error creating session:', error.message);
            return false;
        }
    }

    async destroySession() {
        if (!this.isSessionCreated) return true;
        
        try {
            console.log('[FlareSolverr] Destroying session...');
            await axios.post(`${this.url}/v1`, {
                cmd: 'sessions.destroy',
                session: this.sessionId
            }, { timeout: this.timeout });
            
            this.isSessionCreated = false;
            console.log('[FlareSolverr] Session destroyed');
            return true;
        } catch (error) {
            console.error('[FlareSolverr] Error destroying session:', error.message);
            return false;
        }
    }

    async request(url, options = {}) {
        if (!this.enabled) {
            throw new Error('FlareSolverr is disabled');
        }

        // Ensure session exists
        if (!await this.createSession()) {
            throw new Error('Failed to create FlareSolverr session');
        }

        try {
            console.log(`[FlareSolverr] Making request to: ${url}`);
            
            const requestData = {
                cmd: 'request.get',
                url: url,
                session: this.sessionId,
                maxTimeout: this.timeout,
                ...options
            };

            const response = await axios.post(`${this.url}/v1`, requestData, {
                timeout: this.timeout + 5000 // Add extra time for FlareSolverr processing
            });

            if (response.data.status === 'ok') {
                console.log('[FlareSolverr] Request successful');
                return {
                    status: response.data.solution.status,
                    url: response.data.solution.url,
                    cookies: response.data.solution.cookies,
                    userAgent: response.data.solution.userAgent,
                    headers: response.data.solution.headers,
                    response: response.data.solution.response
                };
            } else {
                throw new Error(`FlareSolverr error: ${response.data.message}`);
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('FlareSolverr service not available. Make sure it\'s running on ' + this.url);
            }
            throw error;
        }
    }

    async getCloudflareCookie(url) {
        try {
            const result = await this.request(url);
            
            // Extract cf_clearance cookie
            const cfCookie = result.cookies.find(cookie => cookie.name === 'cf_clearance');
            
            if (cfCookie) {
                const cookieString = `cf_clearance=${cfCookie.value}`;
                console.log('[FlareSolverr] cf_clearance cookie obtained:', cookieString.substring(0, 50) + '...');
                return cookieString;
            } else {
                console.warn('[FlareSolverr] No cf_clearance cookie found');
                return null;
            }
        } catch (error) {
            console.error('[FlareSolverr] Error getting cookie:', error.message);
            throw error;
        }
    }

    isEnabled() {
        return this.enabled;
    }

    async healthCheck() {
        try {
            const response = await axios.get(`${this.url}/health`, { timeout: 5000 });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

module.exports = FlareSolverr;
module.exports.instance = new FlareSolverr();

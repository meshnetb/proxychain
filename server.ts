import { Server } from 'proxy-chain';

// Railway automatically injects the PORT environment variable
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

// Read upstream proxy (e.g., http://apify.com)
const UPSTREAM_PROXY = process.env.UPSTREAM_PROXY_URL || '';

const server = new Server({
    port: PORT,
    host: '0.0.0.0', // Listen on all network interfaces for container routing
    
    // Intercepts traffic and forwards it securely
    prepareRequestFunction: ({ request }) => {
        // Build security-first headers by explicitly stripping revealing info
        const cleanedHeaders = { ...request.headers };
        delete cleanedHeaders['x-forwarded-for'];
        delete cleanedHeaders['x-real-ip'];
        delete cleanedHeaders['forwarded'];

        return {
            // If UPSTREAM_PROXY_URL is set, route through it; otherwise, go direct
            upstreamProxyUrl: UPSTREAM_PROXY || null,
            requestHeaders: cleanedHeaders
        };
    },
});

// Event listener for error tracking
server.on('requestFailed', ({ request, error }) => {
    console.error(`Request to ${request.url} failed:`, error.message);
});

// Initialize the server
server.listen(() => {
    console.log(`🚀 Anonymous Forward Proxy active using Bun v1.3`);
    console.log(`📡 Listening internally on port: ${PORT}`);
    if (UPSTREAM_PROXY) {
        console.log(`🔗 Chaining traffic upstream through: ${UPSTREAM_PROXY.split('@')[1] || UPSTREAM_PROXY}`);
    } else {
        console.log(`🌐 Routing traffic directly using Railway server's IP`);
    }
});

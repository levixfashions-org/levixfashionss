// Root entry point for Hostinger / Cloud deployments
import http from 'http';

console.log('>>> [LEVIX] Root server.js initializing on Node.js:', process.version);
console.log('>>> [LEVIX] Working directory:', process.cwd());
console.log('>>> [LEVIX] Hostinger PORT:', process.env.PORT);
console.log('>>> [LEVIX] Hostinger NODE_ENV:', process.env.NODE_ENV);

process.on('unhandledRejection', (reason) => {
  console.error('>>> [LEVIX] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('>>> [LEVIX] Uncaught Exception:', err);
});

try {
  await import('./backend/dist/server.js');
  console.log('>>> [LEVIX] Backend server initialized and active.');
} catch (err) {
  console.error('>>> [LEVIX] Critical error importing backend module:', err);
  
  // Emergency fallback server so Hostinger never returns 503
  const emergencyPort = Number(process.env.PORT) || 3000;
  const emergencyServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>LEVIX Store Initializing</h1><p>The store is booting up. Please refresh shortly.</p>');
  });
  emergencyServer.listen(emergencyPort, '0.0.0.0', () => {
    console.log(`>>> [LEVIX] Emergency responder active on port ${emergencyPort}`);
  });
}

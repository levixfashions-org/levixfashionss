// Root entry point for Hostinger / Cloud deployments
process.on('unhandledRejection', (reason) => {
  console.warn('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

import './backend/dist/server.js';

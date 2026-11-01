module.exports = {
  apps: [
    {
      name: 'levix-backend',
      script: 'dist/server.js',
      cwd: '/var/www/levix/backend',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/var/log/levix/backend-error.log',
      out_file: '/var/log/levix/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000
    }
  ]
};

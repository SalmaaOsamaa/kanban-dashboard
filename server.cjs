const { spawn } = require('child_process');
const path = require('path');

const port = process.env.PORT || 10000;
const bin = path.join(__dirname, 'node_modules', '.bin', 'json-server');

const server = spawn(bin, [
  'db.json',
  '--static', './dist',
  '--port', String(port),
  '--host', '0.0.0.0',
], {
  stdio: 'inherit',
  cwd: __dirname,
});

server.on('exit', (code) => process.exit(code ?? 1));

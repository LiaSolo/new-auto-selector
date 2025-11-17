// server.js
//import { create, router, defaults, bodyParser } from 'json-server';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { watch } from 'chokidar';
import jsonServer from 'json-server';

const app = jsonServer.create();
const myRouter = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
app.use(middlewares);
app.use(jsonServer.bodyParser);

// app.use(middlewares);
// app.use(bodyParser);

// Важно: вешаем перехват до myRouter, чтобы сработал res.on('finish')
app.use((req, res, next) => {
  res.on('finish', () => {
    const methodChanged = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    if (!methodChanged) return;

    // Шлем только при изменениях ресурса "semi" (уточните под свой путь)
    if (/\/api\/semi(\/|$|\?)/.test(req.originalUrl || req.url)) {
      broadcastSemi();
    }
  });
  next();
});

// REST-роутер на /api
app.use('/api', myRouter);

const server = createServer(app);

// WebSocket на /ws
const wss = new WebSocketServer({ server, path: '/ws' });

function send(ws, type, payload) {
  try { ws.send(JSON.stringify({ type, payload })); } catch {}
}

function broadcast(type, payload) {
  const msg = JSON.stringify({ type, payload });
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(msg);
  }
}

function getSemi() {
  // Если semi — объект в корне db.json
  const state = myRouter.db.getState();
  return state.semi; // адаптируйте под вашу структуру
}

function broadcastSemi() {
  broadcast('snapshot', getSemi());
}

wss.on('connection', (ws) => {
  // При подключении отдаем текущее состояние
  send(ws, 'snapshot', getSemi());
});

// Если db.json меняют руками — тоже шлем обновление
watch('db.json', { ignoreInitial: true }).on('change', () => {
  broadcastSemi();
});

const PORT = 3003 //process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`REST  http://localhost:${PORT}/api`);
  console.log(`WS    ws://localhost:${PORT}/ws`);
});
import express from 'express';
import fs from 'fs';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';


const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());


app.get('/api/:type', (req, res) => {
    const { type } = req.params;

    try {
        const data = JSON.parse(fs.readFileSync(`./json/${type}.json`, 'utf8'));
        res.json(data);
    } catch (error) {
        res.json({ 
            status: 'error', 
            message: error.message,
        });
    }
});

app.post('/api/:type', (req, res) => {
    const { type } = req.params;

    try {
        const newData = req.body;
        fs.writeFileSync(`./json/${type}.json`, JSON.stringify(newData, null, 2), 'utf8');
        
        if (type === 'release') {
            const newReleased = newData.released && [
                ...newData.released, 
                ...Array(newData.queue.length - newData.released.length).fill(null)
            ];

            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({ 
                        type: 'data-updated', 
                        data: newReleased || [], 
                    }));
                }
            });
        }
    
        res.json({ status: 'ok' });
      } catch (error) {
          res.json({ 
              status: 'error', 
              message: error.message,
          });
      }
});

// app.get('/api/settings', (req, res) => {
//   const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
//   res.json(data);
// });

// app.post('/api/settings', (req, res) => {
//   const newData = req.body;
//   fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newData, null, 2), 'utf8');  
//   res.json({ status: 'ok' });
// });

// app.get('/api/data', (req, res) => {
//   const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
//   res.json(data);
// });

// app.post('/api/data', (req, res) => {
//   const newData = req.body;
//   fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');
//   res.json({ status: 'ok' });
// });

// app.get('/api/release', (req, res) => {
//   const data = JSON.parse(fs.readFileSync(RELEASE_FILE, 'utf8'));
//   res.json(data);
// });

// app.post('/api/release', (req, res) => {
//   const newData = req.body;
//   fs.writeFileSync(RELEASE_FILE, JSON.stringify(newData, null, 2), 'utf8');
  
//   // Уведомляем всех WebSocket клиентов
//   wss.clients.forEach(client => {
//     if (client.readyState === 1) {
//       client.send(JSON.stringify({ 
//         type: 'data-updated', 
//         data: newData 
//       }));
//     }
//   });
  
//   res.json({ status: 'ok' });
// });

server.listen(3003, () => {
  console.log('Сервер запущен на порту 3003');
});
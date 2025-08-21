// server/index.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// --- CORS: normaliza y permite orígenes esperados ---
function normalize(origin) {
  return origin ? origin.replace(/\/+$/, '') : origin; // quita slash final
}

const ENV_ORIGIN = normalize(process.env.CORS_ORIGIN); // p.ej. https://tuapp.vercel.app
const allowedOrigins = [
  ENV_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // permitir tools sin origin (curl/health) y orígenes permitidos
    if (!origin) return cb(null, true);
    const clean = normalize(origin);
    if (allowedOrigins.includes(clean)) return cb(null, true);
    return cb(new Error(`CORS bloqueado para ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors(corsOptions)); // preflight

// --- Socket.IO con mismo CORS ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Rutas
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Sockets
require('./sockets')(io);

// Healthcheck (útil en Render)
app.get('/health', (_, res) => res.json({ ok: true }));

// Server
const PORT = process.env.PORT || 3000; // NO fijes PORT en Render
server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log('CORS permitido para:', allowedOrigins);
});

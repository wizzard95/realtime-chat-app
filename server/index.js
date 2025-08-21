const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// ✅ Configuración de CORS unificada
const allowedOrigin = process.env.CORS_ORIGIN || "https://realtime-chat-app-omega-tan.vercel.app/";

app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Socket.IO con CORS correcto
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Conexión MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ MongoDB error:', err));

// ✅ Rutas
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// ✅ Socket.IO lógica
require('./sockets')(io);

// ✅ Server listening
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

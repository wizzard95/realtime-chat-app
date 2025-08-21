// server/sockets.js
const Message = require('./models/Message');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('📡 Nuevo cliente conectado');

     socket.on('getRooms', () => {
    const rooms = Array.from(io.sockets.adapter.rooms.entries())
      .filter(([name, clients]) => !clients.has(name)) // evitar salas internas
      .map(([name]) => name);

    socket.emit('roomList', rooms);
  });


    socket.on('joinRoom', async ({ username, room }) => {
      socket.join(room);

      // Obtener historial desde la base de datos
      const history = await Message.find({ room }).sort({ createdAt: 1 });
      socket.emit('chatHistory', history);
    });

    socket.on('chatMessage', async ({ room, username, content }) => {
      const message = new Message({ username, content, room });
      await message.save();

      io.to(room).emit('message', {
        username,
        content,
        timestamp: new Date()
      });
    });

    // Emitir lista de salas activas
socket.on('getRooms', () => {
  const rooms = Array.from(io.sockets.adapter.rooms.entries())
    .filter(([roomName, clients]) => !clients.has(roomName)) // ignorar sockets individuales
    .map(([roomName]) => roomName);

  socket.emit('roomList', rooms);
});

    socket.on('disconnect', () => {
      console.log('🔌 Cliente desconectado');
    });
  });
};

const Message = require('./models/Message');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('📡 Nuevo cliente conectado');

    // Obtener lista de salas activas
    socket.on('getRooms', () => {
      const rooms = Array.from(io.sockets.adapter.rooms.entries())
        .filter(([roomName, clients]) => !clients.has(roomName)) // ignorar sockets internos
        .map(([roomName]) => roomName);

      socket.emit('roomList', rooms);
    });

    // Unirse a sala y enviar historial
    socket.on('joinRoom', async ({ username, room }) => {
      socket.join(room);

      const history = await Message.find({ room }).sort({ createdAt: 1 });
      socket.emit('chatHistory', history);
    });

    // Enviar mensaje
    socket.on('chatMessage', async ({ room, username, content }) => {
      const message = new Message({ username, content, room });
      await message.save();

      io.to(room).emit('message', {
        username,
        content,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('🔌 Cliente desconectado');
    });
  });
};
 
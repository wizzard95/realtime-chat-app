// client/src/App.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import MainLayout from './components/MainLayout';

// 👇 usamos la URL del backend desde .env
const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
});

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    if (!joined) {
      socket.emit('getRooms');
      socket.on('roomList', (rooms) => {
        setAvailableRooms(rooms);
      });
    }

    return () => {
      socket.off('roomList');
    };
  }, [joined]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username.trim() || !room.trim()) return;

    socket.connect();
    socket.emit('joinRoom', { username, room });
    setJoined(true);
  };

  const joinFromCard = (selectedRoom) => {
    if (!username.trim()) {
      alert('Primero debes ingresar un nombre de usuario.');
      return;
    }

    socket.connect();
    socket.emit('joinRoom', { username, room: selectedRoom });
    setRoom(selectedRoom);
    setJoined(true);
  };

  if (!joined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-900 text-white p-6">
        <div className="bg-blue-800 p-8 rounded shadow-md w-full max-w-xl space-y-6">
          <h2 className="text-2xl font-bold mb-4">Bienvenido al Chat</h2>

          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded text-black"
              required
            />
            <input
              type="text"
              placeholder="Contraseña cualquiera solo es un acceso"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-2 rounded text-black"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Unirse
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-blue-900 text-white">
      <MainLayout socket={socket} username={username} room={room} />
    </div>
  );
}

export default App;

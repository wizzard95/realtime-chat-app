// client/src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';

const Sidebar = ({ onSelectRoom, onSetUsername, socket }) => {
  const [inputUsername, setInputUsername] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [rooms, setRooms] = useState([]);

  // Pedir salas activas al conectar y cada 5s
  useEffect(() => {
    const fetchRooms = () => {
      socket.emit('getRooms');
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000); // 🔄 actualización automática

    socket.on('roomList', (roomList) => {
      setRooms(roomList);
    });

    return () => {
      clearInterval(interval);
      socket.off('roomList');
    };
  }, [socket]);

  const handleCreateOrJoin = (e) => {
    e.preventDefault();
    if (!inputUsername || !newRoom) return;

    onSetUsername(inputUsername);
    onSelectRoom(newRoom);

    socket.connect();
    socket.emit('joinRoom', { username: inputUsername, room: newRoom });
  };

  const handleRoomClick = (roomName) => {
    if (!inputUsername) {
      alert('Primero debes ingresar tu nombre de usuario');
      return;
    }

    onSetUsername(inputUsername);
    onSelectRoom(roomName);

    socket.connect();
    socket.emit('joinRoom', { username: inputUsername, room: roomName });
  };

  return (
    <div className="p-4 h-full flex flex-col justify-between text-white">
      <div>
        <h2 className="text-xl font-bold mb-4">Unirse al Chat</h2>
        <form onSubmit={handleCreateOrJoin} className="space-y-3">
          <input
            type="text"
            placeholder="Tu nombre de usuario"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
          <input
            type="text"
            placeholder="Crear sala"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
          <button
            type="submit"
            className="w-full bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Crear / Unirse
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Salas disponibles:</h3>
          <div className="flex flex-col gap-2">
            {rooms.length > 0 ? (
              rooms.map((room, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRoomClick(room)}
                  className="bg-blue-700 hover:bg-blue-600 p-2 rounded text-left shadow-md transition"
                >
                  {room}
                </button>
              ))
            ) : (
              <p className="text-sm text-blue-300">No hay salas activas aún.</p>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-blue-300 mt-6">
        {inputUsername && <span>Usuario actual: {inputUsername}</span>}
      </div>
    </div>
  );
};

export default Sidebar;


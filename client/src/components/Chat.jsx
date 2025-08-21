import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';
import '../index.css';

const Chat = ({ username, room }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef();

  // Scroll automático al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejo de conexión y eventos de socket
  useEffect(() => {
    if (!room || !username) return;

    socket.emit('joinRoom', { username, room });

    const handleHistory = (history) => {
      setMessages(prev => {
        const all = [...history, ...prev];
        const unique = removeDuplicatesById(all);
        return sortByTimestamp(unique);
      });
    };

    const handleMessage = (msg) => {
      setMessages(prev => {
        const updated = [...prev, msg];
        const unique = removeDuplicatesById(updated);
        return sortByTimestamp(unique);
      });
    };

    socket.on('chatHistory', handleHistory);
    socket.on('message', handleMessage);

    return () => {
      socket.off('chatHistory', handleHistory);
      socket.off('message', handleMessage);
    };
  }, [room, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit('chatMessage', {
      username,
      room,
      content: message
    });

    setMessage('');
  };

  // 👉 Elimina duplicados por _id
  const removeDuplicatesById = (msgs) => {
    const seen = new Set();
    return msgs.filter(msg => {
      const id = msg._id || `${msg.username}-${msg.content}-${msg.timestamp}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  // 👉 Ordena por fecha
  const sortByTimestamp = (msgs) => {
    return msgs.sort((a, b) => new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp));
  };

  return (
    <div className="flex flex-col h-full p-4 text-white overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded text-sm ${
              msg.username === username
                ? 'bg-blue-600/60 text-right ml-auto max-w-[75%]'
                : 'bg-blue-800/30 text-left mr-auto max-w-[75%]'
            }`}
          >
            <div className="text-blue-300 font-semibold">{msg.username}</div>
            <div>{msg.content}</div>
            <div className="text-xs text-blue-400 mt-1">
              {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 rounded bg-[#1e2d40] border border-blue-800 focus:outline-none"
        />
        <button type="submit" className="p-2 bg-blue-600 rounded hover:bg-blue-500">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;


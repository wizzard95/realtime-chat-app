// client/src/components/PanelExtra.jsx
import React from 'react';

const PanelExtra = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-[#2a4873] border-b border-blue-800 font-bold">
        📦 Panel Extra
      </div>
      <div className="p-4 text-blue-100 text-sm overflow-auto flex-1">
        <ul className="list-disc ml-5 space-y-1">
          <li>Stats del chat</li>
          <li>Últimos mensajes</li>
          <li>Usuarios activos</li>
          <li>Notificaciones</li>
        </ul>
      </div>
    </div>
  );
};

export default PanelExtra;

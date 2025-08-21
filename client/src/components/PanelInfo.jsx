// client/src/components/PanelInfo.jsx
import React from 'react';

const PanelInfo = ({ room, username }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-[#264066] border-b border-blue-900 font-bold">
        🔧 Panel de Info
      </div>
      <div className="p-4 text-blue-100 text-sm overflow-auto flex-1 space-y-3">
        <p><span className="text-blue-300">Usuario:</span> {username || '—'}</p>
        <p><span className="text-blue-300">Sala actual:</span> {room || '—'}</p>
        <hr className="border-blue-700" />
        <p className="text-blue-400">Aquí podrías:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Ver usuarios conectados</li>
          <li>Administrar tu cuenta</li>
          <li>Ver archivos multimedia</li>
          <li>Control de moderación</li>
        </ul>
      </div>
    </div>
  );
};

export default PanelInfo;


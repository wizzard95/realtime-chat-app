
// client/src/components/MainLayout.jsx
import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Sidebar from './Sidebar';
import Chat from './Chat';
import PanelInfo from './PanelInfo';
import PanelExtra from './PanelExtra';


import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../index.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const MainLayout = ({ socket }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const layouts = {
    lg: [
      { i: 'sidebar', x: 0, y: 0, w: 3, h: 2 },
      { i: 'chat', x: 3, y: 0, w: 6, h: 2 },
      { i: 'info', x: 9, y: 0, w: 3, h: 1 },
      { i: 'extra', x: 9, y: 1, w: 3, h: 1 },
    ],
  };

  return (
    <div className="grid-container">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 12 }}
        rowHeight={350}
        width={window.innerWidth}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        isDraggable
        isResizable={false}
        autoSize={false}
        useCSSTransforms
        compactType="horizontal"
        preventCollision
      >
        <div key="sidebar" className="grid-box bg-[#1f334a]">
          <Sidebar
            onSelectRoom={setRoom}
            onSetUsername={setUsername}
            socket={socket}
          />
        </div>

        <div key="chat" className="grid-box bg-[#213b54]">
          {room && username ? (
            <Chat key={`${room}-${username}`} room={room} username={username} />
          ) : (
            <div className="flex items-center justify-center h-full text-blue-200 text-center p-6">
              Ingresa un nombre y elige una sala
            </div>
          )}
        </div>

        <div key="info" className="grid-box bg-[#244160]">
          <PanelInfo room={room} username={username} />
        </div>

        <div key="extra" className="grid-box bg-[#264b6c]">
          <PanelExtra />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default MainLayout;

 DESCRIPCIÓN GENERAL

Este proyecto implementa una aplicación de chat en tiempo real utilizando **React** en el frontend y **Node.js + Express + Socket.IO** en el backend, con **MongoDB** como base de datos. La aplicación permite a los usuarios crear salas de chat, unirse a ellas y comunicarse en tiempo real.

## 🏗️ ARQUITECTURA DEL SISTEMA

### Estructura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (React)                         │
├─────────────────────────────────────────────────────────────┤
│  App.jsx → MainLayout.jsx → [Sidebar, Chat, PanelInfo,    │
│  PanelExtra]                                               │
├─────────────────────────────────────────────────────────────┤
│                    SOCKET.IO CLIENT                        │
├─────────────────────────────────────────────────────────────┤
│                    SERVIDOR (Node.js)                      │
├─────────────────────────────────────────────────────────────┤
│  Express + Socket.IO + MongoDB                            │
└─────────────────────────────────────────────────────────────┘
```

### Tecnologías Utilizadas

#### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web para API REST
- **Socket.IO**: Comunicación en tiempo real
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación de usuarios
- **bcryptjs**: Hash de contraseñas
- **CORS**: Política de orígenes cruzados

#### Frontend
- **React 19**: Biblioteca de interfaz de usuario
- **Vite**: Herramienta de build y desarrollo
- **Tailwind CSS**: Framework de CSS utilitario
- **Socket.IO Client**: Cliente para comunicación en tiempo real
- **react-grid-layout**: Sistema de layout responsive

## 🔄 FLUJO GENERAL DE LA APLICACIÓN

### 1. Inicialización del Sistema

```
1. Usuario accede a la aplicación
2. Se muestra pantalla de login/registro
3. Usuario ingresa nombre y sala (o selecciona existente)
4. Se establece conexión con Socket.IO
5. Usuario se une a la sala seleccionada
```

### 2. Flujo de Autenticación

```
1. Usuario envía credenciales (username + password)
2. Servidor valida datos de entrada
3. Se hashea la contraseña con bcrypt
4. Se genera token JWT válido por 7 días
5. Se retorna token y username al cliente
6. Cliente almacena token para futuras peticiones
```

### 3. Flujo de Chat en Tiempo Real

```
1. Usuario se une a una sala
2. Servidor envía historial de mensajes de la sala
3. Usuario puede enviar mensajes
4. Mensaje se persiste en MongoDB
5. Servidor reenvía mensaje a todos los usuarios en la sala
6. Clientes reciben mensaje y actualizan interfaz
```

### 4. Gestión de Salas

```
1. Cliente solicita lista de salas activas
2. Servidor filtra salas internas de Socket.IO
3. Se retorna lista de salas disponibles
4. Usuario puede unirse a sala existente o crear nueva
5. Lista se actualiza automáticamente cada 5 segundos
```

## 📁 ESTRUCTURA DE ARCHIVOS

### Backend (`/server`)

```
server/
├── index.js              # Punto de entrada del servidor
├── config/
│   └── db.js            # Configuración de MongoDB
├── controllers/
│   └── auth.controllers.js  # Lógica de autenticación
├── models/
│   └── Message.js       # Esquema de mensajes
├── routes/
│   └── auth.routes.js   # Rutas de autenticación
├── sockets.js            # Lógica de Socket.IO
└── upload.js             # Sistema de subida de archivos
```

### Frontend (`/client`)

```
client/
├── src/
│   ├── main.jsx         # Punto de entrada de React
│   ├── App.jsx          # Componente principal
│   ├── socket.js        # Configuración de Socket.IO
│   ├── index.css        # Estilos globales
│   └── components/
│       ├── MainLayout.jsx   # Layout principal
│       ├── Sidebar.jsx      # Panel lateral
│       ├── Chat.jsx         # Componente de chat
│       ├── PanelInfo.jsx    # Panel de información
│       └── PanelExtra.jsx   # Panel de funcionalidades extra
├── package.json          # Dependencias del cliente
└── vite.config.js        # Configuración de Vite
```

## 🔌 COMUNICACIÓN SOCKET.IO

### Eventos del Cliente al Servidor

| Evento | Descripción | Parámetros |
|--------|-------------|------------|
| `getRooms` | Solicita lista de salas activas | Ninguno |
| `joinRoom` | Une usuario a sala específica | `{username, room}` |
| `chatMessage` | Envía mensaje a sala | `{room, username, content}` |

### Eventos del Servidor al Cliente

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `roomList` | Lista de salas disponibles | `Array<string>` |
| `chatHistory` | Historial de mensajes de sala | `Array<Message>` |
| `message` | Nuevo mensaje recibido | `{username, content, timestamp}` |


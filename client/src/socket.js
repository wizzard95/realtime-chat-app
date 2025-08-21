import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // ajusta si usas .env

export default socket;

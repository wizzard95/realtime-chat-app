// server/controllers/auth.controller.js

// * ESTO SE CONECTA CON MONGO DB
// esto se conecta con el .evnv

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/* const User = require('../models/User'); */

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET no definido en .env');
}

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ msg: 'Usuario y contraseña requeridos' });
  }

  try {
    const existing = await User.findOne({ username });

    if (existing) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(201).json({ token, username: user.username });
  } catch (err) {
    console.error('[Register Error]', err);
    return res.status(500).json({ msg: 'Error en registro', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ msg: 'Usuario y contraseña requeridos' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({ token, username: user.username });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(500).json({ msg: 'Error en login', error: err.message });
  }
};



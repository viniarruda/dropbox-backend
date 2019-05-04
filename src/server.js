const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('connectRoom', box => {
    socket.join(box);
  })
});

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-5kmyl.mongodb.net/omnistack?retryWrites=true', {
  useNewUrlParser: true,
});

// Toda rota agora vai ter a variável io
app.use((req, res, next) => {
  req.io = io;

  // Processa o middleware e passa pra proxima requisição
  return next();
});

// Modules / Middlewares
app.use(express.json());
// Send files to api
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

// Choose port
server.listen(process.env.PORT || 3333);
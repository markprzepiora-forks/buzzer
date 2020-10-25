const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

const title = 'Buffer Buzzer'

let data = {
  users: new Set(),
  buzzes: new Set(),
  buzzedUsers: new Set(),
  open: false,
}

const getData = () => ({
  users: [...data.users],
  buzzes: [...data.buzzes].map(name => {
    return { name: name, team: 'N/A' };
  }),
  open: data.open,
})

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index', { title }))
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())))

io.on('connection', (socket) => {
  socket.on('join', (user) => {
    data.users.add(user.id)
    io.emit('active', [...data.users].length)
    console.log(`${user.name} joined!`)
  })

  socket.on('buzz', (user) => {
    let alreadyBuzzed = data.buzzedUsers.has(user.id);
    let isOpen = data.open;

    data.buzzedUsers.add(user.id);

    if (!alreadyBuzzed && isOpen) {
      data.buzzes.add(user.name);
    }

    io.emit('buzzes', [...data.buzzes]);
    console.log(`${user.name} buzzed in!`);
  })

  socket.on('open', () => {
    data.buzzes = new Set();
    data.open = true;

    io.emit('buzzes', [...data.buzzes]);
    io.emit('opened');
    console.log(`Buzzer opened`);
  });

  socket.on('close', () => {
    data.buzzes = new Set();
    data.buzzedUsers = new Set();
    data.open = false;

    io.emit('buzzes', [...data.buzzes]);
    io.emit('closed');
    console.log(`Buzzer closed`);
  });

})

server.listen(8090, () => console.log('Listening on 8090'))

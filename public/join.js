const socket = io()
const body = document.querySelector('.js-body')
const form = document.querySelector('.js-join')
const joined = document.querySelector('.js-joined')
const buzzer = document.querySelector('.js-buzzer')
const joinedInfo = document.querySelector('.js-joined-info')
const editInfo = document.querySelector('.js-edit')

let user = {}

const getUserInfo = () => {
  user = JSON.parse(localStorage.getItem('user')) || {}
  if (user.name) {
    form.querySelector('[name=name]').value = user.name
    form.querySelector('[name=team]').value = user.team
  }
}
const saveUserInfo = () => {
  localStorage.setItem('user', JSON.stringify(user))
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  user.name = form.querySelector('[name=name]').value
  user.team = form.querySelector('[name=team]').value
  if (!user.id) {
    user.id = Math.floor(Math.random() * new Date())
  }
  socket.emit('join', user)
  saveUserInfo()
  joinedInfo.innerText = `${user.name}`
  form.classList.add('hidden')
  joined.classList.remove('hidden')
  body.classList.add('buzzer-mode')
})

buzzer.addEventListener('click', (e) => {
  socket.emit('buzz', user);
  buzzer.disabled = true;

  if (buzzer.classList.contains('buzzer-open')) {
    buzzer.innerText = "Buzzed in";
  } else {
    buzzer.innerText = "Buzzed in too early";
  }
})

editInfo.addEventListener('click', () => {
  joined.classList.add('hidden')
  form.classList.remove('hidden')
  body.classList.remove('buzzer-mode')
})

socket.on('opened', () => {
  buzzer.classList.remove('buzzer-closed');
  buzzer.classList.add('buzzer-open');
  buzzer.innerText = "BUZZ";
});

socket.on('closed', () => {
  buzzer.classList.add('buzzer-closed');
  buzzer.classList.remove('buzzer-open');
  buzzer.innerText = "Don't buzz in yet";
  buzzer.disabled = false;
});

getUserInfo()

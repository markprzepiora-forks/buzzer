/* global io */

const socket = io();
const active = document.querySelector(".js-active");
const buzzList = document.querySelector(".js-buzzes");
const openButton = document.querySelector(".js-open");
const closeButton = document.querySelector(".js-close");

socket.on("active", (numberActive) => {
  active.innerText = `${numberActive} joined`;
});

socket.on("buzzes", (buzzes) => {
  buzzList.innerHTML = buzzes
    .map((name) => ({ name, team: "N/A" }))
    .map((user) => `<li>${user.name}</li>`)
    .join("");
});

openButton.addEventListener("click", () => {
  socket.emit("open");
});

closeButton.addEventListener("click", () => {
  socket.emit("close");
});

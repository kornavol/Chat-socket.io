const socket = io();

const clickHandler = (e) => {
    const msg = document.querySelector("#msg-box").value;
    socket.emit("chat message", msg);
};

socket.emit("token", sessionStorage.getItem("token"));

socket.on("ticket", (ticket) => {
    console.log(ticket);
    document
    .querySelector("#chat-box")
    .insertAdjacentHTML("beforeend", `<li> Welcome on board ${ticket.nickName} </li>`);
    sessionStorage.setItem("token", ticket.token);
});


socket.on("chat msg", (msg) => {
    // let nick = sessionStorage.getItem('nick')
    document
    .querySelector("#chat-box")
    .insertAdjacentHTML("beforeend", `<li> ${msg} </li>`);
});
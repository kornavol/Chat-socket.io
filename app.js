const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken')

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 8080;

const jwtKey = 'KLJhoasda(*%^9wqel1'

/* To initilize statick page.
    Both ways are secure but the stcond one more secure
*/
// app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "publick/index.html");
// });

io.on("connection", (socket) => {

    function ticketHandler(nickName) {

        if (!nickName) {
            nickName = "Guest" + Date.now();
        }

        const token = jwt.sign({ nickName }, jwtKey, { expiresIn: "1d" })
        const tiket = {token, nickName }
        return tiket
    }

    console.log("a user connected!");

    socket.on("token", (token) => {
        if (token) {
            try {
                jwt.verify(token, jwtKey, function (fail, decoded) {

                    if (fail) {
                        socket.emit('ticket', ticketHandler());
                        
                        console.log('fail', fail);
                    } else {
                        socket.emit("ticket", ticketHandler(decoded.nickName));

                        console.log(decoded.nickName + "conected");
                        console.log('token', token);
                    }
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            socket.emit('ticket', ticketHandler());
        }
    });

    socket.on("chat message", (message) => {
        console.log(message);
        io.emit("chat msg", message);
    });

    socket.on("disconnect", () => {
        console.log("a user disconnected!");
    });
});

server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

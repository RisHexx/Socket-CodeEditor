const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const Actions = require("./Actions");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

function getAllClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on(Actions.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllClients(roomId);

    
    clients.forEach(({socketId}) => { 
        io.to(socketId).emit(Actions.JOINED , {
            clients,
            username,
            socketId : socket.id
        })
    })

  });

    socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit(Actions.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
});


  socket.on(Actions.CODE_CHANGE, ({ roomId, code }) => {
    // socket.in(roomId).emit(Actions.CODE_CHANGE, { code });
    io.in(roomId).emit(Actions.CODE_CHANGE, { code });
  });

  socket.on(Actions.SYNC_CODE, ({ code, socketId }) => {
    io.to(socketId).emit(Actions.CODE_CHANGE, { code });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})


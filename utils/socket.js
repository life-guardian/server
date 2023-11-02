const { Server } = require("socket.io");

const socketIO = (server)=>{
    const io = new Server(server);

    io.on("connection", (socket)=>{
    console.log("A user is connected "+ socket.id);


    socket.on("disconnect", ()=>{
        console.log('user disconnected '+  socket.id);
    })
  });
}

module.exports = socketIO;
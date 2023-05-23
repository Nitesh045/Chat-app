//const exp = require('constants');
const exp = require('constants');
const express = require('express');
const path = require('path');
//const  Socket  = require('socket.io');
const app = express();
const port = 4000;
const server = app.listen(port,()=>{
    console.log(`server listen at port${port}`);
});

//app.use(express.static(path.join(__dirname,'public')));



const io = require('socket.io')(server);


app.use(express.static(path.join(__dirname,'public')));
let socketSConnected = new Set();

io.on('connect',onConnected);


function onConnected(socket){
    console.log("new socket connect",socket.id)
    socketSConnected.add(socket.id)
    io.emit('clients-total',socketSConnected.size);

    socket.on('disconnect',()=>{
      console.log("new socket disconnect",socket.id);
      socketSConnected.delete(socket);
      io.emit('clients-total',socketSConnected.size);

    });
    socket.on('message',(data)=>{
        socket.broadcast.emit('chat-message',data);
    });
    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data);
    });
}


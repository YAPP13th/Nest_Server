const socket_io = require('socket.io');
const io = socket_io();
const socket = {};
const pg = require('pg');
const env = require('../config/postgresql/env');
const find_Room = require('../model/messageQuery/findRoom');
const new_Message = require('../model/messageQuery/newMessage');

const fonniePool = new pg.Pool(env.fonnieConfig);

socket.io = io;

io.on('connection', (socket) => {

  socket.on('find room', (user1, user2) =>{
    //접속 후 두 사용자의 방을 찾는 소켓통신
    let findRoom ={
      'success' : true,
      'room_Num' : 0,
      'entered' : [],
      'message' : [],
      'status' : []
    };

    //방을 찾기 위해 데이터베이스 접근
    fonniePool.connect((err, client, done) => {
      // Handle connection errors
      if(err) {
        done();
        findRoom.success = false;
        findRoom.status.push({'err' : err});
        socket.emit('join room', findRoom);
        //데이터베이스 연결 실패
      }

      let check = find_Room.findRoom(client, user1, user2);

      check.then(function(result){
        done();
        socket.emit('join room', result);
        //방찾기 성공

      }).catch(function(err){
        done();
        findRoom.success = false;
        findRoom.status.push({'err' : err});
        socket.emit('join room', findRoom);
        //방찾기 실패

      });

    });

  });

  socket.on('new message', (room_id, entered, content, image) => {

    let messageDone ={
      'success' : true,
      'entered' : [],
      'message' : [],
      'status' : []
    };
    //메시지 저장을 위해 데이터베이스 접근
    fonniePool.connect((err, client, done) => {
      // Handle connection errors
      if(err) {
        done();
        messageDone.success = false;
        messageDone.status.push({'err' : err});
        socket.emit('new message', messageDone);
        //데이터베이스 연결 실패
      }

      let check = new_Message.newMessage(client, room_id, entered, content, image);

      check.then(function(result){
        done();
        socket.emit('new message', result);
        socket.broadcast.emit('new message', result);
        //메시지 저장 성공

      }).catch(function(err){
        done();
        messageDone.success = false;
        messageDone.status.push({'err' : err});
        socket.emit('new message', messageDone);
        //메시지 저장 실패

      });

    });

  });

});

module.exports = socket;

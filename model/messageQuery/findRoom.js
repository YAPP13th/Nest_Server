exports.findRoom = function(client, user1, user2){
  return new Promise((resolve, reject) => {

    let findRoom ={
      'success' : true,
      'room_Num' : 0,
      'entered' : [],
      'message' : [],
      'status' : []
    };

    //대화하는 사용자 2명을 입력받아 방이 존재하는가 확인
    client.query('SELECT * FROM room_info WHERE ((participant_1 = ($1) or participant_1 = ($2)) and (participant_2 = ($3) or participant_2 = ($4)))',
    [user1, user2, user1, user2], function(err, result){

      if(err){
        //방 존재 쿼리 실패
        findRoom.success = false;
        findRoom.status.push({'err' : err});
        return reject(findRoom);

      }else{
        //방 존재 쿼리 성공
        if(result.rows.length < 1){
          //방이 존재하지 않을 시 입력받은 두 사용자의 방을 만듦
          client.query('INSERT INTO room_info(participant_1, participant_2) values(($1), ($2)) RETURNING *',
          [user1, user2], function(err, result){
            if(err){
              //방 만들기 실패
              findRoom.success = false;
              findRoom.status.push({'err' : err});
              return reject(findRoom);

            }else{
              //방 만들기 성공, 새로 만들었으니 메시지는 없을테고 방 번호만 리턴
              findRoom.room_Num = result.rows.room_id;
              findRoom.status.push({'status' : 'Success'});
              return resolve(findRoom);

            }

          });
        }else{
          //방이 존재, 찾은 방의 번호를 저장
          findRoom.room_Num = result.rows[0].room_id;
          //찾은 방의 번호를 이용하여 방에 존재하는 모든 메시지를 불러옴
          client.query('SELECT * FROM message_info WHERE room_id = ($1)', [findRoom.room_Num],
          function(err, result){

            if(err){
              //메시지 불러오기 실패
              findRoom.success = false;
              findRoom.status.push({'err' : err});
              return reject(findRoom);

            }else{
              //성공시 모든 메시지를 저장 후 리턴
              for(var i = 0; i < result.rows.length; i++){
                findRoom.entered.push({'entered' : result.rows[i].entered});
                findRoom.message.push({'content' : result.rows[i].content});
              }
              findRoom.status.push({'status' : 'Success'});
              return resolve(findRoom);

            }

          });

        }

      }
    });

 });
}

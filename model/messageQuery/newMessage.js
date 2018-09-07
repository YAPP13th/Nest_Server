exports.newMessage = function(client, room_id, entered, content, image){
  return new Promise((resolve, reject) => {

    let messageDone ={
      'success' : true,
      'entered' : [],
      'message' : [],
      'status' : []
    };

    //대화하는 사용자 2명을 입력받아 방이 존재하는가 확인
    client.query('INSERT INTO message_info(room_id, entered, content, image) values (($1), ($2), ($3), ($4))',
    [room_id, entered, content, image], function(err, result){

      if(err){
        //메시지 저장 실패
        messageDone.success = false;
        messageDone.status.push({'err' : err});
        return reject(messageDone);

      }else{
        //메시지 저장 성공
        messageDone.entered.push({'entered' : entered});
        messageDone.message.push({'content' : content});
        messageDone.status.push({'status' : 'Success'});
        return resolve(messageDone);
      }
    });

 });
}

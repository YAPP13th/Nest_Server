exports.sign_up = function(client, data){
  return new Promise((resolve, reject) => {

    var sign_upDone ={
      'success' : true,
      'status' : 0
    };

    client.query('INSERT INTO userInfo(id, now_date, name, gender, year, monthly, room, location, pattern, drink, smoking, allow_friend, pet, like, hate, introduce) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
     [data.id, data.now_date, data.name, data.gender, data.year, data.monthly, data.room, data.location, data.pattern, data.drink, data.smoking, data.allow_friend, data.pet, data.like, data.hate, data.introduce],
    function(err, result){
      if(err){
        sign_upDone.success = false;
        sign_upDone.status = 5000;
        return reject(sign_upDone);
      }else{
        sign_upDone.status = 1000;
        return resolve(sign_upDone);
      }
    });

 });
}

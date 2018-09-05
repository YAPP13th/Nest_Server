exports.check_user = function(client, data){
  return new Promise((resolve, reject) => {

    var loginDone ={
      'success' : true,
      'status' : 0
    };

    client.query('SELECT * FROM userInfo WHERE id = ($1)', [data.id],
    function(err, result){
      if(err){
        loginDone.success = false;
        loginDone.status = '5000';
        return reject(loginDone);
      }else{
        if(result.row.length > 0){
          
          client.query('UPDATE userInfo SET now_date = ($1) WHERE id = ($2)',
        [data.now_ndate, data.id], function(err, result){
          if(err){
            loginDone.success = false;
            loginDone.status = '5000';
            return reject(loginDone);
          }else{
            loginDone.status = '1000';
            return resolve(loginDone);
          }
        });

        }else{
          loginDone.status = '1001';
        }
        return resolve(loginDone);
      }
    });

 });
}

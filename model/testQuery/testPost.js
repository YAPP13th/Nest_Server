exports.testPost = function(client, data){
  return new Promise((resolve, reject) => {

    var testDone ={
      'success' : true,
      'status' : []
    };

    client.query('INSERT INTO test(name) values($1)', [data],
    function(err, result){
      if(err){
        testDone.success = false;
        testDone.status.push(err);
        return reject(testDone);
      }else{
        testDone.status.push('Success');
        return resolve(testDone);
      }
    });

 });
}

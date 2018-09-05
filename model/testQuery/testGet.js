exports.testGet = function(client){
  return new Promise((resolve, reject) => {

    var testDone ={
      'success' : true,
      'data' : [],
      'status' : []
    };

    client.query('SELECT * FROM test ORDER BY id ASC',
    function(err, result){
      if(err){
        testDone.success = false;
        testDone.status.push(err);
        return reject(testDone);
      }else{
        testDone.data = result.rows;
        // for(var i = 0; i < result.rows.length; i++){
        //   testDone.data.push(result.rows[i].data.toString());
        //   loadDone.image.type.push(result.rows[i].mine_type);
        //   loadDone.image.name.push(result.rows[i].name);
        //   loadDone.length++;
        // }
        testDone.status.push('Success');
        return resolve(testDone);
      }
    });

 });
}

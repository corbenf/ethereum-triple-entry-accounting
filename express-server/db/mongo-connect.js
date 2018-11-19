const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/protoCountingDB');

mongoose.connection.once('open', function(){
  console.log('MongoDB Connection open');
}).on('error', function(err){
  console.error('Something went wrong', err)
});
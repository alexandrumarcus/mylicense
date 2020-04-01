const express = require('express');
const app = express();
const path = require('path');
const port = process.env.port || 3000;

app.use(express.static('./src'))

app.get('/', function (rq, rs) {
  rs.sendFile(path.join(__dirname + 'src/index.html'));
})

app.listen(port, function(){
  console.log('Server is running..');
});
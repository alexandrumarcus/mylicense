/**
 * License Application
 */
const express = require('express')
const application = express()
const port = process.env.port || 3000;

application.use(express.static('./src'))

application.get('/', function (rq, rs) {
  rs.sendfile('./src/index.html')
})

application.listen(port, function(){
  console.log('Server is running..');
});
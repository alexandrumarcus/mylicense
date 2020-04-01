/**
 * License Application
 */

let express = require('express')
let application = express()
let router = express.Router()
const port = process.env.port || 5000;

application.use(express.static('src'))

application.get('/', function (rq, rs) {
  rs.sendfile('./src/index.html')
})

application.listen(port);
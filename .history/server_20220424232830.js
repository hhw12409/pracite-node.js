const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer( (req, res) => {
  if(pathname === "/") {
    fs.readdir('./data')
  }
})

app.listen(3000)
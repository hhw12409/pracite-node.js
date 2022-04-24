const express = require('express');
const app = express();

require('dotenv').config()

app.get('/')

app.listen(process.env.PORT , function(){
  console.log("listening on server");
});
const express = require('express');
const app = express();

require('dotenv').config()

app.get('/', (req, res)=> {

})

app.listen(process.env.PORT , function(){
  console.log("listening on server");
});
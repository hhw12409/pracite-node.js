const express = require('express');
const app = express();

app.set('view engine', 'ejs');

require('dotenv').config()

app.get('/', (req, res)=> {
  res.render('index.ejs', {})
})

app.get('/html', (req, res)=> {
  res.render('html.ejs', {})
})

app.listen(process.env.PORT , function(){
  console.log("listening on server");
});
const express = require('express');
const app = express();
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true } ,(err, client)=> {
  if(err) return console.log(err)
  db = client.db(process.env.Collection);

  app.listen(process.env.PORT , function(){
    console.log("listening on server");
  });
})

// css middleware연동
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

require('dotenv').config()

app.get('/', (req, res)=> {
  res.render('index.ejs', {})
})

app.get('/html', (req, res)=> {
  res.render('html.ejs', {})
})

app.get('/css', (req, res)=> {
  res.render('css.ejs', {})
})

app.get('/javascript', (req, res)=> {
  res.render('javascript.ejs', {})
})


const express = require('express');
const app = express();
require('dotenv').config()

app.use(express.urlencoded({extended: true})) 
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

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

app.get('/write', (req, res)=> {
  res.render('write.ejs', {})
})

app.post('/write', (req, res) => {
  res.redirect('/')
  db.collection('counter').findOne({name:'postCount'}, (err, result) => {
    console.log(req.body)
    let totalPostNum = result.totalPost
    const saveList = { _id:totalPostNum + 1, writer : req.user_id, title : req.body.title, content : req.body.content, name : req.body.name}
    db.collection('posts').insertOne(saveList, (err, result) => {
      console.log('post저장완료');
      db.collection('counter').updateOne({name:'postCount'},{ $inc : { totalPostNum : 1}}, (req, res)=> {
        if(err) {
          return console.log(err)
        }
      })
    })
  })
})



const express = require('express');
const app = express();
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

require('dotenv').config()

app.use(session({secret : process.env.SECRET_KEY, resave: true, saveUninitialized: false}))
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true})) 
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true } ,(err, client)=> {
  if(err) return console.log(err)
  db = client.db(process.env.COLLECTION);

  app.listen(process.env.PORT , function(){
    console.log("listening on server");
  });
})

app.get('/', (req, res)=> {
  res.render('index.ejs', {})
})

app.get('/write', (req, res)=> {
  res.render('write.ejs', {})
})

app.post('/write', (req, res) => {
  res.redirect('/')
  db.collection('counter').findOne({name:'postCount'}, (err, result) => {
    let totalPost = result.totalPost
    const saveList = { _id:totalPost + 1, title : req.body.title, content : req.body.content, name : req.body.name, date : req.body.date}
    db.collection('posts').insertOne(saveList, (err, result) => {
      console.log('post저장완료');
      db.collection('counter').updateOne({name:'postCount'},{ $inc : { totalPost : 1}}, (req, res)=> {
        if(err) {
          return console.log(err)
        }
      })
    })
  })
})

app.get('/list', (req, res) => {
  db.collection('posts').find().toArray(function(err, result) {
    console.log(result)
    res.render('list.ejs', { posts : result });
  });
});

app.get('/detail/:id', (req, res) => {
  db.collection('posts').findOne({_id : parseInt(req.params.id)}, (err, result)=> {
    res.render('detail.ejs', { data : result });
    if(result == null) {
      res.send('404 Not Found')
    }
  });
});

app.get('/edit/:id', (req, res) => {
  db.collection('posts').findOne({ _id : parseInt(req.params.id)}, (err ,result) => {
    res.render('edit.ejs', { data : result });
    if(result == null) {
      res.render('404 Not Found')
    }
  })
})

app.put('/edit', (req, res) => {
  db.collection('posts').updateOne({ _id : parseInt(req.body.id) }, { $set : { title : req.body.title, content : req.body.content, name : req.body.name, date : req.body.date } }, function(err, result){
    res.redirect('/list')
  });
});

app.delete('/delete', (req, res) => {
  const deleteDate = { _id : parseInt(req.body._id) }
  db.collection('posts').deleteOne(deleteDate, (err, result) => {
    if(err) {
      console.log(err)
    }
    res.status(200).send({ message : 'delete success'})
  })
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})
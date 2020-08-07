var express = require('express');
var mongoose = require('mongoose');
// var mongodb = require('mongodb');
// var router = express.Router();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(express.static(__dirname));
// var logger = require('morgan');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// var MongoClient = require('mongodb').MongoClient;
// var db;
// MongoClient.connect("mongodb://localhost:27017/integration_test", function(err, database) {
//   if(err) throw err;

//   db = database;

// //   Start the application after the database connection is ready
//   app.listen(3000);
//   console.log("Listening on port 3000");
// });

// Reuse database object in request handlers
// app.get("/", function(req, res) {
//     db.collection("replicaset_mongo_client_collection").find({}, function(err, docs) {
//       docs.each(function(err, doc) {
//         if(doc) {
//           console.log(doc);
//         }
//         else {
//           res.end();
//         }
//       });
//     });
//   });

// app.get('/messages', (req, res) => {
//     db.collection('user_data').find({},(err, messages)=> {
//         res.send(messages);
//     })
// })
//     // post
// app.post('/messages', (req, res) => {
//     // var message = new Message(req.body);
//     var item = {
//         name: req.body.name,
//         message: req.body.message
//     };
//     var message = db.collection('user_data').insertOne(item, function (err, result) {
//         assert.equal(null, err);
//         console.log('item has been inserted');
//         db.close;
//     })
//     // message.save((err) =>{
//     //     if(err)
//     //       sendStatus(500);
//     //     res.sendStatus(200);
//     // })
// })

var Message = mongoose.model('Messages', { name : String, message : String})

// const {MongoClient} = require('mongodb');
const uri = 'mongodb+srv://Vasudev_mongo:Never4Lose@cluster0.wbptd.mongodb.net/Messages?retryWrites=true&w=majority';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
// perform actions on the collection object
//   console.log('mongodb connectexs', err);
//   client.close();
// });

//mongo part - database


//Routing 
// get

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})
// post
app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    console.log("message emitted")
    res.sendStatus(200);
  })
})

io.on('connection', () =>{
    console.log('a user is connected')
})

mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, (err) => { 
    console.log('mongodb connected',err);
})

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

var path = require('path');

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.route('/').get((req, res)=> {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.route('/books').get(function(req, res){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("BookDB");
            var query = { };
            dbo.collection("books").find(query).toArray(function(err, result) {
              if (err) throw err;              
              res.send(result);
              db.close();
            });
        });
});

app.route('/createBook').post((req, resp)=>{
    //req.body.bookName
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("BookDB");
            dbo.collection("books").insertOne(req.body, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();

            var query = { };            
            resp.send("Document created successfully: "+JSON.stringify(req.body));
            
          })
    });
});

app.route('/createBooks').post((req, resp)=>{
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("BookDB");
            dbo.collection("books").insertOne(req.body, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            var query = { }; 

            dbo.collection("books").find(query).toArray(function(err, result) {
              if (err) throw err;
              console.log(result.length);
              resp.send("Books created in bulk!, current book count: "+result.length);
              db.close();
            });

          });
    });
});

app.route('/searchBooks').post((req, res)=>{
    res.send("Hey, searched book as requested!");
});

var server = app.listen(3000, function() {});
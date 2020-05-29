const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
const path = require('path')

const myVar = require('./variables.js')
const url = "mongodb://mongo:27017/first_db"
const dbName = "first_db"

console.log('check point')
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to mongoDB server");
    
   
    const db = client.db(dbName);
    // console.log("Database name is " + client.db)
    app.locals.db = db


    // app.use(session({
    //     secret: 'foo',
    //     store: new MongoStore({
    //         client: MongoClient,
    //         dbName: dbName
    //     })
    // }))

    // client.close();
})




// Router
app.get('/', function(req, res){
    myVar()
    res.sendFile(path.join(__dirname+'/frontend/form.html'))
})

// create collection
app.get('/create', function(req, res){

    let db = req.app.locals.db
    // console.log(db)
 
    db.createCollection("customers", function(err, res) {
        assert.equal(null, err);
        console.log("Collection created!");
    })

    res.send('Create stuff')

})

app.get('/insert', function(req, res) {
    let db = req.app.locals.db
    let insertObj = {name: 'Meow 33', address: "somewhere over the rainbow", tel:"9911"}
    let r = res
    db.collection("customers").insertOne(insertObj, function(err, res){
        assert.equal(null, err)
        console.log(res.ops[0]._id)
        r.send('Inserted a customer')

    })
})

app.get('/get', function(req, res){
    let db = req.app.locals.db
    db.collection("customers").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
      });

      res.send('check console logg')
})




app.listen(3000, function() {
    console.log('app listening on port 3000!')
})
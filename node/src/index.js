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


app.use(express.json());

// Router
app.get('/', function(req, res){
    myVar()
    res.sendFile(path.join(__dirname+'/frontend/form.html'))
})

// create collection
app.get('/customers/create', function(req, res){

    let db = req.app.locals.db
    // console.log(db)
 
    db.createCollection("customers", function(err, res) {
        assert.equal(null, err);
        console.log("Collection created!");
    })

    res.send('Create stuff')

})

app.get('/customers/insert', function(req, res) {
    let db = req.app.locals.db
    let insertObj = {name: 'Meow 33', address: "somewhere over the rainbow", tel:"9911"}
    let r = res
    db.collection("customers").insertOne(insertObj, function(err, res){
        assert.equal(null, err)
        console.log(res.ops[0]._id)
        r.send('Inserted a customer')

    })
})

app.get('/customers/get', function(req, res){
    let db = req.app.locals.db
    db.collection("customers").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
      });

      res.send('check console logg')
})

app.post('/customers/json', function(req, res){
    console.log(req.body);      // your JSON
    res.send(req.body); 
    let data = req.body
    console.log(data['veh'])

    let db = req.app.locals.db
    let myquery = { "name" : "Meow 1" }
    var newValues = { $set: {transport: data['veh']} }
    db.collection("customers").updateOne(myquery, newValues, function(err, res) {
        if (err) throw err;
        console.log("updated DB la")
    })
})

app.get('/customers/query', function(req, res){
    let db = req.app.locals.db
    db.collection("customers").find({name:'Meow 1'}).project({address:1, _id:0}).toArray((err, result) =>{
        if (err) throw err;
        console.log(result)
    })
    res.send('check console log result')
})

app.post('/purchase/create', function(req, res){

    let db = req.app.locals.db
    // console.log(db)
 
    db.createCollection("purchase", function(err, res) {
        assert.equal(null, err);
        console.log("Purchase Collection created!");
    })

    res.send('Create stuff')

})

app.post('/purchase/insert', function(req, res){
    let db = req.app.locals.db
    let insertObj = {custName: 'Meow 33', items: ["罐罐", "餅餅", "好多三文魚"]}
    let r = res
    db.collection("purchase").insertOne(insertObj, function(err, res){
        assert.equal(null, err)
        console.log(res.ops[0]._id)
        r.send('Inserted a purchase')
    })
})


app.get('/customers/purchase/join', function(req, res){
    let db = req.app.locals.db

    db.collection('purchase').aggregate([
        { $lookup:
           {
             from: 'customers',
             localField: 'custName',
             foreignField: 'name',
             as: 'customersdetails'
           }
         }
        ]).toArray(function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.send(JSON.stringify(result));
      });
})


app.get('/customers/aggregate', function(req, res){
    let db = req.app.locals.db

    db.collection('customers').aggregate(
        [
            {$project: 
                {
                    name: 1,
                    address: 1
                },
            },
            {$match:{name: {$in:['Meow 1','Meow 33']} }}
        ]
    ).toArray(function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.send(JSON.stringify(result));
      });
})


app.listen(3000, function() {
    console.log('app listening on port 3000!')
})
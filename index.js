// node
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
require('dotenv').config();

// mongodb
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcv2f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// mongdb client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventList = client.db(process.env.DB_NAME).collection("events");
    const userList = client.db(process.env.DB_NAME).collection("users");
    
    // load all events
    app.get('/allEvents', (req, res) => {
        eventList.find({})
        .toArray((err, docs) => res.send(docs))
    })

    // add event
    app.post('/addEvent', (req, res) => {
        const event = req.body;
        eventList.insertOne(event)
        .then(result => res.send(result.insertedCount > 0))
    })

    // load all users
    app.get('/allUsers', (req, res) => {
        userList.find({})
        .toArray((err, docs) => res.send(docs))
    })

    // load single user
    app.get('/oneUser', (req, res) => {
        const userEmail = req.query.email;
        userList.find({email: userEmail})
        .toArray((err, docs) => res.send(docs))
    })

    // add user
    app.post('/register', (req, res) => {
        const user = req.body;
        userList.insertOne(user)
        .then(result => res.send(result.insertedCount > 0))
    })

    // remove user
    app.delete('/remove/:id', (req, res) => {
        const user = req.params.id;
        userList.deleteOne({_id: ObjectId(user)})
        .then(result => res.send(result.deletedCount > 0))
    })
})
app.listen(process.env.PORT || 4200)

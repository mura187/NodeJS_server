const express = require('express');
//import express from 'express';
const app = express();
const bodyParser =  require('body-parser'); //парсит тело запроса  и в request body записывает, что мы передали
//import bodyParser from 'body-parser';
const mongoose = require('mongoose');
//import mongoose from 'mongoose';
const ObjectID = mongoose.Types.ObjectId;
const productController = require('./controllers/product')

var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('home page api');
});

app.post('/product', (req, res) => {
    const product = { 
        name: req.body.name
    }; 
    db.collection('products').insert(product, 
        (err, result) => {
            if(err){
                console.log(err);
                return res.sendStatus(500);
            } 
            res.send(product);
    });
});

app.get('/product', (req, res) => {
    //res.send(products);
    db.collection('products').find().toArray( (err, docs) => {
            if (err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(docs)
    })
});

app.get('/product/:id', (req, res) => {
    db.collection('products').findOne({_id: ObjectID(req.params.id)}, 
        (err, doc) => {
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
        res.send(doc);
    });
});

app.put('/product/:id', (req, res) => {
    db.collection('products').replaceOne(
        {_id: ObjectID(req.params.id) },
        {$set: { name: req.body.name } },
        (err, result) => {
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});

app.delete('/product/:id', (req, res) => {
    db.collection('products').deleteOne(
        {_id: ObjectID(req.params.id)},
        (err, result) => {
            if (err){
                console.log(err);
                return res.sendStatus(500);
            }
            return res.sendStatus(200);
        }
    )

})

mongoose.connect("mongodb://localhost:27017/api", { useNewUrlParser: true }, (err, database) => {
    if (err) { return console.log(err);}
    db = database;
    const port = 3003;
    app.listen(port, () => console.log(`api started, connection w/ db success on port ${port}`))
});



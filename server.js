import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
//import BasicStrategy from 'passport-http'.BasicStrategy;

const BasicStrategy = require('passport-http').BasicStrategy;
const app = express(); 
const ObjectID = mongoose.Types.ObjectId; 
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new BasicStrategy((username, password, done) => {
    User.findOne({username: username, password: password}, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
    })
}));

const User = mongoose.model('User', {
    username: {type: String, unique: true},
    password: String
});

app.get('/users/me',
    passport.authenticate('basic', { session: false }),
    (req, res) => {
    
    let userId = req.user._id;
    
    User.findOne({_id: userId}, (err, user) => {
        if (err)
            return res.json({status: 'error', data: err});

        return res.json({status: 'ok', data: user})
    })
});

app.post('/users/register',
    (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    if (!username || !password)
        return res.json({status: 'error', data: 'Invalid params'});

    User.create({username: username, password: password}, (err, user) => {
        if (err)
            return res.json({status: 'error', data: err});

        return res.json({status: 'ok'})
    })
});


app.get('/', passport.authenticate('basic', { session: false }),
    (req, res) => {
    res.send('home page api');
});

app.post('/product', passport.authenticate('basic', { session: false }),
    (req, res) => {
    const product = { 
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        cashback: req.body.cashback,
        barcode: req.body.barcode
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

app.get('/product', passport.authenticate('basic', { session: false }),
    (req, res) => { 
    db.collection('products').find().toArray( (err, docs) => {
            if (err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(docs)
    })
});

app.get('/product/:id', passport.authenticate('basic', { session: false }),
    (req, res) => {
    db.collection('products').findOne({_id: ObjectID(req.params.id)}, 
        (err, doc) => {
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
        res.send(doc);
    });
});

app.put('/product/:id', passport.authenticate('basic', { session: false }),
    (req, res) => {
    db.collection('products').replaceOne(
        {_id: ObjectID(req.params.id) },
        {$set: { 
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            cashback: req.body.cashback,
            barcode: req.body.barcode 
        } 
        },         
        (err, result) => {
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});

app.delete('/product/:id', passport.authenticate('basic', { session: false }),
    (req, res) => {
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



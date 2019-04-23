var express = require('express');
var app = express();
var bodyParser =  require('body-parser'); //парсит тело запроса  и в request body записывает, что мы передали
var mongoose = require('mongoose');
var ObjectID = mongoose.Types.ObjectId;
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var products = [
    {
        id:1,
        name: 'Ariel 1L'
    },
    {
        id:2,
        name: 'Tide 2L'
    },
    {
        id:3,
        name:'Lenor 2.5L'
    },
    {
        id:4,
        name:'Gillette Bazaru Net'
    },
    {
        id:5,
        name:'Old Spice'
    },
    {
        id:6,
        name:'Lenor 3L'
    },
]; 

app.get('/', function(req, res){
    res.send('home page api');
});

app.post('/product', function (req, res){
    var product = { 
        name: req.body.name
    }; 
    db.collection('products').insert(product, 
        function(err, result){
            if(err){
                console.log(err);
                return res.sendStatus(500);
            } 
            res.send(product);
    });
});

app.get('/product', function (req, res){
    //res.send(products);
    db.collection('products').find().toArray(function(err, docs){
            if (err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(docs)
    })
});

app.get('/product/:id', function(req, res){
    db.collection('products').findOne({_id: ObjectID(req.params.id)}, 
        function(err, doc){
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
        res.send(doc);
    });
});

app.put('/product/:id', function(req, res){
    var product = products.find(
        function(product){
            return product.id === Number(req.params.id);
    });
    product.name = req.body.name;
    res.send(product);
});

app.delete('/product/:id', function(req, res){
    products = products.filter( 
        function(product){
            return product.id !== Number(req.params.id);
        });
    res.sendStatus(200);
})

mongoose.connect("mongodb://localhost:27017/api", { useNewUrlParser: true }, function(err, database) {
    if (err) {
        return console.log(err);
    }
    db = database;
    app.listen(3003,function () {
        console.log('api started, connection w/ db success')
    })
});



var express = require('express');
var app = express();
var bodyParser =  require('body-parser'); //парсит тело запроса  и в request body записывает, что мы передали

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
        id: Date.now(), //change to another generation!!!
        name: req.body.name
    };
    products.push(product); 
    res.send(product);
});

app.get('/product', function (req, res){
    res.send(products);
});

app.get('/product/:id', function(req, res){
    console.log(req.params);
    var product = products.find(
        function(product){
            return product.id === Number(req.params.id);
    })
    res.send(product);
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


app.listen(3012, function(){
    console.log('api started');
});
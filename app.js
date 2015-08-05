var express = require('express');
var emallutil = require('./lib/emallutil');
var path = require('path');
var fs = require('fs');
var url = require('url');
var app = express();
require('events').EventEmitter.prototype._maxListeners = 10000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.get('/', function(req, res){
    res.render('index', null);
});

app.get('/getProduct', function(req, res){
    var url = req.query.url;
    emallutil.getProduct(url, function(err, data){
        if(err){
            res.json({error:err});
            return;
        }
        res.json(data);
    });
});
app.get('/getPrice', function(req, res){
    var refer = req.query.refer,
        site = req.query.site,
        url = req.query.url;
    emallutil.getPrice(site , url, function(err, data){
        if(err){
            res.json({error:err});
            return;
        }
        res.json(data);
    }, refer);
        
})
app.listen(3000, function(req, res){
    console.log('app running at port 4000')
})
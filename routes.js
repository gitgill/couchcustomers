// routes.js - route module.

var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
var NodeCouchDb= require("node-couchdb");


const couch = new NodeCouchDb();

const dbName = 'customers';
const viewURL = '_design/all_customers/_view/all';

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// Home page route.
router.get('/', function (req, res) {

  couch.get(dbName, viewURL).then(
    function(data, headers, status){
      console.log(data.data.rows);
      res.render('index', {
        customers: data.data.rows
      })
    },
    function(err){
      res.send(err);
    });
})


//add customer - input page
router.get('/customer/addpage/', function (req, res) {
  res.render('add');
});


// add customer action route.
router.post('/customer/add/', function(req, res){
  const name = req.body.name;
  const email = req.body.email;

  // use an automatically generated unique identifier
  couch.uniqid().then(function(ids){
    const id = ids[0]; //just get one id (the first one)
    
    //insert id into database
    couch.insert('customers', {
      _id: id,
      name: name,
      email: email
    }).then(
      function(data, headers, status){
        res.redirect('/');
      },
      function(err){
        res.send(err);
      }
      
      )
      
    
  });
  
});

// delete record - confirm page

router.get('/customer/confirmdelete/:id', function (req, res) {
  const id = req.params.id; //the param passed in the url
  
  couch.get(dbName, id).then(
    function(data, headers, status){
      const doc = data.data;

      res.render('delete', {
        name: doc.name,
        email: doc.email,
        rev: doc._rev,
        id: id
      })
    },
    function(err){
      res.send(err);
    });
});



// delete customer action
// since not a post from form, using router.get and retrieving params sent in URL
router.get('/customer/delete/:id/:rev', function(req,res){
  const id = req.params.id; //the param passed in the url
  const rev = req.params.rev;
  
  couch.del(dbName, id, rev).then(
    function(data, headers, status){
      res.redirect('/');
    },
    
    function(err){
      res.send(err);
    });

});

// edit customer - input page
router.get('/customer/editpage/:id', function (req, res) {
  const id = req.params.id; //the param passed in the url
  
  couch.get(dbName, id).then(
    function(data, headers, status){
      const doc = data.data;

      res.render('update', {
        name: doc.name,
        email: doc.email,
        rev: doc._rev,
        id: id
      })
    },
    function(err){
      res.send(err);
    });
});


// update customer action
router.post('/customer/update/:id', function(req,res){
  const id = req.params.id; //the param passed in the url
  const rev = req.body.rev;
  const name = req.body.name;
  const email = req.body.email;
  
  couch.update(dbName, {
    _id: id,
    _rev: rev,
    name: name,
    email: email
  }).then(
    function(data, headers, status){
      res.redirect('/');
    },
    
    function(err){
      res.send(err);
    });

});




module.exports = router;




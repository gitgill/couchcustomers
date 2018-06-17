const express = require("express");
//const bodyParser = require("body-parser");
const path = require("path");
const NodeCouchDb= require("node-couchdb");
var routes = require('./routes.js');


const couch = new NodeCouchDb();

const dbName = 'customers';
const viewURL = '_design/all_customers/_view/all';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


var application_root = __dirname;
app.use( express.static( application_root ) );
app.use( express.static(path.join(application_root, './public')))

//app.use(express.static('./public'));

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));


app.use('/', routes);

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening at port 3000");
});


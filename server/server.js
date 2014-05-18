var express 		= require('express');
var mongoose 		= require('mongoose');
var fs 				= require('fs');
var app 			= express();
var phantomjs 		= require('phantomjs');
var childProcess 	= require('child_process');
var Presentation    = require('./models/presentation');
exports.app = app;


//todo use env
var serverName = 'pres.shubapp.com';
var API_PATH = '/api/';

function initConfig(){
	process.on('uncaughtException',function(err){
		console.log("ERROR: " +err);
	});
	
	dbHandle();

	app.use(allowCrossDomain);
	// app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.multipart());
	// app.use(express.bodyParser({keepExtensions:true,uploadDir:__dirname+'/../public/upload/'}));


	// Configure routes
	app.configure(function(){
	  app.use('/', express.static(__dirname + "/../public"));
	});

	app.get('/', function(req, res) {
    	res.redirect('/index.html');
	});

	app.get(API_PATH+'presentations', function(req, res) {
    	Presentation.find({},function(err, presentations){
    		res.json(presentations);
    	});
    	// res.json({});
	});

	app.post(API_PATH+'newPres', function(req, res){ 
		addNewPresentation(__dirname + "/../public/upload/"+req.body.title, req.files.pres.originalFilename,req.body.title, 
			req.body.tags, req.body.desc, req, res);
	});

	// show a message in console
	app.listen(80);
	console.log('pres server is running and listening to port 80');
}


var allowCrossDomain = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "http://" + serverName);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
};

function addNewPresentation(newDir, originalFilename, presTitle, tags, descText, req, res) {
	fs.mkdir(newDir,function(err){
    	fs.readFile(req.files.pres.path, function (err, data) {
			var newPath = newDir +"/"+ originalFilename;
			fs.writeFile(newPath, data, function (err) {
				takeAPic(presTitle,'http://www.google.com');
				
				// db entitiy
				var pres = new Presentation({
					thumbnail:"upload/"+presTitle+"/"+presTitle+".png",
					title: presTitle,
					user: "s7689966",
					tags:tags.split(','),
					created_at:new Date(),
					updated_at:new Date(),
					contents: presTitle +"/" +originalFilename,
					desc: descText
				});
				pres.save(function(err){
					if (err){
						console.log(err);
					}
				});

				res.redirect("index.html");
			});
		});
	});
}

function takeAPic(presName, url){
	var binPath = phantomjs.path;
	
	var childArgs = [
	  __dirname+ '/rasterize.js',
	  url,
	  __dirname+'/../public/upload/' + presName+ '/' + presName +'.png'
	];

	childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
	
	});
}

function dbHandle(){
	//db connection
	mongoose.connect('mongodb://localhost/presjoe');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
		console.log("connected to the presjoe db!");
	});
}


initConfig();
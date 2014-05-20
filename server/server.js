var express 		= require('express');
var mongoose 		= require('mongoose');
var fs 				= require('fs');
var app 			= express();
var childProcess 	= require('child_process');
var Presentation    = require('./models/presentation');
exports.app = app;

var binPath = process.env.PHANTOM_PATH || require('phantomjs').path;

//todo use env
var serverName = process.env.HOST_NAME||'testpres.shubapp.com';
var API_PATH = '/api/';

var PRES_TYPES={
	URL:1,
	PDF:2
};

function initConfig(){
	process.on('uncaughtException',function(err){
		console.log("ERROR: " +err);
	});

	addFunctions();
	
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
		var fileName;
		var presType;
		
		if (!req.files.pres.originalFilename){
			fileName = req.body.presurl;
			presType=PRES_TYPES.URL;
		}else{
			fileName = req.files.pres.originalFilename;
			presType=PRES_TYPES.PDF;
		}
		addNewPresentation(presType, __dirname + "/../public/upload/"+req.body.title, fileName,req.body.title, 
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

function addNewPresentation(presType, newDir, fileName, presTitle, tags, descText, req, res) {
	fs.mkdir(newDir,function(err){
		if (presType == PRES_TYPES.PDF){
			fs.readFile(req.files.pres.path, function (err, data) {
				var newPath = newDir +"/"+ fileName;
				fs.writeFile(newPath, data, function (err) {
					takeAPic(presTitle, fileName);
					savePresentation(presTitle,new Date(), fileName, tags, descText, "s7689966", presType);
					res.redirect("index.html");
				});
			});
		}else if (presType == PRES_TYPES.URL){
			takeAPic(presTitle, fileName);
			savePresentation(presTitle,new Date(), fileName, tags, descText, "s7689966", presType);
			res.redirect("index.html");
		}
	});
}

function savePresentation(presTitle, createDate, fileName, tags, descText, user, presType){
		// db entitiy
		var pres = new Presentation({
			thumbnail:"upload/"+presTitle+"/"+presTitle+".png",
			title: presTitle,
			user: user,
			tags:tags.split(','),
			created_at:createDate,
			updated_at:createDate,
			contents: fileName,
			desc: descText,
			type: presType
		});

		pres.save(function(err){
			if (err){
				console.log(err);
			}
		});
}

function takeAPic(presName, filename){
	var newPresFolder=__dirname+'/../public/upload/' + presName+ '/' ;

	if (filename.endsWith('.pdf')) {
		childProcess.execFile("convert", [newPresFolder + filename+'[0]' ,newPresFolder + presName +'.png'], function(err, stdout, stderr) {
			if(err){
				console.log(err);
			}
		});
	}else if ((filename.indexOf('http://')==0) || (filename.indexOf('https://')==0)) {
		var childArgs = [
		  __dirname+ '/rasterize.js',
		  filename,
		  newPresFolder + presName +'.png'
		];

		childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
			if(err){
				console.log(err);
			}
		});
	}
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

function addFunctions(){
	if (typeof String.prototype.endsWith != 'function') {
	  String.prototype.endsWith = function (str){
	    return (this.slice(-str.length) == str)||(this.slice(-str.length) == str.toUpperCase());
	  };
	}
}

initConfig();
////////////////////////////////////////////////////////
// Setting up application!
////////////////////////////////////////////////////////
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest : 'public/uploads/'});
var type = upload.single('file');

// Set PUG as default view engine.
app.set('view engine', 'pug');

// Making static routes to resources to reference them.
app.use("/static", express.static(__dirname + '/public'));
app.use("/style", express.static(__dirname + '/views/styles'));

// //////////////////////////////////////////////////////
// Handling requests!
// //////////////////////////////////////////////////////
app.get("/", function(req, res) {
	res.render("index", {title: 'Hey', message: 'Upload a file!'});
});

app.post('/upload', type, function(req, res) {
	console.log(new Date().toISOString() + " Uploading files...");
	
	// Temporary and target paths.
	var tmp_path = req.file.path;
	var target_path = 'public/uploads/' + req.file.originalname;
	
	// Taking the uploaded file to the correct place.
	var src = fs.createReadStream(tmp_path);
	var dest = fs.createWriteStream(target_path);
	src.pipe(dest);
	
	// Handling upload events.
	src.on('end', function() {
		var upload_files = null;
		
		res.render("index", {title: 'HeyHo :)', 
			message: 'Successful uploading! :)'});
	});
	
	src.on('error', function(err) {
		res.render("index", {title: 'HeyHo :(', 
			message: 'Something went wrong :( ' + err});
	});
});

app.get("/get_files", function(req, res) {
	fs.readdir('public/uploads/', function(err, _files) {
		if (err) {
			console.error(err);
			return;
		}
		
		res.render("list", {files: _files});
	});
});

// //////////////////////////////////////////////////////
// Staring the server!
// //////////////////////////////////////////////////////
var server = app.listen(8081, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);

});
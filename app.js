var express = require('express');
var bp = require('body-parser')
var app = express();
var mongoose = require('mongoose')
var JokeController = require("./controllers/joke-controller.js")
var hbs = require("hbs")

hbs.registerPartials(__dirname + "/views/partials")

app.use(bp.json());
app.set('port', (process.env.PORT || 8080));

mongoose.connect("mongodb://admin:admin@ds133465.mlab.com:33465/joke-db");
var jokeController = new JokeController()

app.set("engine", hbs.__express)
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	jokeController.getAll()
		.then(function(services) {
			res.render('home', { services })
		})
		.catch(err => { res.status(500).json(err) });
});

app.get("/api/jokes/:id", function(req, res) {
	jokeController.get(req.params.id)
		.then(joke => res.render("partials/joke", joke))
		.catch(err => { res.status(500).json(err) });
});

app.post("/api/jokes", function(req, res) {
	jokeController.create(req.body)
		.then(result => {
			res.json({ newId: result._id })
		})
		.catch(err => { res.status(406).json(err) });
});


app.listen(app.get('port'), function() {
	console.log("Listening on port", app.get('port'));
});
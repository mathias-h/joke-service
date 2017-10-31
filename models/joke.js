var mongoose = require('mongoose')
var Schema = mongoose.Schema

var joke = new Schema ({
    setup: {type: String, required: true},
    punchline: {type: String, required: true},
});
module.exports = mongoose.model("Joke", joke)
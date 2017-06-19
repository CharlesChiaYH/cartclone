var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//This sets the schema or "format" of the properties for each object in the DB//
//the actual creation of DB is the code in "product-seeder.js" (seed folder)//
var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('Product', schema);

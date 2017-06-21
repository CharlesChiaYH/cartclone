var express = require('express');
var router = express.Router();

//Bringing in product model from models folder//
var Product = require('../models/product');

/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
      var productPortion = [];
        var portionSize = 3;
        //argument: docs in this function refers to the compiled "documents" from seeder inside DB//
        console.log('here is the items ==' + docs);

        for (var i = 0; i < docs.length; i += portionSize) {
            productPortion.push(docs.slice(i, i + portionSize));
            //to display 3 items in a row, the "portion size" is kept at 3 items//
            //on first iteration, the push is a sliced array from "docs" (of 5 items in DB)//
            //in which index starts from index position 0 up, but not including, index position 3//
            //in 2nd iteration, the push is a sliced array from "docs", but from index position 3//
            //since "portion size" is added to i (which starts initially at zero), all the way to end (index position 4)//
            console.log("this is part of == " + i + "product chuncks =="+productPortion);
        }
        res.render('shop/index', {title: 'Shopping Cart', products: productPortion});
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
//Bringing in cart model (cart.js) to allow working with cart codes below//
var Cart = require('../models/cart');

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

//Setup route for adding items to cart: href="addtocart" in handlebars (index.hbs)//
//a product ID is to be expected - this will be pushed into ext'g session//
//Also, this product will be pushed into a "cart" object//
router.get('/addtocart/:id', function(req, res, next){
  var productId = req.params.id;
  //with reference to cart.js, on new instance of cart, check session for ext'g cart//
  //if no cart is found, then an empty object is assigned to items//
  //if there is an ext'g cart in the session, then remain as ext'g cart//
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  //Use mongooses to find product by ID//
  Product.findById(productId, function(err, product){
    if (err){
      return res.redirect('/');
    }
    cart.add(product, product.id); //if no errors found from line above, the product found is added to new instance of cart//
    req.session.cart = cart; //store the new cart as a property in th current session//
    //console.log(req.session.cart); test print current cart//
    res.redirect('/'); //redirects to index page//
  });
});

//Setup route for Shopping Cart view (shoppingCart.hbs)//
router.get('/shoppingCart', function(req, res, next){
  if (!req.session.cart){
    return res.render('shop/shoppingCart', {products:null});
  }
    var cart = new Cart(req.session.cart);
    res.render('shop/shoppingCart', {products:cart.generateArray(), totalCost: cart.totalCost});
});

//Setup route for Checkout view (checkout.hbs)//
router.get('/checkout', function(req, res, next){
  if (!req.session.cart){
    return res.redirect('/shoppingCart');
    //if there are no items in cart, a request for checkout will redirect to shopping cart index page//
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {total: cart.totalCost});
  //if there are items in the cart, render the checkout page, with "total" in the handlebars of checkout hbs populated with totalCost//
});


//Setup route for Under Construction view (underConstruction.hbs)//
router.get('/underConstruction', function(req, res, next){
  res.render('shop/underConstruction');
});


module.exports = router;

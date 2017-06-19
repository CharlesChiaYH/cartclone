//Import the schema from "products.js" (models folder)//
//keyword "product" i.e ../models/product - without .js (as per express syntax) //
var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
    new Product({
        imagePath: "https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
        title: 'Gothic video game',
        description: ' good!!!',
        price: 10

    }),
    new Product({
        imagePath: "https://vignette4.wikia.nocookie.net/fallout/images/6/68/Fallout_4_logo.png/revision/latest?cb=20150620134522",
        title: 'Fallout 4',
        description: ' better than good!!!',
        price: 20

    }),

    new Product({
        imagePath: "https://media.starwars.ea.com/content/starwars-ea-com/en_US/starwars/battlefront/news-articles/future-of-battlefront-2017/_jcr_content/featuredImage/renditions/rendition1.img.jpg",
        title: 'Star Wars Battlefront',
        description: ' Awsesome!!!',
        price: 45

    }),

    new Product({
        imagePath: "http://s.pacn.ws/640/qg/world-soccer-winning-eleven-2017-476077.7.jpg?ob0bmj",
        title: 'Wining Eleven',
        description: ' Only for the soccer enthusiasts',
        price: 10

    }),

    new Product({
        imagePath: "https://upload.wikimedia.org/wikipedia/en/0/02/CoD_Black_Ops_cover.png",
        title: 'Call of Duty: Black Ops',
        description: ' Absolut shooty!!!',
        price: 35

    })

];

/*var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}*/

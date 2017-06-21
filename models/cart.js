//Setup a Cart object Constructor function//
//Argument passed to Constructor (items from previous version of cart: prevCart) refers to previous version of cart//
//this will allow "building up" of cart and with some sort of grouping of items//
//Cart is built up with "add" function below - if it is new item, add a new item, or if its an ext'g item, increase qty and price//
//on first creation of Cart, it will be an empty javascript object//
module.exports = function Cart(prevCart){
  this.items = prevCart.items || {};
  this.totalQty = prevCart.totalQty || 0;
  this.totalCost = prevCart.totalCost || 0;
//Boolean OR operator used to prevent an error when passing and empty object on first instance of cart//
//hence, if the "prev.Cart items" is false or undefined, and empty object is used//
//if this Boolean operator is not used, subsequent results for totalQty and totalCost will become errors (NaN)//


  //function to add items to cart. Item and ID passed as arguments//
  //setting local variable storedItem to allow assigning initItems for subsequent addition//
  this.add = function(item, id){
    var storedItem = this.items[id];
    if(!storedItem){
      storedItem = this.items[id] = {item: item, qty: 0, price: 0 };
    } //if this incoming item was not from previous version of cart, it is stored as new object, with corresponding properties as "item", "qty" and "price"//
    storedItem.qty++;
    storedItem.price = storedItem.item.price*storedItem.qty;
    this.totalQty++;
    this.totalCost+=storedItem.item.price;
  }; //if this incoming item is already fro previous version of cart, its quantity and total cost in increased accordingly//

  //function to give the cart items back as an array (from an object)//
  //Allows for output a list of product groupings//
  this.generateArray = function(){
    var arr = [];
    for (var id in this.items){ //this line will loop through items in "this.items" based on ID//
      arr.push(this.items[id]); //this line pushes the ID of the item after looping into the empty array (var array = [])//
    }
    return arr;
  };
};

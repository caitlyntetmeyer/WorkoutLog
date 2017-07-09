module.exports = function(mongoose){
  var ProductSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    image: {type: String},
    price: {type: Number}
});

var Product = mongoose.model('Product', ProductSchema);
// how we build the model in our database. Calling the table 'Product' and passing in ProductSchema (from above)

var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Product was created');
  };
  var createProduct = function(name, description, image, price) {
    var product = new Product({
      name: name,
      description: description,
      image: image,
      price: price
    });
    product.save(registerCallback);
    // saves product to db
    // registerCallback is a variable from above
    console.log('Save command was sent');
  }
  return {
  // If smn calls this file (products.js), they'll see an object w/2 properties
    Product: Product,
    // Product is a variable from above
    createProduct: createProduct
    // createProduct is a function from above
  }
}


















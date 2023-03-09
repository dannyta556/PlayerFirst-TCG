import express from 'express';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Decklist from '../models/decklistModel.js';
import data from '../data.js';
import slugify from 'slugify';

const seedRouter = express.Router();

async function productData() {
  const newArray = [];
  await Product.find({}, (err, products) => {
    if (err) {
    }
    products.map((product) => {
      console.log(product.name);
      newArray.push(product.name);
      var query = { name: product.name };
      console.log(query);
    });
  })
    .exec()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      return err;
    });
  console.log(newArray);
}

seedRouter.get('/', async (req, res) => {
  await Product.remove({}); // remove all previous records in the product model
  await Product.insertMany(data.products);
  await Product.updateMany(
    {},
    {
      $set: {
        numReviews: 10,
        rating: 4.0,
        countInStock: 10,
        category: 'single',
        brand: 'Yugioh',
      },
    }
  );
  await Decklist.remove({});
  await Decklist.insertMany(data.decklists);

  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
});

export default seedRouter;

// seedRoutes was initally used to build the early features with some dummy data.
// navigate to /api/seed to use only the dummy data

// TODO
// slug-generator

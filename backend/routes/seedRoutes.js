import express from 'express';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Decklist from '../models/decklistModel.js';
import Recommendation from '../models/recommendationModel.js';
import Article from '../models/articleModel.js';
import data from '../data.js';
import setData from '../sets.js';
import articleData from '../articles.js';
import cardData from '../cardinfo.json' assert { type: 'json' };
import deckData from '../outfile.json' assert { type: 'json' };
import recData from '../recommendations.json' assert { type: 'json' };
const seedRouter = express.Router();

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

seedRouter.get('/import', async (req, res) => {
  await Product.remove({});
  await Product.insertMany(cardData.data);
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
  res.send({ message: 'Inserted cards from json' });
});

seedRouter.get('/importDecklists', async (req, res) => {
  await Decklist.insertMany(deckData);
  res.send({ message: 'Inserted decklists from json' });
});

seedRouter.get('/sets', async (req, res) => {
  await Product.insertMany(setData.products);
  res.send({ message: 'Card sets have been added' });
});
export default seedRouter;

seedRouter.get('/recommendations', async (req, res) => {
  await Recommendation.remove({});
  await Recommendation.insertMany(recData);
  res.send({ message: 'Recommendation data imported' });
});

seedRouter.get('/articles', async (req, res) => {
  await Article.remove({});
  await Article.insertMany(articleData.articles);
  res.send({ message: 'Article data imported' });
});
// seedRoutes was initally used to build the early features with some dummy data.
// navigate to /api/seed to use only the dummy data

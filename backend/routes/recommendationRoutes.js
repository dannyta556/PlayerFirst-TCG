import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Recommendation from '../models/recommendationModel.js';
import Product from '../models/productModel.js';

const recommendationRouter = express.Router();

recommendationRouter.get(
  '/card/:slug',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      if (product.category === 'single') {
        const recommendation = await Recommendation.findOne({
          name: product.name,
        });
        if (recommendation) {
          // loop through recommendations and send back an array of products
          let resultArray = [];
          for (let i = 0; i < recommendation.recommendations.length; i++) {
            const recProd = await Product.findOne({
              name: recommendation.recommendations[i],
            });
            if (recProd) {
              resultArray.push(recProd);
            }
          }
          res.send({ recommendations: resultArray });
        } else {
          res.send({ recommendations: [] });
        }
      } else {
        const products = await Product.find({
          slug: { $ne: req.params.slug },
          category: 'set',
        }).limit(5);
        res.send({ recommendations: products });
      }
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  })
);

export default recommendationRouter;

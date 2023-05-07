import express from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find({
    name: { $regex: 'Tearlament', $options: 'i' },
  }).limit(4);
  res.send(products);
});

const PAGE_SIZE = 9;

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              // ex: 0-50 gte(greater than) 0 lte(less than) 50
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { card_prices: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    let returnpages = 0;
    if (Math.ceil(countProducts / pageSize) > 20) {
      returnpages = 20;
    } else {
      returnpages = Math.ceil(countProducts / pageSize);
    }

    res.send({
      products,
      countProducts,
      page,
      pages: returnpages,
    });
  })
);

const CARD_SEARCH_SIZE = 12;

productRouter.get(
  '/cardSearch',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || CARD_SEARCH_SIZE;
    const page = query.page || 1;
    const category = query.category || 'single';
    const searchQuery = query.query || '';

    // For card search
    const level = query.level || '';
    const cardType = query.cardType || '';
    const atk = query.atk || '';
    const def = query.def || '';
    const attribute = query.attribute || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const lvlFilter = level;
    const attributeFilter = attribute;
    const atkFilter = atk;
    const defFilter = def;

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...lvlFilter,
      ...attributeFilter,
      ...atkFilter,
      ...defFilter,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...lvlFilter,
      ...attributeFilter,
      ...atkFilter,
      ...defFilter,
    });
    let returnpages = 0;
    if (Math.ceil(countProducts / pageSize) > 10) {
      returnpages = 10;
    } else {
      returnpages = Math.ceil(countProducts / pageSize);
    }
    res.send({
      products,
      countProducts,
      page,
      pages: returnpages,
    });
  })
);

productRouter.get(
  '/price/:slug',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send({ price: product.price });
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get(
  '/attributes',
  expressAsyncHandler(async (req, res) => {
    const attributes = await Product.find().distinct('attribute');
    res.send(attributes);
  })
);

productRouter.get(
  '/cardTypes',
  expressAsyncHandler(async (req, res) => {
    const cardTypes = await Product.find().distinct('type');

    res.send(cardTypes);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

productRouter.get('/name/:name', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.name });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

productRouter.get('/description/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  console.log(product);
  if (product) {
    res.send(product.desc);
  } else {
    res.send('');
  }
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

// Admin Routes
productRouter.post('/new', async (req, res) => {
  let product = new Product({
    name: req.body.name,
    type: req.body.type,
    desc: req.body.desc,
    price: req.body.price,
  });
  try {
    let result = await product.save();
    if (result) {
      res.send({ message: 'New Product Created' });
    }
  } catch (e) {
    res.status(401).send({ message: 'Failed to create new product' });
  }
});

export default productRouter;

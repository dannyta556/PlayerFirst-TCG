import express from 'express';
import Decklist from '../models/decklistModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const decklistRouter = express.Router();

decklistRouter.get('/', async (req, res) => {
  const decklists = await Decklist.find({ isUserCreated: true }).limit(10);
  res.send(decklists);
});

const PAGE_SIZE = 20;

decklistRouter.get(
  '/tournamentDeckSearch',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const date = query.date || '';
    const tournament = query.tournament || '';
    const order = query.order || '';
    const archetype = query.archetype || '';

    const dateFilter = date && date !== 'all' ? { date } : {};
    const tournamentFilter =
      tournament && tournament !== 'all' ? { tournament } : {};
    const archetypeFilter =
      archetype && archetype !== 'all' ? { archetype } : {};

    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : order === 'oldest'
        ? { createdAt: 1 }
        : { _id: -1 };

    const decklists = await Decklist.find({
      ...archetypeFilter,
      ...tournamentFilter,
      ...dateFilter,
      isUserCreated: false,
    })
      .skip(pageSize * (page - 1))
      .sort(sortOrder)
      .limit(pageSize);

    const countDecklists = await Decklist.countDocuments({
      ...archetypeFilter,
      ...tournamentFilter,
      ...dateFilter,
    });

    res.send({
      decklists,
      countDecklists,
      page,
      pages: Math.ceil(countDecklists / pageSize),
    });
  })
);

decklistRouter.get(
  '/prices',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const id = query.id;
    const deck = await Decklist.findById(id);
    if (deck) {
      let prices = [];
      let mainDeckPrices = [];
      let extraDeckPrices = [];
      for (let index = 0; index < deck.mainDeck.length; index++) {
        const product = await Product.findOne({
          name: deck.mainDeck[index].name.replace(/[^\x00-\x7F]/g, ''),
        });
        prices.push(product.price);
        mainDeckPrices.push(product.price);
      }
      for (let index = 0; index < deck.extraDeck.length; index++) {
        const product = await Product.findOne({
          name: deck.extraDeck[index].name.replace(/[^\x00-\x7F]/g, ''),
        });
        prices.push(product.price);
        extraDeckPrices.push(product.price);
      }
      res.send({
        prices: prices,
        mainDeckPrices: mainDeckPrices,
        extraDeckPrices: extraDeckPrices,
      });
    } else {
      res.sendStatus(404).message('Can not find deck error');
    }
  })
);

decklistRouter.get(
  '/price',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const id = query.id;
    const email = query.email || '';
    const deck = await Decklist.findById(id);
    let user = '';
    if (email !== '') {
      user = await User.findOne({ email });
    }

    let yourPrice = 0.0;
    if (deck) {
      // loop through maindeck and extradeck to calculate price
      let totalPrice = 0.0;
      const counts = {};
      for (let index = 0; index < deck.mainDeck.length; index++) {
        const product = await Product.findOne({
          name: deck.mainDeck[index].name.replace(/[^\x00-\x7F]/g, ''),
        });

        totalPrice = totalPrice + product.price;
        counts[deck.mainDeck[index].name] = counts[deck.mainDeck[index].name]
          ? counts[deck.mainDeck[index].name] + 1
          : 1;
      }
      for (let index = 0; index < deck.extraDeck.length; index++) {
        const product = await Product.findOne({
          name: deck.extraDeck[index].name.replace(/[^\x00-\x7F]/g, ''),
        });
        totalPrice = totalPrice + product.price;
        counts[deck.extraDeck[index].name] = counts[deck.extraDeck[index].name]
          ? counts[deck.extraDeck[index].name] + 1
          : 1;
      }

      totalPrice = totalPrice.toFixed(2);
      yourPrice = totalPrice;
      if (email !== '') {
        // loop through collection and subtract from totalPrice to get yourPrice
        for (const [key, value] of Object.entries(counts)) {
          let obj = user.cardCollection.find((o) => o.name === key);
          if (obj !== undefined) {
            if (obj.count >= value) {
              const product = await Product.findOne({
                name: obj.name.replace(/[^\x00-\x7F]/g, ''),
              });
              if (product.price) {
                yourPrice = yourPrice - product.price * value;
              }
            } else {
              const product = await Product.findOne({
                name: obj.name.replace(/[^\x00-\x7F]/g, ''),
              });
              if (product.price) {
                yourPrice = yourPrice - product.price * obj.count;
              }
            }
          }
        }
        yourPrice = Math.round(yourPrice * 100) / 100;
      }
      res.send({
        totalPrice: totalPrice,
        yourPrice: yourPrice,
        message: 'Success',
      });
    } else {
      res.status(404).send({ message: 'decklist not found' });
    }
  })
);

decklistRouter.get(
  '/feature',
  expressAsyncHandler(async (req, res) => {
    const deck = await Decklist.findById('6420b82908dbda2fc8a49f67');
    const secondDeck = await Decklist.findById('6420b82908dbda2fc8a49fd1');
    let returnArray = [];

    if (deck && secondDeck) {
      returnArray.push(deck);
      returnArray.push(secondDeck);
      res.send({
        decklists: returnArray,
      });
    } else {
      res.send({
        error: 'Decklists not found',
      });
    }
  })
);

decklistRouter.get(
  '/ownedCards',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const id = query.id;
    const email = query.email || '';
    const deck = await Decklist.findById(id);
    const user = await User.findOne({ email });

    let tempCollection = user.cardCollection.slice();
    let mainOwned = [];
    let extraOwned = [];

    if (deck) {
      for (let index = 0; index < deck.mainDeck.length; index++) {
        let findIndex = tempCollection.findIndex(
          (o) => o.slug === deck.mainDeck[index].slug
        );
        if (findIndex !== -1) {
          if (tempCollection[findIndex].count > 0) {
            mainOwned.push(1);
            tempCollection[findIndex].count =
              tempCollection[findIndex].count - 1;
          } else {
            mainOwned.push(0);
          }
        } else {
          mainOwned.push(0);
        }
      }
      for (let index = 0; index < deck.extraDeck.length; index++) {
        let findIndex = tempCollection.findIndex(
          (o) => o.slug === deck.extraDeck[index].slug
        );
        if (findIndex !== -1) {
          if (tempCollection[findIndex].count > 0) {
            extraOwned.push(1);
            tempCollection[findIndex].count =
              tempCollection[findIndex].count - 1;
          } else {
            extraOwned.push(0);
          }
        } else {
          extraOwned.push(0);
        }
      }
      res.send({
        mainOwned: mainOwned,
        extraOwned: extraOwned,
      });
    } else {
      res.sendStatus(404).message('Error in finding deck');
    }
  })
);

decklistRouter.post('/new', async (req, res) => {
  const newDeck = new Decklist({
    isUserCreated: req.body.isUserCreated || true,
    userEmail: req.body.email,
    duelist: req.body.duelist,
  });

  const deck = await newDeck.save();
  res.send({
    _id: deck._id,
  });
});

decklistRouter.get(
  '/dates',
  expressAsyncHandler(async (req, res) => {
    const dates = await Decklist.find().distinct('date');
    res.send(dates);
  })
);

decklistRouter.get(
  '/tournaments',
  expressAsyncHandler(async (req, res) => {
    const tournaments = await Decklist.find({ isUserCreated: false }).distinct(
      'tournament'
    );
    res.send(tournaments);
  })
);

decklistRouter.get(
  '/archetypes',
  expressAsyncHandler(async (req, res) => {
    const archetypes = await Decklist.find().distinct('archetype');
    res.send(archetypes);
  })
);

decklistRouter.get('/getDecks', async (req, res) => {
  const { query } = req;
  const email = query.email;
  const decklists = await Decklist.where('userEmail').equals(email);

  if (decklists) {
    res.send(decklists);
  } else {
    res.status(404).send({ message: 'decklists not found' });
  }
});

decklistRouter.post(
  '/delete',
  expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    const email = req.body.id;

    const user = await User.findOne({ email: email });
    if (user) {
      user.updateOne({
        $pull: {
          deckIDs: id,
        },
      });
      await Decklist.deleteOne({ _id: id });
      res.send({ message: 'Deck Deleted ' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

decklistRouter.post(
  '/addCard',
  expressAsyncHandler(async (req, res) => {
    const slug = req.body.slug;
    const name = req.body.name;
    const id = req.body.id;
    const isMainDeck = req.body.isMainDeck;
    const objID = new mongoose.Types.ObjectId();

    if (objID) {
      if (isMainDeck) {
        await Decklist.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $push: {
              mainDeck: {
                objID: objID,
                name: name,
                slug: slug,
                count: 1,
              },
            },
          }
        );
      } else {
        await Decklist.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $push: {
              extraDeck: {
                objID: objID,
                name: name,
                slug: slug,
                count: 1,
              },
            },
          }
        );
      }
      res.send({ message: 'Update Success' });
    }
  })
);

decklistRouter.post(
  '/deleteCard',
  expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    const objID = req.body.objID;
    const isMainDeck = req.body.isMainDeck;
    if (isMainDeck) {
      console.log('in main deck');
      await Decklist.updateOne(
        {
          _id: id,
        },
        {
          $pull: {
            mainDeck: {
              objID: mongoose.Types.ObjectId(objID),
            },
          },
        }
      );
    } else {
      await Decklist.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $pull: {
            extraDeck: {
              objID: mongoose.Types.ObjectId(objID),
            },
          },
        }
      );
    }
    res.send({ message: 'Card Deleted' });
  })
);

decklistRouter.post(
  '/changeName',
  expressAsyncHandler(async (req, res) => {
    const name = req.body.name;
    const id = req.body.id;

    const decklist = await Decklist.findById(id);
    if (decklist) {
      decklist.name = name || decklist.name;
      const updatedDecklist = await decklist.save();
      res.send({
        name: updatedDecklist.name,
      });
    } else {
      res.status(404).send({ message: 'Decklist not found' });
    }
  })
);

decklistRouter.post(
  '/changeArchetype',
  expressAsyncHandler(async (req, res) => {
    const archetype = req.body.archetype;
    const id = req.body.id;

    const decklist = await Decklist.findById(id);
    if (decklist) {
      decklist.archetype = archetype || decklist.archetype;
      const updatedDecklist = await decklist.save();
      res.send({
        archetype: updatedDecklist.archetype,
      });
    } else {
      res.status(404).send({ message: 'Error in changing archetype' });
    }
  })
);

decklistRouter.post(
  '/incrementCard',
  expressAsyncHandler(async (req, res) => {
    const slug = req.body.slug;
    const id = req.body.id;
    const isMainDeck = req.body.isMainDeck;

    if (isMainDeck) {
      await Decklist.findOneAndUpdate(
        {
          _id: id,
          'mainDeck.slug': slug,
        },
        {
          $inc: {
            'mainDeck.$.count': 1,
          },
        }
      );
    } else {
      await Decklist.findOneAndUpdate(
        {
          _id: id,
          'extraDeck.slug': slug,
        },
        {
          $inc: {
            'extraDeck.$.count': 1,
          },
        }
      );
    }
  })
);

decklistRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const decklist = await Decklist.findById(req.params.id);
    if (decklist) {
      res.send(decklist);
    } else {
      res.status(404).send({ message: 'decklist not found' });
    }
  })
);

export default decklistRouter;

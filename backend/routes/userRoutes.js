import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { isAuth, generateToken } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          deckIDs: user.deckIDs,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.get(
  '/collection',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const email = query.email;
    const user = await User.findOne({ email });
    if (user) {
      res.send(user.cardCollection);
    } else {
      res.status(404).send({ message: 'User error' });
    }
  })
);

// remove card from cardCollection array
// slug for which card to remove
userRouter.post(
  '/removeCard',
  expressAsyncHandler(async (req, res) => {
    const slug = req.body.slug;
    const email = req.body.email;

    await User.findOneAndUpdate(
      {
        email,
      },
      {
        $pull: {
          cardCollection: {
            slug: slug,
          },
        },
      }
    );
    res.send({
      message: 'Success',
    });
  })
);

// add card to cardCollection array
// if card exist increment card in array by 1
userRouter.post(
  '/addCard',
  expressAsyncHandler(async (req, res) => {
    const slug = req.body.slug;
    const name = req.body.name;
    const email = req.body.email;

    await User.findOneAndUpdate(
      {
        email,
      },
      {
        $push: {
          cardCollection: {
            name: name,
            slug: slug,
            count: 1,
          },
        },
      }
    );
  })
);

userRouter.put(
  '/incrementCard',
  expressAsyncHandler(async (req, res) => {
    const slug = req.body.slug;
    const email = req.body.email;

    const response = await User.findOneAndUpdate(
      {
        email: email,
        'cardCollection.slug': slug,
      },
      {
        $inc: {
          'cardCollection.$.count': 1,
        },
      }
    );
    if (response) {
      res.send(response);
    }
  })
);

userRouter.put(
  '/decrementCard',
  expressAsyncHandler(async (req, res) => {
    const slug = req.body.slug;
    const email = req.body.email;

    const response = await User.findOneAndUpdate(
      {
        email: email,
        'cardCollection.slug': slug,
      },
      {
        $inc: {
          'cardCollection.$.count': -1,
        },
      }
    );
    if (response) {
      res.send(response);
    }
  })
);

userRouter.post(
  '/addDeck',
  expressAsyncHandler(async (req, res) => {
    const email = req.body.email;
    const id = req.body.deck;

    const response = await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        $push: {
          deckIDs: id,
        },
      }
    );
    if (response) {
      res.send(response);
    }
  })
);
export default userRouter;

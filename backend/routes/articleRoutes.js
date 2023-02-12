import express from 'express';
import Article from '../models/articleModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';

const articleRouter = express.Router();

articleRouter.get('/', async (req, res) => {
  const articles = [
    {
      _id: 1234,
      title: 'Test article',
      slug: 'test-article',
      createdAt: '12/30/2022',
      desc: 'Test Description',
      author: 'John Doe',
    },
    {
      _id: 12345,
      title: 'Test article 2',
      slug: 'test-article-2',
      createdAt: '12/18/2022',
      desc: 'Test Description 2',
      author: 'James Smith',
    },
  ];
  const getArticles = await Article.find().sort({
    createdAt: 'desc',
  });
  res.send(getArticles);
});

// individual article page
articleRouter.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect('/');
  //res.render('articles/show', { article: article });
  res.send(article);
});

// admin create new article
articleRouter.post('/new', async (req, res) => {
  let article = new Article({
    title: req.body.title,
    createdAt: req.body.createdAt,
    type: req.body.type,
    desc: req.body.desc,
    markdown: req.body.markdown,
    author: req.body.author,
  });
  try {
    await article.save();
    res.send(article);
  } catch (e) {
    res.status(401).send({ message: 'Failed to create new article' });
  }
});
export default articleRouter;

const express = require('express');
const router = express.Router();

const db = require('../db');
const {Book} = db.models;

//Get listing of all books
router.get('/', async (req, res, next) => {
    const pageTitle = "Books";
    const headTitle = "Books";
    try {
        const allBooks = await Book.findAll(
            {attributes: ['id', 'title', 'author', 'genre', 'year'],
            order: [["title", "ASC"]]});
        const books = allBooks.map(book => book.toJSON());
        res.render('index', {books, pageTitle, headTitle});
    } catch(error) {
        res.sendStatus(500);
    };
  });

//Get form to input new book
router.get('/new', async(req, res, next) => {
    try {
        const pageTitle = "New Book";
        res.render('new-book.pug', {pageTitle});
    } catch (error) {
        console.log(error);
    }
});

//Create (Insert) a new book
router.post('/new', async(req, res, next) => {
    try {
        await Book.create({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            year: req.body.year
        });
        res.redirect('/books');
    } catch (error) {
        console.log(error);
    }
});

//Get individual book
router.get("/:id", async(req, res, next) => {
    const pageTitle = "Update / Delete Book";
    try {
        const oneBook = await Book.findByPk(req.params.id, {
            attributes: ['id', 'title', 'author', 'genre', 'year']});
        const book = oneBook.toJSON();
        const headTitle = book.title;
        res.render('update-book.pug', {book, pageTitle, headTitle});
    } catch(error) {
        res.sendStatus(500);
    };
  });

  //Edit individual book
  router.put('/:id', async(req, res, next) => {
    try {
        const oneBook = await Book.findByPk(req.params.id, {
            attributes: ['id', 'title', 'author', 'genre', 'year']});
        await oneBook.update({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            year: req.body.year
        }, { fields: ['title', 'author', 'genre', 'year']});
        res.redirect('/books');
    } catch (error) {
        console.log(error);
    }
  });

  //Delete individual book
  router.delete('/:id', async(req, res,next) => {
      try {
        const oneBook = await Book.findByPk(req.params.id);
        await oneBook.destroy();
        res.redirect('/books');
      } catch (error) {
        console.log(error);
      }
  });


module.exports = router;
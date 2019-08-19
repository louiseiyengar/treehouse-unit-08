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
        err.status = 500;
        err.message = "There was an internal server error."
        next(err);
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
        err.status = 500;
        err.message = "There was a database error creating this book."
        next(err);
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
    } catch(err) {
        err.status = 500;
        err.message = "There was a database error retrieving this book."
        next(err);
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
        err.status = 500;
        err.message = "There was a database error found when updating this book."
        next(err);
    }
  });

  //Delete individual book
  router.delete('/:id', async(req, res,next) => {
      try {
        const oneBook = await Book.findByPk(req.params.id);
        await oneBook.destroy();
        res.redirect('/books');
      } catch (error) {
        err.status = 500;
        err.message = "There was a database error when deleting this book."
        next(err);
      }
  });


module.exports = router;
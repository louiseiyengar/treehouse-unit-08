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
        c
    };
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
    } catch (error) {
        console.log(error);
    }
  });

/*
router.put('/:id', function(req, res, next){
  console.log(req.params);
  Article.findByPk(req.params.id).then(function(article) {
    if (article) {
      return article.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(article){
    res.redirect("/articles/" + article.id);
  }).catch(function(err) {
    if (err.name === "SequelizeValidationError") {
      var article = Article.build(req.body);
      article.id = req.params.id;
      res.render('articles/edit', {
        article: Article.build(req.body), 
        title: 'Edit Article',
        errors: err.errors
      });
    }n
  }).catch(function(err) {
    res.send(500);
  });
});
*/

  //get detail for single book
//   router.get('/:id', async (req, res, next) => {
//       const pageTitle = "Update Book";
//       console.log("are you here");
//       //res.render('update-book.pug', {pageTitle});
//     // const pageTitle = "Puddlie";
//     // await Book.findAll(
//     //     {attributes: ['title', 'author', 'genre', 'year'],
//     //      order: [["title", "ASC"]]
//     //     }
//     // ).then(function(allBooks) {
//     //     books = allBooks.map(book => book.toJSON());
//     //     res.render('index', {books, pageTitle});
//     // }).catch(function(err) {
//     //     res.send(500);
//     // });
//   });


module.exports = router;
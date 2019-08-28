const express = require('express');
const router = express.Router();

const db = require('../db');
const {Book} = db.models;
const { Op } = db.Sequelize;    //extract Op from db.Sequelize for db searches 

//global variables
//how many books should appear on the page for the 'all books' listing
const numRecsPerPage = 15;

//helper function

/**
 * This function will take a book object, and return the book object with the 
 * title, author, and genre properties formatted so that each word has only the first letter
 * capitalized.
 * @param {object} book object with user inputted properties (create and update input)
 * @return {object} book object with properties formatted so that each word has only first letter in uppercase.
*/
function cleanInput(book) {
    for(let key in book) {
        if (key !== 'year') {
            const bookPropArray = book[key].replace(/\s+/g, ' ')       //remove any extra spaces
                .split(' ')
                .map(word => {
                    let changeWord = word.toLowerCase();
                    return changeWord.charAt(0).toUpperCase() + changeWord.slice(1);   //uppercase first letter of each work
                });
            book[key] = bookPropArray.join(' ');
         } else {
             book[key] = book[key].replace(/\s+/g, '');     //replace any spaces in year field
         }
    }
    return book;
}

//Get listing of all books
router.get('/', async (req, res, next) => {
    const pageTitle = headTitle = "Books";
    const action = req.query.action;
    const title = req.query.title;
    const page = (req.query.page) ? (req.query.page - 1) : 0;   //get page form querystring to calculate offset
    const offset = page * numRecsPerPage;
    try {
        const allBooks = await Book.findAndCountAll(
            {attributes: ['id', 'title', 'author', 'genre', 'year'],
            offset: offset,
            limit: numRecsPerPage,
            order: [["title", "ASC"]]});
        const pageCount = Math.ceil(allBooks.count / numRecsPerPage);
        const books = allBooks.rows.map(book => book.toJSON());
        res.render('index', {books, pageCount, pageTitle, headTitle, action, title, page: page + 1, totalBooks: allBooks.count});
    } catch(err) {
        err.status = 500;
        err.message = "There was a database error retrieving the book listing."
        next(err);
    };
});

//Search list of books
router.post('/', async (req, res, next) => {
    try {
        const pageTitle = headTitle = "Books";
        const searchTerm = '%' + req.body.search + '%';
        const searchMessage = `Search Term: ${req.body.search}`
        const searchBooks = await Book.findAll(
            {attributes: ['id', 'title', 'author', 'genre', 'year'],
             where: {
                [Op.or]: [
                    { 
                        title: {[Op.like]: searchTerm}
                    },
                    {
                        author: {[Op.like]: searchTerm}
                    },
                    {
                        genre: {[Op.like]: searchTerm}
                    },
                    {
                        year: {[Op.like]: searchTerm}
                    }
                ]
              },
            order: [["title", "ASC"]]});
        let books = searchBooks.map(book => book.toJSON());
        books = (books.length < 1) ? '' : books;       //if no books, book variable is empty string.
        res.render('index', {books, pageTitle, headTitle, searchMessage});
    } catch (err) {
        err.status = 500;
        err.message = "There was a database error searching for your term."
        next(err);
    }
});

//Get form to input new book
router.get('/new', async(req, res, next) => {
    try {
        book = {};
        const pageTitle = headTitle = "New Book";
        res.render('new-book.pug', {pageTitle, headTitle});
    } catch (err) {
        err.status = 500;
        err.message = "There was an internal server error."
        next(err);
    }
});

//Create (Insert) a new book
router.post('/new', async(req, res, next) => {
    try {
        book = req.body;
        book = cleanInput(book);
        await Book.create({
            title: book.title,
            author: book.author,
            genre: book.genre,
            year: book.year
        });
        res.redirect(`/books?action=added&title=${encodeURI(book.title)}`);
    } catch (err) {
        if (err.name === "SequelizeValidationError") {
            const pageTitle = headTitle = "New Book";
            const errors = err.errors
            res.render('new-book.pug', {pageTitle, headTitle, errors});
        } else {
            err.status = 500;
            err.message = "There was a database error creating this book."
            next(err);
        }
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
        book = req.body;
        book = cleanInput(book);
        await oneBook.update({
            title: book.title,
            author: book.author,
            genre: book.genre,
            year: book.year
        }, { fields: ['title', 'author', 'genre', 'year']});
        res.redirect(`/books?action=updated&title=${encodeURI(book.title)}`);
    } catch (err) {
        if (err.name === "SequelizeValidationError") {
            const pageTitle = "Update / Delete Book";
            const book = {  id: req.body.id,
                            title: req.body.title, 
                            author: req.body.author, 
                            genre: req.body.genre,
                            year: req.body.year };
            const errors = err.errors
            res.render('update-book.pug', {pageTitle, book, errors});
        } else {
            err.status = 500;
            err.message = "There was a database error creating this book."
            next(err);
        }
    }
  });

  //Delete individual book
  router.delete('/:id', async(req, res,next) => {
      try {
        const oneBook = await Book.findByPk(req.params.id);
        const title = oneBook.title;
        await oneBook.destroy();
        res.redirect(`/books?action=deleted&title=${encodeURI(title)}`);
      } catch (err) {
        err.status = 500;
        err.message = "There was a database error when deleting this book."
        next(err);
      }
  });


module.exports = router;
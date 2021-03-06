const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const port = process.env.PORT || 3000;

//database connection and models
const db = require('./db');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//create a static route for public files
app.use('/static', express.static('public'));

//set up pug as template engine
app.set('view engine', 'pug');

//method-override for PUT and DELETE http calls
app.use(methodOverride('_method'));

//routes
const routes = require('./routes');
const bookRoutes = require('./routes/books');

app.use(routes);
app.use('/books', bookRoutes);

//For 404 - page not found error
app.use((req, res, next) => {
    const pageTitle = headTitle = 'Page Not Found';
    const err = new Error('Sorry! You requested a page that does not exist');
    err.status = 404;
    next(err);
});

//database sync and test connection
(async () => {
    await db.sequelize.sync();  //sync all models (tables) to database
    try {
        await db.sequelize.authenticate();
        console.log('Successful connection');
    } catch (err) {
        err.message = 'There was an error connecting to the database';
        err.status = 500;
        next(err);
    }
}) ();

//Error handler
app.use((err, req, res, next) => {
    console.log(`${err.message} / Status Error #: ${err.status}`);
    res.status(err.status || 500);
    if (err.status === 404) {
        pageTitle = headTitle = 'Page Not Found';
        res.render('page-not-found');
    } else {
        pageTitle = headTitle = "Internal Server Error";
        message = err.message;
        res.render('error', {pageTitle, headTitle, message});
    }
});

app.listen(port, () => {
    console.log(`The application is running on localhost:${port}`);
});
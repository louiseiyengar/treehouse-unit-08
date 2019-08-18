
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

//database and database models
const db = require('./db');
const { Book } = db.models;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//create a static route for public files
app.use('/static', express.static('public'));

//set up pug as template engine
app.set('view engine', 'pug');

app.use(methodOverride('_method'));

//routes
const routes = require('./routes');
const bookRoutes = require('./routes/books');

app.use(routes);
app.use('/books', bookRoutes);


 console.log("puddlie");
(async () => {
    await db.sequelize.sync();  //sync all models (tables) to database
    try {
        await db.sequelize.authenticate();
        console.log('Successful connection');
    } catch (error) {
        console.log("muddlie", error);
    }
}) ();

app.listen(3000, () => {
    console.log("The application is running on localhost:3000");
});
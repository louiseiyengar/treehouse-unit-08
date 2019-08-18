const Sequelize = require('sequelize');

//create a sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
//  logging: false
});

//create a db module to export
const db = {
    sequelize,
    Sequelize,
    models: {},
  };

  db.models.Book = require('./models/book.js')(sequelize);

  module.exports = db;
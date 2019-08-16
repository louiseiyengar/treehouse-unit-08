const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    Book.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false, // disallow null
            validate: {
                notNull: {
                    msg: 'Please provide a value for "title"'
                },
                notEmpty: {
                    msg: 'Please provide a value for "title"',
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false, // disallow null
            validate: {
                notNull: {
                    msg: 'Please provide a value for "author"'
                },
                notEmpty: {
                    msg: 'Please provide a value for "author"',
                }
            }
        },
        genre: {
            type: Sequelize.STRING
        },
        year: {
            type: Sequelize.INTEGER,
            validate: {
                isAfter: {
                    args: '1000',
                    msg: 'Please provide a value on or after 1000 for "year"'
                }
            }
        }
    }, { sequelize });

    return Book;
}
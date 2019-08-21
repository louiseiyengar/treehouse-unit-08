const Sequelize = require('sequelize');

//create Books model (table) and define fields
module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    Book.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false, // disallow null
            validate: {
                notNull: {
                    msg: 'Please provide a value for "Title"'
                },
                notEmpty: {
                    msg: 'Please provide a value for "Title"',
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false, // disallow null
            validate: {
                notNull: {
                    msg: 'Please provide a value for "Author"'
                },
                notEmpty: {
                    msg: 'Please provide a value for "Author"',
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
                    msg: 'Please provide a 4-digit date value on or after 1000 for "Year"'
                }
            }
        }
    }, { sequelize });

    return Book;
}
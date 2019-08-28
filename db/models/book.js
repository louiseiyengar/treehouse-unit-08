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
                    msg: 'Please provide a value for "Author"'
                }
            }
        },
        genre: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        year: {
            type: Sequelize.INTEGER,
            defaultValue: '',
            allowNull: true,
            validate: {
                //if year exists and is not a four digit integer, throw an error
                testEmptyOrInteger () {
                    if ((this.year) && (!(/^\d{4}$/.test(this.year)))) {
                        throw new Error('Leave the "Year" field blank or enter a 4-digit year');
                    }
                }
            }
        }
    }, { sequelize });

    return Book;
}
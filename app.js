const db = require('./db');
const { Book } = db.models;

console.log("puddlie");

(async () => {
    await db.sequelize.sync();
    try {
        await db.sequelize.authenticate();
        console.log('Successful connection');
    } catch (error) {
        console.log("muddlie", error);
    }
}) ();
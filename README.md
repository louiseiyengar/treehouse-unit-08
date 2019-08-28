# FSJS Project 8 - SQL Library Manager - Library Database Manager.

For this project, I used node.js, a SQLite database, the Sequelize ORM, the Express web application framework, and Pug for template rendering.  

This project displays all the books contained in a SQLite library database.  Each page will display 15 books, and page links are displayed at the bottom of the book list. A user can click a button to add a new book or click on a book title where the user will see a book detail page.  This page will give the user the option to update the title, author, genre, or date of the book record selected.  There is also a button with the option to delete the book selected.

In addition, there is a Search field which allows the user to search the title, author, genre and date fields for a term entered.  The search is case-insensitive and allows partial matches for strings.

======= Error Processing ==========================

If you request a page that doesn't exist or a project that doesn't exist, for example (localhost:3000/does-not-exist/) you will see both a 404 error page and a console.log message indicating there was a 404 error.

If the is also a 500 error page for all other errors -- problems connecting to the database, an attempt to select a book with an id not in the database, or other server errors.

======= Instuctions to view project locally =========
1) To run this project locally, you must have node.js and npm installed.
2) Download or clone the project from this repo.
3) The project uses the Express web application framework and Pug for template rendering. It also uses the SQLite database and the Sequelize ORM.  You will install these by running:
**npm install**
4) Run 
**npm start**
to start the server and application.  You should see the message: 'The application is running on localhost:3000'.
5) Enter 'localhost:3000' in the address bar of your browser, and you should see the web page below.

Screenshot of the SQL Library Manager page displaying first page of the display of all books:



require('dotenv').config()

const mongoose = require('mongoose')
const { faker } = require ('@faker-js/faker');
const {Author, Book} = require('./models')

// required to write in a file
const fs = require('fs')

// Global Variables
authorsData = [];   // to save authors' details in dummy.json file


/**
 * This function connects with database.
 * @param {String} uri: MONGODB secret connection key
 */

async function connectDb(uri) {

    await mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        console.log("Database Up and Running!")
    )
    .catch(err => console.log(err));

}


/**
 * This function first connects with database and then
 * drops the database collection.
 * @param {String} uri: MONGODB secret connection key
 */

async function resetDb(uri) {

    await mongoose
    .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    .then(async() => {
        await mongoose.connection.db.dropDatabase();
        console.log("Old Database Dropped!");
    })
    .catch(err => console.log(err));

}


/**
 * This function disconnects the database.
 */

async function disconnectDb() {

    await mongoose
    .connection.close()
    .then(() => {
        console.log("Database disconnected!");
    })
    .catch(err => console.log(err));

}


/**
 * This function stores Author details to dummy.json
 * file in local storage for dev purpose.
 */

async function createJSON() {

    fs.writeFile('./dummy.json', JSON.stringify(authorsData), () => {
        console.log("Authors' details added to dummy.json!");
    })

}



/**
 * This function generates and saves fake authors
 * in the database.
 * @param {Number} num: Number of authors to generate
 */

async function generateAuthors(num) {

    for (let i = 0; i < num; i++) {
        // using faker to generate following fields
        let _name = faker.name.findName();
        let _email = faker.internet.email();
        let _password = faker.random.alphaNumeric(12);
        let _phone = faker.phone.number('+## 9# #### ###');

        const author = new Author({
            name: _name,
            email: _email,
            phone: _phone,
            password: _password,
        })

        // to maintain a dummy file
        authorsData.push({
            name: _name,
            email: _email,
            phone: _phone,
            password: _password,
        },)
        await author.save()
        .then((authorRef) => {
            console.log(`Author: ${authorRef.name} created`)
        })
        .catch(err => console.log(err))
    }

};


/**
 * This function generates random numbers of
 * books for all the authors present in database.
 */

async function generateBooks () {

    const authors = await Author.find({});

    await Promise.all( authors.map( async (author) => {
        let bookId = [];
        for (let j = 0; j < Math.floor(Math.random() * authors.length) + 1; j++) {
            var _title = "";
            for (let k = 0; k < Math.floor(Math.random() * 3) + 1; k++) {
                _title = _title + faker.word.adjective() + " ";
            }

            const book = new Book({
                title: _title,
                author: author._id,
                like: []
            });

            await book.save()
                .then(bookRef => {
                    bookId.push(bookRef._id);
                    console.log(`${author.name} is the author of Book: "${bookRef.title.slice(0, -1)}"`);
                })
                .catch(err => console.log(err))
        }
        author.books = bookId;
        await author.save()
            .then(
                console.log(`Book Ids saved in ${author.name}'s list`)
            )
            .catch(err => console.log(err))
        })
    )

}


/**
 * This function randomly stores the id of author
 * in the Like array of the book.
 */

async function generateLikes () {
    const authors = await Author.find({});
    const books = await Book.find({});
    var list = [];
    authors.forEach(
        author => { list.push(author._id); }
    )
    await Promise.all( books.map( async(book) => {
            let data = [];
            // adding author id random times
            for (let j = 0; j < Math.floor(Math.random() * list.length) + 1; j++) {
                // choosing random author id
                let val = list[Math.floor(Math.random() * list.length) + 1]
                if (val != undefined)
                    data.push(val);
            }
            book.like = data;
            await book.save()
            .then(
                console.log(`People liked Book: ${book.title}`)
            )
            .catch(err => console.log(err))
        })
    )

}


/**
 * Main function to call other functions
 */

async function main() {
    await resetDb(process.env.MONGO_ADMIN_URI);
    await connectDb(process.env.MONGO_ADMIN_URI);
    await generateAuthors(10);
    await generateBooks();
    await generateLikes();
    await createJSON();
    await disconnectDb();
}

// Calling Main function
main();
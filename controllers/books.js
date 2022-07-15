const Book = require('../models/Book')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom-error')

const getAllBooks = asyncWrapper(async (req, res) => {
        const books = await Book.find({})
        res.status(201).json({books})
})

const createBook = asyncWrapper (async (req, res) => {
        const book = await Book.create(req.body)
        res.status(201).json({book})
})

const getBook = asyncWrapper (async (req, res, next) => {
        const {id: bookID} = req.params
        const book = await Book.findOne({ _id : bookID })
        if (!book) {
            return next(createCustomError(`No Book with id: ${bookID}`, 404))
            // return res.status(404).json({ msg: `No Book with id: ${bookID}`}
        }
        res.status(201).json({book})
})

const updateBook = asyncWrapper (async (req, res) => {
        const {id: bookID} = req.params
        const book = await Book.findOneAndUpdate({_id: bookID}, req.body, {
            new:true, 
            runValidators: true,
        })
        if (!book) {
            return next(createCustomError(`No Book with id: ${bookID}`, 404))
        }
        res.status(200).json({Book})
})

const deleteBook = asyncWrapper (async (req, res) => {
        const {id: bookID} = req.params
        const book = await Book.findOneAndDelete({ _id : bookID});
        if (!book){
            return next(createCustomError(`No Book with id: ${bookID}`, 404))
        }
    //    res.status(200).json({book})
        res.status(200).json({book:null , status: 'success',})
})




module.exports = {
    getAllBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook,
}

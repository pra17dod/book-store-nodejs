const Book = require('../models/Book')
const { NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const getAllBooks = async (req, res) => {
        const books = await Book.find({})
        res.status(StatusCodes.OK).json({books})
}

const createBook = async (req, res) => {
        const book = await Book.create(req.body)
        res.status(StatusCodes.CREATED).json({book})
}

const getBook = async (req, res, next) => {
        const {id: bookID} = req.params
        const book = await Book.findOne({ _id : bookID })
        if (!book) {
            return new NotFoundError(`No Book with id: ${bookID}`)
        }
        res.status(StatusCodes.OK).json({book})
}

const updateBook = async (req, res) => {
        const {id: bookID} = req.params
        const book = await Book.findOneAndUpdate({_id: bookID}, req.body, {
            new:true,
            runValidators: true,
        })
        if (!book) {
            return new NotFoundError(`No Book with id: ${bookID}`)
        }
        res.status(StatusCodes.OK).json({Book})
}

const deleteBook = async (req, res) => {
        const {id: bookID} = req.params
        const book = await Book.findOneAndDelete({ _id : bookID});
        if (!book){
            return new NotFoundError(`No Book with id: ${bookID}`)
        }
        res.status(StatusCodes.OK).json({book:null , status: 'success'})
}


module.exports = {
    getAllBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook,
}

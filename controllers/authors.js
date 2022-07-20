const { Author, Book } = require('../models')
const { StatusCodes } = require('http-status-codes')

const getAllAuthors = async (req, res) => {
    const data = await Author.find({})
    const ctx = []
    await Promise.all( data.map( async(author) => {
            ctx.push({
                _id : author._id,
                name: author.name,
                email: author.email,
                phone: author.phone,
                booksCount: author.books.length
            })
        })
    )
    res.status(StatusCodes.OK).json({authors : ctx})
}

const getAuthor = async (req, res, next) => {
    const {userId: authorId} = req.user
    const author = await Author.findById({ _id : authorId })
    const ctx = {
        _id : author._id,
        name: author.name,
        email: author.email,
        phone: author.phone,
        books : author.books
    }
    res.status(StatusCodes.OK).json({author: ctx})
}

const updateAuthor = async (req, res) => {
    const {userId: authorId} = req.user
    const author = await Author.findByIdAndUpdate({_id: authorId}, req.body, {
        new:true,
        runValidators: true,
    })
    res.status(StatusCodes.OK).json({author})
}

const deleteAuthor = async (req, res) => {
    const {userId: authorId} = req.user
    const author = await Author.findByIdAndRemove({ _id : authorId});
    if (!author) throw new NotFoundError (`No Author found with Id: ${authorId}`)
    await Book.deleteMany ({author: author._id})
    res.status(StatusCodes.OK).json({author:null , status: 'success',})
}

const getAuthorDetail = async (req, res) => {
    const {id: authorId} = req.params
    const author = await Author.findById({ _id : authorId })
    let bookList = []
    await Promise.all( author.books.map( async(bookId) => {
            const book = await Book.findOne({ _id: bookId })
            if (book) {
                bookList.push( {
                    _id: book._id,
                    title: book.title
                })
            }
        })
    )

    const ctx = {
        _id : author._id,
        name: author.name,
        email: author.email,
        phone: author.phone,
        books : bookList
    }
    res.status(StatusCodes.OK).json({author : ctx})
}

module.exports = {
    getAllAuthors,
    getAuthor,
    updateAuthor,
    deleteAuthor,
    getAuthorDetail
}

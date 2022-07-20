const { Author, Book } = require('../models')
const { NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const getAllBooks = async (req, res) => {
    const page = parseInt(req.query.page)-1 || 0
    const limit = parseInt(req.query.limit) || 5
    let sort = req.query.sort || "likes"

    req.query.sort? (sort = req.query.sort.split(',')) : (sort = [sort])

    let sortBy = {}
    if (sort[1]) sortBy[sort[0]] = sort[1]
    else sortBy[sort[0]] = "asc"

    const books = await Book.find({})
        .sort(sortBy)
        .skip(page*limit)
        .limit(limit);

    const totalBooks = await Book.countDocuments({})

    const ctx = {
        totalBooks,
        page: page + 1,
        limit,
        sortBy: sort,
        books
    }
    res.status(StatusCodes.OK).json(ctx)
}

const createBook = async (req, res) => {
    const book = await Book.create(req.body)
    const author = await Author.findById({_id: book.author})
    author.books.push(book._id)
    await author.save()
    res.status(StatusCodes.CREATED).json({book})
}

const getBook = async (req, res, next) => {
    const {id: bookId} = req.params
    const book = await Book.findOne({ _id : bookId })
    res.status(StatusCodes.OK).json({book})
}

const updateBook = async (req, res) => {
    const {id: bookId} = req.params
    const book = await Book.findOneAndUpdate({_id: bookId}, req.body, {
        new:true,
        runValidators: true,
    })
    res.status(StatusCodes.OK).json({book})
}

const deleteBook = async (req, res) => {
    const {id: bookId} = req.params
    const book = await Book.findByIdAndDelete({ _id: bookId})
    if (!book) throw new NotFoundError (`No Book found with Id: ${bookId}`)
    await Author.findByIdAndUpdate({_id: book.author}, {
        $pull: {
            books : bookId
        }
    })
    res.status(StatusCodes.OK).json({book:null , status: 'success'})
}

const likeBook = async (req, res) => {
    const {id: bookId} = req.params
    const authorId = req.user.userId
    const book = await Book.findByIdAndUpdate({_id: bookId}, {
        $addToSet: {
            likeBy: authorId
        }
    })
    book.likes = book.likeBy.length
    await book.save()
    const newBook = await Book.findById ({ _id: bookId})
    res.status(StatusCodes.OK).json({newBook})
}

const unlikeBook = async (req, res) => {
    const {id: bookId} = req.params
    const authorId = req.user.userId
    const book = await Book.findByIdAndUpdate({_id: bookId}, {
        $pull: {
            likeBy: authorId
        }
    })
    book.likes = book.likeBy.length
    await book.save()
    const newBook = await Book.findById ({ _id: bookId})
    await res.status(StatusCodes.OK).json({newBook})
}


module.exports = {
    getAllBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook,
    likeBook,
    unlikeBook
}

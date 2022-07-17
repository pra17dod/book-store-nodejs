const Author = require('../models/Author')
const { NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const getAllAuthors = async (req, res) => {
    const authors = await Author.find({})
    res.status(StatusCodes.OK).json({authors})
}

const getAuthor = async (req, res, next) => {
    const authorId = req.user.userId;
    const obj = await Author.findById({ _id : authorId })
    if (!obj) {
        console.log(Boolean(obj))
        return new NotFoundError(`No Author with id: ${authorId}`)
    }
    console.log(authorId)
    res.status(StatusCodes.OK).json({obj})
}

const updateAuthor = async (req, res) => {
    const authorId = req.user.userId;

    const author = await Author.findByIdAndUpdate({_id: authorId}, req.body, {
        new:true,
        runValidators: true,
    })
    res.status(StatusCodes.OK).json({author})
}

const deleteAuthor = async (req, res) => {
    const authorId = req.user.userId;
    const author = await Author.findByIdAndRemove({ _id : authorId});
    if (!author){
        return new NotFoundError(`No Author with id: ${authorId}`)
    }
    res.status(StatusCodes.OK).json({author:null , status: 'success',})
}




module.exports = {
    getAllAuthors,
    getAuthor,
    updateAuthor,
    deleteAuthor,
}

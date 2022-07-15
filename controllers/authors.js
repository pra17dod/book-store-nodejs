const Author = require('../models/Author')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom-error')

const getAllAuthors = asyncWrapper(async (req, res) => {
        const authors = await Author.find({})
        res.status(201).json({authors})
})

const getAuthor = asyncWrapper (async (req, res, next) => {
        const {id: authorID} = req.params
        const author = await Author.findOne({ _id : authorID })
        if (!author) {
            return next(createCustomError(`No Author with id: ${authorID}`, 404))
            // return res.status(404).json({ msg: `No Author with id: ${authorID}`}
        }
        res.status(201).json({author})
})

const updateAuthor = asyncWrapper (async (req, res) => {
        const {id: authorID} = req.params
        const author = await Author.findOneAndUpdate({_id: authorID}, req.body, {
            new:true, 
            runValidators: true,
        })
        if (!author) {
            return next(createCustomError(`No Author with id: ${authorID}`, 404))
        }
        res.status(200).json({author})
})

const deleteAuthor = asyncWrapper (async (req, res) => {
        const {id: authorID} = req.params
        const author = await Author.findOneAndDelete({ _id : authorID});
        if (!author){
            return next(createCustomError(`No Author with id: ${authorID}`, 404))
        }
    //    res.status(200).json({author})
        res.status(200).json({author:null , status: 'success',})
})




module.exports = {
    getAllAuthors,
    getAuthor,
    updateAuthor,
    deleteAuthor,
}

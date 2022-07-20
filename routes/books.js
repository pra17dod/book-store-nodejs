const express = require('express')
const router = express.Router()

const { getAllBooks, 
        createBook, 
        getBook, 
        updateBook, 
        deleteBook,
        likeBook,
        unlikeBook
    } = require('../controllers/books')

router.route('/').get(getAllBooks).post(createBook)
router.route('/:id').get(getBook).patch(updateBook).delete(deleteBook)
router.route('/like/:id').put(likeBook)
router.route('/unlike/:id').put(unlikeBook)

module.exports = router

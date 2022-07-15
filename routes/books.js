const express = require('express')
const router = express.Router()

const { getAllBooks, 
        createBook, 
        getBook, 
        updateBook, 
        deleteBook 
    } = require('../controllers/books')

router.route('/').get(getAllBooks).post(createBook)
router.route('/:id').get(getBook).patch(updateBook).delete(deleteBook)

module.exports = router

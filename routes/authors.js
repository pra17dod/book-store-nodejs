const express = require('express')
const router = express.Router()

const { getAllAuthors,
        getAuthor,
        updateAuthor,
        deleteAuthor
    } = require('../controllers/authors')

router.route('/').get(getAllAuthors)
router.route('/:id').get(getAuthor).patch(updateAuthor).delete(deleteAuthor)

module.exports = router

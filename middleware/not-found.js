const {StatusCodes} = require('http-status-codes')

const notFound = (req, res) => res.status(StatusCodes.NOT_FOUND).json({msg: 'Route doesn\'t exist.'})

module.exports = notFound

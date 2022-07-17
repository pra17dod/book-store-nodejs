const Author = require('../models/Author')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError} = require('../errors')

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // check if author is deleted or not, if deleted throw an error
    const author = await Author.findOne({ _id : payload.authorId })
    if (!author) {
      throw new UnauthenticatedError
    }
    // attach the author to the author and book routes
    req.user = { userId: payload.authorId, name: payload.name }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth

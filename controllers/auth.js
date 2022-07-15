const Author = require('../models/Author')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const author = await Author.create({ ...req.body })
  const token = author.createJWT()
  res.status(StatusCodes.CREATED).json({ author: { name: author.name }, token })
}


const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const author = await Author.findOne({ email })
  if (!author) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await author.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = author.createJWT()
  res.status(StatusCodes.OK).json({ author: { name: author.name }, token })
}

module.exports = {
  register,
  login,
}

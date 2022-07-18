const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authorSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide name'],
        minLength: 3,
        maxLength: 50,
    },
    email:{
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique: true,
    },
    phone:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: [true, 'Please provide password'],
        minLength: 8,
        // select: false,
    },
    books: {
        type: Array,
        of: mongoose.Schema.Types.ObjectId
    }
});

authorSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


authorSchema.methods.createJWT = function () {
    return jwt.sign(
      { authorId: this._id, name: this.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    )
}

authorSchema.methods.comparePassword = async function (canditatePassword) {
const isMatch = await bcrypt.compare(canditatePassword, this.password)
return isMatch
}

module.exports = mongoose.model("Author", authorSchema);
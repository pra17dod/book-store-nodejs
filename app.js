const express = require('express')
const app = express()

// security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')


const connectDB = require('./db/connect')
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error')
require('dotenv').config()

// middleware
app.set('trust proxy', 1)
app.use(rateLimit ({
    windowsMs: 15*60*1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowsMs
}))
app.use(express.static('public'))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())



// routes
app.get('/', (req, res)=>{
	res.send('Server is Running!')
})

const port = process.env.PORT || 3000
const host = "localhost"

const start = async ()=> {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, host, console.log(`Server is listening on ${host}:${port}...`))
    }
    catch (error) {
        console.log(error)
    }
}

start()

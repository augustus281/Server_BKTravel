require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require("cors")
const app = express();

require("./utils/passport")
require("./models/user.model")

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json()) 
app.use(express.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// init mysql
require('./database/connect.mysql')

// init redis
require('./database/connect.redis')
app.use(cors({ origin: 'http://localhost:3000' }));


// init routes
app.use('', require('./routes/index'))

app.use((error , req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})
  
module.exports = app

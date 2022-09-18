if (process.env.NODE_ENV !== 'production') { //check to ensure app is running in development environment
    require('dotenv').config() //loads from dotenv
}

const express = require('express') //import express
const app = express()
const expressLayouts = require('express-ejs-layouts') //import express layouts package
const bodyParser = require('body-parser') //easier to access the different access elements

const indexRouter = require('./routes/index') //import router into server using relative path
const authorRouter = require('./routes/authors') //import ALL AUTHORS router into server using relative path
const bookRouter = require('./routes/books') //import ALL BOOKS router into server using relative path

app.set('view engine', 'ejs') //set view engine to ejs
app.set('views', __dirname + '/views') //where server rendered views with come from
app.set('layout', 'layouts/layout') //every file put inside to prevent necessity of duplicating HTML and CSS files
app.use(expressLayouts) //tells app to use express layouts
app.use(express.static('public')) //tells app where all public files will come from
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })) //tells express how to use body-parser library; from body-parser

const mongoose = require('mongoose') // import Moongoose
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }) //string for URL from environment variables with options for MongoDB set up inside app
const db = mongoose.connection //check for connection to database
db.on('error', error => console.error(error)) //prints error to console if connection fails
db.once('open', () => console.log('We are connected to the database 🦩🦩🦩🦩🦩')) //prints when app is connected to database

app.use('/', indexRouter) //tell app to use route path and router to handle this route
app.use('/authors', authorRouter) //tell app to use ALL AUTHORS route path and router to handle this route
app.use('/books', bookRouter) //tell app to use ALL BOOKS route path and router to handle this route

app.listen(process.env.PORT || 3000) //pulls from environment variable for when app is deployed and which port it is listening to

//routes using MVC --> routes folder
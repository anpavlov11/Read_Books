const express = require('express') //import express variable
const router = express.Router() //router of express variable
const Book = require('../models/book')

router.get('/', async (req, res) => { //get action to get route of app (localhost:__); this is request and response
    let books
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', { books: books }) //response--render view
}) 

module.exports = router //exports router to be imported and user wherever the import is called; now can integrate routes with views
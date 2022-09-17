const express = require('express') //import express variable
const router = express.Router() //router of express variable
const Author = require('../models/author') //gives access to author model

//Authors Route
router.get('/', (req, res) => { //get action to get route of app (localhost:__); this is request and response
    res.render('authors/index') //response--render all authors view
})

//New Author
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author() }) //Author object; doesn't save anything to database but can be updated
})

//Create Author
router.post('/', (req, res) => {
    res.send('Create')
})

module.exports = router //exports router to be imported and user wherever the import is called; now can integrate routes with views
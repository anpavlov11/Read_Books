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
router.post('/', async (req, res) => { //using async,await will save time in more complex routes--update, ...
    const author = new Author ({
        name: req.body.name //explicitly tells the server which parameters to accept from the client
    })
    try {
        const newAuthor = await author.save() //await the asynchronous call to be completed (line 16)
        // res.redirect(`authors/${newAuthor.id}`)
            res.redirect(`authors`)

    } catch {
        res.render('authors/new', {
            author: author, //if an author name is entered again it will be repopulated back in to the value 
            errorMessage: 'Error creating author'
        })
    }
})

module.exports = router //exports router to be imported and user wherever the import is called; now can integrate routes with views
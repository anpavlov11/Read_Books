const express = require('express') //import express variable
const router = express.Router() //router of express variable
const Author = require('../models/author') //gives access to author model

//Authors Route
router.get('/', async (req, res) => { //get action to get route of app (localhost:__); this is request and response
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ' ') {   //.query used for url instead of .body like POST; GET req. info through url query string
        searchOptions.name = new RegExp(req.query.name, 'i') //RegExp allows searching for part of the text; 'i' case insensitive
    }
    try {
        const authors = await Author.find(searchOptions) //search authors
        res.render('authors/index', { //response--render all authors view
            authors: authors, 
            searchOptions: req.query 
        }) 
    } catch {
        res.redirect('/') //rerenders the page
    }
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
            res.redirect(`authors`) //rerenders the page
    } catch {
        res.render('authors/new', {
            author: author, //if an author name is entered again it will be repopulated back in to the value 
            errorMessage: 'Error creating author'
        })
    }
})

router.get('/:id', (req, res) => { //id variable called to be passed along with req
    res.send('Show Author ' + req.params.id) //paramas on req obj gives all params defined on url
})

router.get('/:id/edit', (req, res) => { //following REST principles on how to define urls
    res.send('Edit Author ' + req.params.id)
})

router.put('/:id', (req, res) => { //REST uses put to update
    res.send('Update Author ' + req.params.id)
})

router.delete('/:id', (req, res) => {
    res.send(('Delete Author ' + req.params.id))
})

module.exports = router //exports router to be imported and user wherever the import is called; now can integrate routes with views
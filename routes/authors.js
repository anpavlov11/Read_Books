const express = require('express') //import express variable
const router = express.Router() //router of express variable
const Author = require('../models/author') //access to author model
const Book = require('../models/book') //access to book model

//Authors Index Route
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
        const newAuthor = await author.save() //await the asynchronous call to be completed
        res.redirect(`authors/${newAuthor.id}`) //rerenders the page
    } catch {
        res.render('authors/new', {
            author: author, //if an author name is entered again it will be repopulated back in to the value 
            errorMessage: 'Error creating author'
        })
    }
})
//Show Route
router.get('/:id', async (req, res) => { //id variable called to be passed along with req
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(9).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})
//Edit Route
router.get('/:id/edit', async (req, res) => { //following REST principles on how to define urls
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors')
    }
})
//Update Route
router.put('/:id', async (req, res) => { //REST uses PUT to update
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name //changes name
        await author.save() //await the asynchronous call to be completed then save
        res.redirect(`/authors/${Author.id}`) //rerenders the page
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
        res.render('authors/edit', {
            author: author, //if an author name is entered again it will be repopulated back in to the value 
            errorMessage: 'Error updating author'
            })
        }
    }
})
//Delete Route
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove() //await the asynchronous call to be completed then delete
        res.redirect('/authors/') //rerenders the page
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
        res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router //exports router to be imported and user wherever the import is called; now can integrate routes with views
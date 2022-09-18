const express = require('express') //import express variable
const router = express.Router() //router of express variable
const multer = require('multer') //import multer pack variable
const path = require('path')
const fs = require('fs') //to delete book covers that generated because of error
const Author = require('../models/author') //access to author model
const Book = require('../models/book') //access to book model
const uploadPath = path.join('public', Book.coverImageBasePath) //access to path
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => { 
        callback(null, imageMimeTypes.includes(file.mimetype)) //only accept image files
    }
})

//Books Route
router.get('/', async (req, res) => { //get action to get route of app (localhost:__); this is request and response
    res.send('Books')
})

//New Book
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

//Create Book
router.post('/', upload.single('cover'), async (req, res) => { //using async,await will save time in more complex routes--update, ...
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book ({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch {
        if (book.coverImageName != null) { //calls code for removing the book cover; no name, no book cover
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName) { //removes the filename from bookCover folder
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err) //sends error to console instead of throwing irrelevant error to user
    }) 
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = { //params allows add dynamically if an error occurs
            authors: authors, 
            book: book
        }
        if (hasError) params.errorMessage = 'Book Entry Failed' //error handling
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

module.exports = router //exports router to be imported and used wherever the import is called; now can integrate routes with views
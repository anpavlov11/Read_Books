const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => { //prevents deleting an author associated with books in database
        if (err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error('This author is associated with books in the database'))
        } else { //if author is not associated with any books the author is deleted
            next()
        }
    })
})

module.exports = mongoose.model('Author', authorSchema)
const express = require('express') //import express variable
const router = express.Router() //router of express variable

router.get('/', (req, res) => { //get action to get route of app (localhost:__); this is request and response
    res.render('index') //response--render view
}) 

module.exports = router //exports router to be imported and user wherever the import is called; now can integrate routes with views
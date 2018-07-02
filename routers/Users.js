const 
    express = require('express'),
    passport = require('passport'),
    usersRouter = express.Router(),
    users = require('../controllers/UsersCtrl')

// index router
// show router
usersRouter.get('/signup', users.new) 
// create router
// edit router
// update router
// delete router


module.exports = usersRouter;
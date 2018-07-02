const 
    express = require('express'),
    passport = require('passport'),
    usersRouter = express.Router(),
    User = require('../controllers/UsersCtrl')

usersRouter.get('/signup', User.create) 

module.exports = usersRouter;
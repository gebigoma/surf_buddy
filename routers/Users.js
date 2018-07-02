const 
    express = require('express'),
    passport = require('passport'),
    usersRouter = express.Router(),
    users = require('../controllers/UsersCtrl')

usersRouter.get('/signup', users.new) 

module.exports = usersRouter;
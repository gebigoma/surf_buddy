const
    express = require('express'),
    passport = require('passport'),
    commentsRouter = new express.Router(),
    commentController = require('../controllers/commentController') 

commentsRouter.post('/spots/:spot_id/comments', isLoggedIn,  commentController.create)

commentsRouter.delete('/comments/:id', isLoggedIn, commentController.destroy)

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/users/login')
    }

module.exports = commentsRouter
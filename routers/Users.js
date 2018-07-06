const
 express = require('express'),
 passport = require('passport'),
 usersRouter = new express.Router(),
 Users = require('../controllers/userController')
 

// render login view
usersRouter.get('/login', (req, res) => {
    res.render('login')
})

usersRouter.post('/login', passport.authenticate('local-login', {
 successRedirect: '/users/profile/edit',
 failureRedirect: '/users/login'
}))

// render signup view
usersRouter.get('/signup', (req, res) => {
 res.render('signup', { message: "success"})
})

usersRouter.post('/signup', passport.authenticate('local-signup', {
 successRedirect: '/users/profile/edit',
 failureRedirect: '/users/signup'
}))

usersRouter.get('/profile', isLoggedIn, (req, res) => {
//  Post.find({ _by: req.user._id}, (err, userPosts) => {
   res.render('profile', { user: req.user })
 })
 // res.render('profile', { user: req.user }, { message: req.flash('profileMessage')})
// })

usersRouter.get('/logout', (req, res) => {
 req.logout()
 res.redirect('/')
})

usersRouter.get('/profile/edit', isLoggedIn, (req, res) => {
 res.render('editProfile')
}) 

usersRouter.delete('/profile', isLoggedIn, (req, res) => {
  req.user.remove((err, removedUser) => {
    res.redirect('/users/logout')
  })  
})

usersRouter.patch('/profile', isLoggedIn, (req, res) => {
    console.log("HIT")
 if(!req.body.password) delete req.body.password
 Object.assign(req.user, req.body)
 req.user.save((err, updatedUser) => {
   if(err) return console.log(err)
   res.redirect('/users/profile')
 })
})

usersRouter.delete('/profile', isLoggedIn, (req, res) => {
    req.user.remove((err, removedUser) => {
      res.redirect('/users/logout')
    })  
})
///////////////////



function isLoggedIn(req, res, next) {
 if(req.isAuthenticated()){
   return next()
 }
 res.redirect('/users/login')
}

module.exports = usersRouter
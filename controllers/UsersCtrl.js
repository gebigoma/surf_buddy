const 
    User = require('../models/User')


// show controller

    exports.new = (req, res) => {
    User.find({}, (err, user) => {
        if(err) res.json({status: "FAIL", payload: err})
        res.json({status: 'SUCCESS', payload: user})
    })
}


// create controller


// patch controller


// delete controller






// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()) return next()
//     res.redirect('#')
// } 


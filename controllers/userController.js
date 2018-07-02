const User = require('../models/User')

exports.index = (req, res) => {
    User.find({}, (err, users) => {
        if(err){
            res.render('Users', {status: "FAIL", payload: err})
        }else{
            res.render('Users', {status: "SUCCESS", payload: users})
        }
    })
}
exports.show = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            res.send(err)
        } else {
            res.render('User', {status: "SUCCESS", payload: user})
        }
    })
} 


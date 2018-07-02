const User = require('../models/User')

exports.index = (req, res) => {
    Host.find({}, (err, hosts) => {
        if(err){
            res.render('Hosts', {status: "FAIL", payload: err})
        }else{
            res.render('Hosts', {status: "SUCCESS", payload: hosts})
        }
    })
}
exports.show = (req, res) => {
    Host.findById(req.params.id, (err, host) => {
        if(err){
            res.send(err)
        } else {
            res.render('Host', {status: "SUCCESS", payload: host})
        }
    })
} 

exports.create = (req, res) => {
    User.create(req.body, (err, newUser) => {
        if(err) {
            res.json({status: "Failed", err})
        }
        else {
            res.redirect("/users")
        }
    })
}

exports.delete = (req, res) => {
    let { id } = req.params;
    User.findByIdAndRemove(id, (err, deletedUser) => {
        if (err){
            res.redirect('/users');
        }
        else {
            res.redirect('/users');
        }
    })
}

exports.newUser = (req, res) => {
    res.render('new')
}
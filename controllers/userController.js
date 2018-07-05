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

exports.edit = (req, res) => {
    User.findById(req.params.id, (err, userFromDB) => {
      if (err) {
        res.render('Edit', { status: "FAIL", payload: err })
      } else {
        res.render('Edit', {status: "SUCCESS", payload: userFromDB })
      }
    })
  }


exports.newUser = (req, res) => {
    res.render('new')
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
  
  exports.update = (req, res) => {
    let { id } = req.params
    User.findByIdAndUpdate(id, { $set: req.body }, {new: true }, (err, userFromDB) => {
      if (err) {
        res.redirect('/users')
      } else {
        res.render('User', {status: "SUCCESS", payload: userFromDB })
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

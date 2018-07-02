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

exports.edit = (req, res) => {
    User.findById(req.params.id, (err, userFromDB) => {
      if (err) {
        res.render('Edit', { status: "FAIL", payload: err })
      } else {
        res.render('Edit', {status: "SUCCESS", payload: userFromDB })
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
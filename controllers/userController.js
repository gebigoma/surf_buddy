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


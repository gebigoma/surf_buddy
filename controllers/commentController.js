const Comment = require('../models/Comment')

exports.create = (req, res) => {
    Comment.create({...req.body, _by: req.user, spot_id: req.params.spotId}, (err, newComment) => {
        if(err) {
            res.json({status: "Failed", err})
        }
        else {
            res.redirect("/")
        }
    })
} 


exports.destroy = (req, res) => {
    let { id } = req.params;
    Comment.findByIdAndRemove(id, (err, deletedComment) => {
        if (err){
            res.redirect('/');
        }
        else {
            res.redirect('/');
        }
    })
}
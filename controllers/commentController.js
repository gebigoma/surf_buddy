const Comment = require('../models/Comment')

exports.create = (req, res) => {
    console.log(req.params.spot_id)
    Comment.create({...req.body, _by: req.user, spot_id: req.params.spot_id}, (err, newComment) => {
        if(err) {
            res.json({status: "Failed", err})
        }
        else {
            res.redirect(`/spots/`)
        }
    })
} 


exports.destroy = (req, res) => {
    let { id } = req.params;
    Comment.findByIdAndRemove(id, (err, deletedComment) => {
        if (err){
            res.redirect(`/spots/`);
        }
        else {
            res.redirect("/spots/:spot_id");
        }
    })
}
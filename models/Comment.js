const
    mongoose = require('mongoose'),
    commentSchema = new mongoose.Schema({
    title: String, 
    _by: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    body: String,
    spot_id: Number
}) 

module.exports = mongoose.model('Comment', commentSchema)

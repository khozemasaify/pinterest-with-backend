const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/pinterestlasttime")
const plm = require("passport-local-mongoose")
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  posts: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }],
  dp: {
    type: String // Assuming you store the URL of the display picture
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  },
  profileImage:String
});
userSchema.plugin(plm)

// Create the User model
module.exports  = mongoose.model('User', userSchema);


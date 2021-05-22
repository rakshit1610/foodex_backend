var mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isverified: {
        type: String,
        required: true,
      },
    name: {
        type: String,
        required: true,
      },
    followers:{
        type: Number,
        required: false,
    },
    following:{
        type: Number,
        required: false,
    },
    post_count:{
        type: Number,
        required: false,
    },
    image_user:{
        type:String,
        required:false
    },
    followings:[{
        type:ObjectId,
        ref:"Users"
    
        }],
    followers:[{
        type:ObjectId,
        ref:"Users"
    }],
    bookmarks:[{
        type:ObjectId,
        ref:"Recipes"
    }]

});


module.exports = mongoose.model('Users', UserSchema); 
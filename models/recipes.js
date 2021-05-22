var mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({

    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    veg: {
        type: Boolean,
        required: false,
    },
    img:{
        type:String,
        required:false
    },
    cook_time:{
        type: Number,
        required:true
    },
    read_time:{
        type: Number,
        required:false
    },
    category:{
        type:String,
        required:false
    },
    ingredients:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:false
    },
    ownerId:{
        type:String,
        required:false
    },
    likes:[{
    type:ObjectId,
    ref:"Users"

    }],

});


module.exports = mongoose.model('Recipes', RecipeSchema); 

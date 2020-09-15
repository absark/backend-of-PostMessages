const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please enter the title ']
    },
    content:{
        type:String,
        required:[true,'Please enter the content ']
    },
    imagePath:{
        type:String
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', // here we telling to mongoose that we store the id belongs to User model
        required:[true]   
    }
});

const Post = mongoose.model('Post',postSchema);
module.exports = Post;
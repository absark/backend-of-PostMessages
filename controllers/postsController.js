const Post = require('../models/postsModel');
const multer = require('multer');

const MIME_TYPE = {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpg'
}
const Storage =  multer.diskStorage({
    destination:(req,file,cb)=>{
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid) error = null;
        cb(error,'images');
    },
    filename:(req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ ext);
    }
});

exports.upload = multer({storage:Storage});

exports.addedPost = (req,res,next)=>{
    const url = req.protocol+'://'+req.get('host');
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url+'/images/'+req.file.filename,
        creator:req.userId
    });
    post.save().then(doc=>{
     res.status(201).json({
         post:{
             imagePath:doc.imagePath,
             id:doc._id
         }
     });
    })
    .catch(err=>{
        res.status(500).json({
            message:'Failed to create the post'
        })
    });
};

exports.getAllPosts = (req,res,next)=>{
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery.skip(pageSize*(currentPage-1))
                 .limit(pageSize);
    }
        postQuery.then(posts=>{
        fetchedPosts = posts;
        return Post.countDocuments();
        })
        .then(count=>{
            res.status(200).json({
                status:'success',
                posts:fetchedPosts,
                count
            });
        })
        .catch(err=>{
                res.status(500).json({
                    message:'Failed to fetching the posts'
                })
            });

};

exports.getEditPost = (req,res,next)=>{
        Post.findById(req.params.id).then(doc=>{
        if(doc) res.status(200).json(doc);
        if(!doc) res.status(404).json({message:'Not found'});
        }).catch(err=>{
        res.status(500).json({
            message:'Failed to fetching the post'
            })
        });
};

exports.deletePost = (req,res,next)=>{
         Post.deleteOne({_id:req.params.id,creator:req.userId})
        .then(doc=>{
              if(doc.nModified>0){
                    res.status(201).json({
                    status:'deleted!'
                    })
               }else{
                    res.status(401).json({
                    message:'Not authorize to delete the post'
                })
               }
        })
        .catch(err=>{
               res.status(500).json({
                message:'Failed to delete the posts'
            })
        });
};

exports.updatePost = (req,res,next)=>{
    let imagePath;
    const url = req.protocol+'://'+req.get('host');
    if(req.file){imagePath = url+'/images/'+req.file.filename;}
    else{imagePath = req.body.imagePath;}

  Post.updateOne({_id:req.params.id,creator:req.userId},
        {
            title:req.body.title,
            content:req.body.content,
            imagePath:imagePath
        }).then(doc=>{
           if(doc.n>0){
            res.status(201).json({
                status:'success',
                id:doc._id
            })
           }else{
            res.status(401).json({
                message:'Not authorize to update the post'
            })
           }
    })
    .catch(err=>{
        res.status(500).json({
            message:'Failed to update the posts'
        })
    });
}
const express = require('express');
const postController = require('../controllers/postsController');
const userController = require('../controllers/userController');
const router = express.Router();
router.get("",userController.protect,postController.getAllPosts);
router.post('',
              userController.protect,
              postController.upload.single('image'), 
              postController.addedPost
              );
router.route('/:id')
      .delete(userController.protect,postController.deletePost)
      .get(userController.protect,postController.getEditPost)
      .patch(
            userController.protect,
            postController.upload.single('image'),
            postController.updatePost
            );

module.exports = router;
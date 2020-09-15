const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
//router.get("",userController.getUser);
router.post('/signup',userController.signUp);
router.post('/login',userController.login);
// router.route('/:id')
//       .delete(postController.deletePost)
//       .get(postController.getEditPost)
//       .patch(postController.upload.single('image'),postController.updatePost);

module.exports = router;
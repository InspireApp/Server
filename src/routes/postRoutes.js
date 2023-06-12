import express from 'express';
import { createPosts, deletePost, getOnePost, getTimeLinePost, likePost, updatePost } from '../controllers/postController.js';
import { userAuthJwt } from '../middlewares/auth.js';

const router = express.Router();

router.post('/createPost', userAuthJwt, createPosts);
router.get('/getOnePost/:postId', userAuthJwt, getOnePost);
router.patch('/updateOnePost/:userId', userAuthJwt, updatePost);
router.delete('/deleteOnePost/:userId', userAuthJwt, deletePost);
router.patch('/likePost/:userId', userAuthJwt, likePost);
router.get('/timelinePost/:userId', userAuthJwt, getTimeLinePost);


export { router as postRouter };
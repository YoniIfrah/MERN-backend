import express from 'express'
const router = express.Router();
import post from '../controllers/post'
import auth from '../controllers/auth'

router.get('/', auth.authenticaticatedMiddleware, post.getAllPosts)

router.get('/:id', auth.authenticaticatedMiddleware, post.getPostById)

router.post('/', auth.authenticaticatedMiddleware, post.addNewPost)

router.put('/:id', auth.authenticaticatedMiddleware, post.putPostById)


export = router;
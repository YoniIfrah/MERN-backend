import express from 'express'
const router = express.Router();
import post from '../controllers/post'

router.get('/', post.getAllPosts)

router.post('/', post.addNewPost)

router.get('/:id', post.getPostById)

router.put('/:id', post.putPostById)


export = router;
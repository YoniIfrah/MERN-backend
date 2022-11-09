const express = require('express');
const router = express.Router();
const post = require('../controllers/post.js')

router.get('/', post.getAllPosts)

router.post('/', post.addNewPost)

router.get('/:id', post.getPostById)

router.put('/:id', post.putPostById)


module.exports = router;
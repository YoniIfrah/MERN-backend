import myError from '../common/Error'
import myResponse from '../common/Response'
import myRequest from '../common/Request'
import Post from '../models/post_model'
import { Request, Response } from 'express'

const getAllPostsEvent = async () => { 
    console.log("Entered getAllPostsEvent")
    try{
        const posts = await Post.find()
        return {status: 'OK', data: posts}
    }catch(err){
        return {status: 'FAIL', data: ""}
    }
}

const getAllPosts = async (req:Request, res:Response) => {
    try {
        let posts = {}
        if (req.query.sender == null){
            posts = await Post.find()   
        } else {
            posts = await Post.find({'sender': req.query.sender})
        }
        posts = await Post.find()
        res.status(200).send(posts)
    } catch (error) {
        console.log("fail to get posts in db")
        res.status(400).send({ "error": error.message})
    }    
}

const addNewPost = async (req:myRequest) => {
    console.log("this is the request body: ", req.body);

    const post = new Post({
        message:req.body.message,
        sender:req.body.sender
    })

    try {
        //need to do this to the rest of the API in this file
        const newPost = await post.save()
        // console.log('save post in db')
        // res.status(200).send(newPost)
        return new myResponse(newPost, req.userId, null)
    } catch (error) {
        // console.log("fail to save post in db")
        // res.status(400).send({ "error": error.message})
        const myRes = new myResponse(null, post.sender, new myError(400, error.message))
    }

} 

const getPostById = async (req:Request , res:Response) => {
    const id = req.params.id
    console.log('getPostById: ', id)
    if ( id == '12345'){
        console.log('stop')
    }
    if ( id == null || id == undefined ) {
        res.status(400).send({
            'status': 'fail',
            'message': 'null or undefined'
        })
    }
    try {
        const posts = await Post.findById(id)
        res.status(200).send(posts)

    } catch (error) {
        res.status(400).send({
            'status': 'fail',
            'message': error.message
        })
        // const myRes = new myResponse(null, id, new myError(400, error.message))
        // myRes.sendRestResponse(res)
    }

}

const putPostById = async (req:Request, res:Response) => {
    const id = req.params.id
    console.log('putPostById: ', id)
    if ( id == null || id == undefined ) {
        res.status(400).send({
            'status': 'fail',
            'message': 'id is null or undefined',
        })
    }
    try {
        const posts = await Post.findByIdAndUpdate({'_id':id}, req.body).then(() =>{
            Post.findOne({'_id':id}).then((posts) =>{
                res.status(200).send(posts)
            })
        })

    } catch (error) {
        res.status(400).send({
            'status': 'fail',
            'message': error.message
        })
    }

}

export = {getAllPosts, addNewPost, getPostById, putPostById, getAllPostsEvent}
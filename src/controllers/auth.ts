import User from '../models/user_model'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'


function sendError(res: Response, error: String) {
    res.status(400).send({
        'err':error,
    })
}

/**
 **explain for registration**
 1.Check if the user is valid
 2.Check if the user is not already registered
 3.Encrypt the password
 4.Save new user to the DB
 5.return response
 */

const register = async (req:Request, res:Response) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password){
        return sendError(res, 'please provide valid email/password')
    }
    try{
        const user = await User.findOne({'email': email})
        if(user != null){
            return sendError(res, 'user already exists')
        }
    }catch(err){
        console.log('Error:', err)
        sendError(res, 'fail checking user')
    }

    try{
        const salt = await bcrypt.genSalt(10)
        const encryptedPwd = await bcrypt.hash(password, salt)
        let newUser = new User({
            'email': email,
            'password': encryptedPwd
        })
        newUser = await newUser.save()
        res.status(200).send(newUser)
    }catch(error){
        console.log('Error:', error)
        sendError(res, 'fail checking user pw')
    }
} 

/**
 **explain for login**
 1.Check if email and password are valid
 2.Check if the user exists in the DB
 3.Check if password match
 */
const login = async (req:Request, res:Response) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password){
        return sendError(res, 'please provide valid email/password')
    }
    try{
        const user = await User.findOne({'email': email})
        if(user == null){
            return sendError(res, 'incorrect user or password')
        }
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return sendError(res, 'incorrect user or password')
        }
        const accessToken = await jwt.sign(
            {'_id': user._id},
            process.env.ACCESS_TOKEN_SECRET,
            { 'expiresIn' :process.env.JWT_TOKEN_EXPIRATION}
        )

        // in the end of the block
        res.status(200).send({'accessToken':accessToken})
    }
    catch(err){
        console.log('Error:', err)
        sendError(res, 'fail checking user')
    }
}

const logout = async (req:Request, res:Response) => {
    res.status(400).send({
        'status':'fail',
        'message': 'not implemented'
    })

} 
const authenticaticatedMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization']
    if (authHeader ==null || authHeader == undefined){
        return sendError(res, 'authHeader is null/undefined')
    }
    const token = authHeader.split(' ')[1]
    if(token == null){
        return sendError(res, 'auth us missing')
    }
    try {
        const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        //@TODO: fix this
        //req.userId = user._id
        console.log("token user:", user)
        next()
    } catch(err){
        return sendError(res, 'validation failed token')
    }
}

export = {login, register, logout, authenticaticatedMiddleware}
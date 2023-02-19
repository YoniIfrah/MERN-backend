/* eslint-disable @typescript-eslint/no-unused-vars */
import User from '../models/user_model'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'


/**
 * Helpers methods & variables
 */
function sendError(res: Response, error: string) {
    res.status(400).send({
        'err':error,
    })
}
function getTokenFromReq(req:Request): string {
    //RETURN WITHOUT THE JWT STRING - ONLY THE REFRESH TOKEN
    const authHeader = req.headers['authorization']
    if (authHeader == null) return null
    return authHeader.split(' ')[1] 
}
async function generateTokens(userId:string){
    const accessToken = await jwt.sign(
        {'id': userId},
        process.env.ACCESS_TOKEN_SECRET,
        {'expiresIn':process.env.JWT_TOKEN_EXPIRATION}
    )
    const refreshToken = await jwt.sign(
        {'id': userId},
        process.env.REFRESH_TOKEN_SECRET,
    )
    
    return {'accessToken':accessToken, 'refreshToken':refreshToken}
}
type TokenInfo = {
    id: string
}
// end of helpers methods & variables

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
            'password': encryptedPwd,
        })


        newUser = await newUser.save()
        res.status(200).send(newUser)
    }catch(error){
        console.log('Error:', error)
        sendError(res, 'fail checking user pw')
    }
    console.log("register successfully")

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
        const tokens = await generateTokens(user['_id'].toString())

        if(user.refresh_tokens == null){
            user.refresh_tokens = [tokens.refreshToken]
        } else {
            user.refresh_tokens.push(tokens.refreshToken)
        }
        await user.save()
        const newObj = Object.assign(tokens, { email: email });//passed unit test
        // in the end of the block
        console.log("login successfully")
        console.log(newObj)
        res.status(200).send(newObj)
    }
    catch(err){
        console.log('Error:', err)
        sendError(res, 'fail checking user')
    }
}

const refresh = async (req:Request, res:Response) => {

    const refreshToken = getTokenFromReq(req)
    if (refreshToken == null) return sendError(res,'authentication missing')

    try {
        const user: TokenInfo = <TokenInfo>jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userObj = await User.findById(user['id'])// NEED TO BE user._id
        if (!userObj)    return sendError(res, 'fail validating token')        

        if (!userObj.refresh_tokens.includes(refreshToken)){
            userObj.refresh_tokens = []
            await userObj.save()
            return sendError(res, 'fail validating token')
        }
        const tokens = await generateTokens(user['id'])

        userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)] = tokens['refreshToken'] 

        await userObj.save()

        return res.status(200).send(tokens)

    } catch(err){
        return sendError(res, 'validation failed token')
    }
}

/**
 **explain for logout**
 in logout the user needs to provide the refresh token
 if the token is valid just invalidate it
 else, invalidate all user tokens
 */
const logout = async (req:Request, res:Response) => {
    const refreshToken = getTokenFromReq(req)
    console.log(refreshToken, "refresh token FROM LOGOUTTT")
    if (refreshToken == null) {
        console.log("auth is missing")
        return sendError(res,'authentication missing')
    }

    try{
        const user:TokenInfo = <TokenInfo>jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        const userObj = await User.findById(user.id)
        if (userObj == null) return sendError(res,'fail validating token')

        if (!userObj.refresh_tokens.includes(refreshToken)){
            userObj.refresh_tokens = []
            await userObj.save()
            return sendError(res,'fail validating token')
        }

        userObj.refresh_tokens.splice(userObj.refresh_tokens.indexOf(refreshToken),1)
        await userObj.save()
        console.log("logout successfully")
        return res.status(200).send()
    }catch(err){
        console.log(err)
        return sendError(res,'fail validating token')
    }
}

const authenticaticatedMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const token =  getTokenFromReq(req)
    if(token == null){
        return sendError(res, 'auth us missing')
    }
    try {
        const user: TokenInfo = <TokenInfo> jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.body.userId = user['_id']
        console.log("token user:", user)
        next()
    } catch(err){
        return sendError(res, 'validation failed token')
    }
}

const changePassword = async (req:Request, res:Response) => {
    console.log("change password called")
    const email = req.params.email;
    const password = req.body.password
    // res.status(200).send({"newPassword":password})

    if (!email || !password){
        return sendError(res, 'please provide valid email/password')
    }
    try {
        // eslint-disable-next-line prefer-const
        let user = await User.findOne({'email': email})
        if(user == null){
            return sendError(res, 'invalid user')
        }
        const salt = await bcrypt.genSalt(10)
        const encryptedPwd = await bcrypt.hash(password, salt)
        const result = await User.updateOne(
            {email: email}, 
            { $set: { password: encryptedPwd } }
        )
        console.log(`Updated ${result.modifiedCount} user(s).`);

        res.status(200).send({"newPassword":password})

    } catch (error) {
        console.log('Error at changePassword:', error)
    }
}

export = {login, refresh, register, logout, authenticaticatedMiddleware, changePassword}
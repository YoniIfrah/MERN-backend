import Error from "./Error"
import { Response } from 'express'

class myResponse{ 
    body: object;
    userId: String;
    err:Error;

    constructor(body:object = {}, userId:String = 'unknown', err?:Error) {
        this.body = body
        this.userId = userId
        this.err = err        
    }
    sendRestResponse(res:Response){
        if (this.err == null) {
            res.status(200).send({ 'status': 'ok', 'post': this.body })
        } else { 
            res.status(this.err.code).send({
            'status': 'fail',
            'message': this.err.message 
            })
        } 
    }
}
export = myResponse
  
import myError from "./Error"
import { Response } from 'express'

class myResponse{ 
    body: any;
    userId: String;
    params: any;
    err:myError;

    constructor(body:any = {}, userId:String = 'unknown', params=null ,err?:myError) {
        this.body = body
        this.userId = userId
        this.params = params
        this.err = err
    }
    sendRestResponse(res:Response){
        if (this.err == null) {
            res.status(200).send(this.body)
            // res.status(200).send({ 'status': 'ok', 'message': this.body.message, 'sender': this.body.sender, '_id':this.userId })
        } else { 
            res.status(this.err.code).send({
            'status': 'fail',
            'message': this.err.message 
            })
        } 
    }
}
export = myResponse
  
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import myError from "./Error"
import { Response } from 'express'

class myResponse{ 
    body: any;
    userId: String = 'unknown user';
    params: any;
    err:myError;

    constructor(body:any = {}, userId?:String, params?:any ,err?:myError) {
        this.body = body
        this.userId = userId
        this.params = params
        this.err = err
    }
    sendRestResponse(res:Response){
        if (this.err == null || this.err == undefined) {
            res.status(200).send(this.body)
        } else { 
            res.status(this.err.code).send({
            'status': 'fail',
            'message': this.err.message 
            })
        } 
    }
}
export = myResponse
  
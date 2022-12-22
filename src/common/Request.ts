import { Request } from 'express'


class myRequest{ 
    body:object;
    userId:string; 
    constructor(body: object = {} ,userId: string = 'unknown'){
        this.body = body
        this.userId = userId
    }
    //cons
    static fromRestRequest(req: Request){ 
        console.log("req.params.userid = ", req.params.userid)
        return new myRequest(req.body, req.params.userid)
    }
}
export = myRequest
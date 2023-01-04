import { Request } from 'express'


class myRequest{ 
    body:any;
    userId:string;
    params: any;
    constructor(body: any = {} ,userId: string = 'unknown', params=null){
        this.body = body
        this.params = params
        this.userId = userId
    }
    //cons
    static fromRestRequest(req: Request){ 
        console.log("req.params.userid = ", req.params.userid)
        return new myRequest(req.body, req.params.userid,  req.params)
    }
}
export = myRequest
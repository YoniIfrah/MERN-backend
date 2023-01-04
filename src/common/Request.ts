import { Request } from "express";

class myRequest{ 
    body:any;
    userId:string | null;
    params: any;
    query:any;
    constructor(body: any = {} ,userId: string|null = null, params=null, query=null){
        this.body = body
        this.userId = userId == null ? params.id : userId
        this.params = params
        this.query = query
    }
    static fromRestRequest(req:Request){ 
        console.log("req.params.userid = ", req.params.userid)
        return new myRequest(req.body, req.params.userid, req.params, req.query)
    }
}
export = myRequest
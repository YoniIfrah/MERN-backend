"use strict";
class myRequest {
    constructor(body = {}, userId = 'unknown') {
        this.body = body;
        this.userId = userId;
    }
    //cons
    static fromRestRequest(req) {
        console.log("req.params.userid = ", req.params.userid);
        return new myRequest(req.body, req.params.userid);
    }
}
module.exports = myRequest;
//# sourceMappingURL=Request.js.map
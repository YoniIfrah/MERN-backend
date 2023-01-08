"use strict";
class myRequest {
    constructor(body = {}, userId = null, params = null, query = null) {
        this.body = body;
        this.userId = userId == null ? params.id : userId;
        this.params = params;
        this.query = query;
    }
    static fromRestRequest(req) {
        console.log("req.params.userid = ", req.params.userid);
        return new myRequest(req.body, req.params.userid, req.params, req.query);
    }
}
module.exports = myRequest;
//# sourceMappingURL=Request.js.map
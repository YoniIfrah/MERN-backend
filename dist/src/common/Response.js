"use strict";
class myResponse {
    constructor(body = {}, userId, params, err) {
        this.userId = 'unknown user';
        this.body = body;
        this.userId = userId;
        this.params = params;
        this.err = err;
    }
    sendRestResponse(res) {
        if (this.err == null || this.err == undefined) {
            res.status(200).send(this.body);
        }
        else {
            res.status(this.err.code).send({
                'status': 'fail',
                'message': this.err.message
            });
        }
    }
}
module.exports = myResponse;
//# sourceMappingURL=Response.js.map
"use strict";
class myResponse {
    constructor(body = {}, userId = 'unknown', err) {
        this.body = body;
        this.userId = userId;
        this.err = err;
    }
    sendRestResponse(res) {
        if (this.err == null) {
            res.status(200).send(this.body);
            // res.status(200).send({ 'status': 'ok', 'message': this.body.message, 'sender': this.body.sender, '_id':this.userId })
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rp = require("request-promise");
function parseRequest(baseUrl, appId, masterKey, method, endpoint, body) {
    var request = rp({
        method: method,
        uri: baseUrl + '/' + endpoint,
        body: body,
        headers: {
            'X-Parse-Application-Id': appId,
            'X-Parse-Master-Key': masterKey,
            'Content-Type': 'application/json'
        },
        json: true
    });
    return request;
}
exports.default = parseRequest;

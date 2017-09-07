"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var parse_request_1 = require("./parse-request");
var minimist = require("minimist");
var fs = require("fs-extra");
var argv = minimist(process.argv.slice(2));
function getArgumentOrDie(name) {
    var arg = argv[name];
    if (arg) {
        return arg;
    }
    else {
        console.error("Missing argument " + name);
        process.exit(1);
    }
}
var appId = getArgumentOrDie('appId');
var masterKey = getArgumentOrDie('masterKey');
var serverURL = getArgumentOrDie('serverURL');
if (argv.import) {
    if (argv.file) {
        importSchemas(argv.file);
    }
    else {
        console.error('Missing argument file');
    }
}
else if (argv.export) {
    exportSchemas(argv.file);
}
else {
    console.error('Invalid script call');
    process.exit(1);
}
function exportSchemas(file) {
    return __awaiter(this, void 0, void 0, function () {
        var schemas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parse_request_1.default(serverURL, appId, masterKey, 'GET', "schemas")];
                case 1:
                    schemas = _a.sent();
                    if (!file) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs.writeFile(file, JSON.stringify(schemas.results, null, 4))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.log(schemas.results);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function importSchemas(file) {
    return __awaiter(this, void 0, void 0, function () {
        var schemas, error_1, _i, schemas_1, schema, cleanSchema;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    schemas = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.readJson(file)];
                case 2:
                    schemas = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Could not read JSON file at path " + file);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4:
                    _i = 0, schemas_1 = schemas;
                    _a.label = 5;
                case 5:
                    if (!(_i < schemas_1.length)) return [3 /*break*/, 9];
                    schema = schemas_1[_i];
                    // Delete the existing class
                    return [4 /*yield*/, parse_request_1.default(serverURL, appId, masterKey, 'DELETE', "schemas/" + schema.className)
                        // Add the class
                    ];
                case 6:
                    // Delete the existing class
                    _a.sent();
                    cleanSchema = Object.assign({}, schema);
                    delete cleanSchema.fields['objectId'];
                    delete cleanSchema.fields['createdAt'];
                    delete cleanSchema.fields['updatedAt'];
                    delete cleanSchema.fields['ACL'];
                    if (cleanSchema.className === '_User') {
                        delete cleanSchema.fields['username'];
                        delete cleanSchema.fields['password'];
                        delete cleanSchema.fields['email'];
                        delete cleanSchema.fields['emailVerified'];
                        delete cleanSchema.fields['authData'];
                    }
                    if (cleanSchema.className === '_Role') {
                        delete cleanSchema.fields['name'];
                        delete cleanSchema.fields['users'];
                        delete cleanSchema.fields['roles'];
                    }
                    return [4 /*yield*/, parse_request_1.default(serverURL, appId, masterKey, 'POST', "schemas/" + schema.className, cleanSchema)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 5];
                case 9: return [2 /*return*/];
            }
        });
    });
}

"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var apiController = __importStar(require("./lib/structures/api/controller"));
var apiRoute = __importStar(require("./lib/structures/api/route"));
var FoxPlusStructure;
(function (FoxPlusStructure) {
    var Api;
    (function (Api) {
        Api.HttpStatus = apiController.HttpStatus;
        Api.Controller = apiController.Controller;
        Api.Route = apiRoute.Route;
    })(Api = FoxPlusStructure.Api || (FoxPlusStructure.Api = {}));
})(FoxPlusStructure = exports.FoxPlusStructure || (exports.FoxPlusStructure = {}));

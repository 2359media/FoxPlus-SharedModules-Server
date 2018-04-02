"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const apiController = __importStar(require("./lib/structures/api/controller"));
const apiRoute = __importStar(require("./lib/structures/api/route"));
const apiError = __importStar(require("./lib/structures/api/appError"));
var FoxPlusStructure;
(function (FoxPlusStructure) {
    FoxPlusStructure.ApiController = apiController.Controller;
    FoxPlusStructure.ApiResponse = apiController.Response;
    FoxPlusStructure.HttpStatus = apiController.HttpStatus;
    FoxPlusStructure.ApiRoute = apiRoute.Route;
    FoxPlusStructure.AppError = apiError.AppError;
    FoxPlusStructure.ErrorCode = apiError.ErrorCode;
})(FoxPlusStructure = exports.FoxPlusStructure || (exports.FoxPlusStructure = {}));

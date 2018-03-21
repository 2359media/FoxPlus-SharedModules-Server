"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = require("./src/structures/api/controller");
var route_1 = require("./src/structures/api/route");
var FoxPlusStructure = /** @class */ (function () {
    function FoxPlusStructure() {
    }
    FoxPlusStructure.ApiController = controller_1.Controller;
    FoxPlusStructure.ApiRoute = route_1.Route;
    return FoxPlusStructure;
}());
exports.FoxPlusStructure = FoxPlusStructure;

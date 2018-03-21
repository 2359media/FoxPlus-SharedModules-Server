"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = require("./src/structures/api/controller");
var route_1 = require("./src/structures/api/route");
var FoxPlusShared = /** @class */ (function () {
    function FoxPlusShared() {
    }
    FoxPlusShared.Structure = {
        Api: { Controller: controller_1.Controller, Route: route_1.Route }
    };
    return FoxPlusShared;
}());
exports.FoxPlusShared = FoxPlusShared;

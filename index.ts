import { Controller } from "./src/structures/api/controller";
import { Route } from "./src/structures/api/route";

export class FoxPlusShared {
    public static Structure: Object = {
        Api: { Controller, Route }
    }
}
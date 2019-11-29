"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PMX = require("pmx");
class ActionBase {
    addAction(event, action) {
        PMX.action(event, (params, reply) => {
            action(params, reply);
        });
    }
}
exports.ActionBase = ActionBase;
//# sourceMappingURL=actionbase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserRouter = (0, express_1.Router)();
UserRouter.get("/me", (req, res) => {
    res.send(req.user);
});
exports.default = UserRouter;

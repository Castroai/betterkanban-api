"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile_controller");
const ProfileRouter = (0, express_1.Router)();
const controller = new profile_controller_1.ProfileController();
ProfileRouter.get("/", (req, res) => {
    res.status(200).send("Secure Data");
});
exports.default = ProfileRouter;

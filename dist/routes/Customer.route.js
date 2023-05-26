"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Customer_controller_1 = require("../controllers/Customer.controller");
const joi_1 = __importDefault(require("joi"));
const CustomerRouter = (0, express_1.Router)();
const controller = new Customer_controller_1.CustomerContoller();
CustomerRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createCustomerSchema = joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        accountStatus: joi_1.default.string().optional(),
        businessId: joi_1.default.string().optional(),
        jobTitle: joi_1.default.string().optional(),
        phoneNumber: joi_1.default.string().optional(),
        source: joi_1.default.string().optional(),
    });
    const { error } = createCustomerSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
    }
    else {
        try {
            const data = yield controller.createOne(Object.assign({}, req.body));
            res.status(200).json(data);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
}));
CustomerRouter.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateCustomerSchema = joi_1.default.object({
        name: joi_1.default.string().required(),
        accountStatus: joi_1.default.string().optional(),
        businessId: joi_1.default.string().optional(),
        jobTitle: joi_1.default.string().optional(),
        phoneNumber: joi_1.default.string().optional(),
        source: joi_1.default.string().optional(),
        id: joi_1.default.number().required(),
    });
    const { error } = updateCustomerSchema.validate(req.body);
    if (error) {
        res.status(500).json(error);
    }
    else {
        try {
            const data = yield controller.updateOne(Object.assign({}, req.body));
            res.json(data);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
}));
exports.default = CustomerRouter;

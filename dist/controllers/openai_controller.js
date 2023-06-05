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
const openai_1 = require("openai");
const gpt_3_encoder_1 = require("gpt-3-encoder");
const axios_1 = __importDefault(require("axios"));
const configuration = new openai_1.Configuration({
    organization: process.env.OPEN_API_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY_PAID,
});
const openai = new openai_1.OpenAIApi(configuration);
class OpenaiController {
    generatePrompt() {
        const str = 'Say this is a test';
        const encoded = (0, gpt_3_encoder_1.encode)(str);
        console.log('Encoded this string looks like: ', encoded);
        console.log('We can look at each token and what it represents');
        for (let token of encoded) {
            console.log({ token, string: (0, gpt_3_encoder_1.decode)([token]) });
        }
        const decoded = (0, gpt_3_encoder_1.decode)(encoded);
        console.log('We can decode it back into:\n', decoded);
    }
    submitPrompt(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { prompt } = req.body;
            try {
                const instance = axios_1.default.create({
                    baseURL: 'https://api.openai.com/v1/chat/completions',
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENAI_API_KEY_PAID}`,
                        "OpenAI-Organization": `${process.env.OPEN_API_ORG_ID}`,
                        "Content-Type": "application/json"
                    }
                });
                const body = {
                    model: 'gpt-3.5-turbo',
                    messages: [{ "role": "user", "content": prompt }],
                    temperature: 0.7
                };
                const { data } = yield instance.post('', body);
                return data;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = OpenaiController;

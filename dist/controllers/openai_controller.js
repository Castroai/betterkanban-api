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
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const gpt_3_encoder_1 = require("gpt-3-encoder");
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
    submitPrompt() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: "Say this is a test",
                    max_tokens: 7,
                    temperature: 0,
                });
                return data;
            }
            catch (error) {
                console.error(JSON.stringify(error));
            }
        });
    }
}
exports.default = OpenaiController;

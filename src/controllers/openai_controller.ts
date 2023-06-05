import { Configuration, OpenAIApi } from "openai";
import { encode, decode } from 'gpt-3-encoder';
import { Request } from "express";
import axios from 'axios'
const configuration = new Configuration({
    organization: process.env.OPEN_API_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY_PAID,
});
const openai = new OpenAIApi(configuration);


export default class OpenaiController {
    public generatePrompt() {
        const str = 'Say this is a test'
        const encoded = encode(str)
        console.log('Encoded this string looks like: ', encoded)

        console.log('We can look at each token and what it represents')
        for (let token of encoded) {
            console.log({ token, string: decode([token]) })
        }

        const decoded = decode(encoded)
        console.log('We can decode it back into:\n', decoded)
    }
    public async submitPrompt(req: Request) {
        const { prompt } = req.body as { prompt: string }
        try {
            const instance = axios.create({
                baseURL: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY_PAID}`,
                    "OpenAI-Organization": `${process.env.OPEN_API_ORG_ID}`,
                    "Content-Type": "application/json"
                }
            })
            const body = {
                model: 'gpt-3.5-turbo',
                messages: [{ "role": "user", "content": prompt }],
                temperature: 0.7
            };

            const { data } = await instance.post('', body)
            return data
        } catch (error) {
            console.error(error)
        }
    }
}
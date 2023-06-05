import { Configuration, OpenAIApi } from "openai";
import { encode, decode } from 'gpt-3-encoder';

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
    public async submitPrompt() {
        try {
            const { data } = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: "Say this is a test",
                max_tokens: 7,
                temperature: 0,
            })
            return data
        } catch (error) {
            console.error(JSON.stringify(error))
        }
    }
}
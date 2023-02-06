

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);

const getResponse = async (text) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: text,
            temperature: 0,
            max_tokens: 200,
        });

        return response.data.choices[0] ? response.data.choices[0].text : "None";
    } catch (error) {
        return "Hubo un error con el server OpenAI"
    }
}

module.exports = { getResponse }
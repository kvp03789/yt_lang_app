const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
})

const openAi = new OpenAIApi(configuration)

module.exports = openAi
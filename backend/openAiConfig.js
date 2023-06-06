const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration(process.env.OPEN_AI_KEY)
const express = require("express");
//this was using fs to parse the scraped NLC data.
// const fs = require("fs");
require("dotenv").config({ path: "../.env" });
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

//attemting to truncate the data to shorten it.
// JSON.truncate = require("json-truncate");

const PORT = process.env.PORT || 8000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());

app.use(cors());

//trying to load in the NLC data, too much to parse through.
// const wineData = JSON.parse(fs.readFileSync("wineData.json"));
// const truncatedData = JSON.truncate(wineData);

// const url = "https://nlliquor.com/product-category/wine/";

app.get("/completions", async (request, response) => {
  try {
    const prompt = request.query.prompt;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `You are a world-class sommelier. The goal is to find a great match for ${prompt}. Please provide some one option at 3 price points, starting around $20 CAD(wine 1), then $50 CAD (wine 2), and then $100 CAD (wine 3). respond in the following format precisely, without any additional characters or line breaks: [{
        "name": "Wine Name 1",
        "description": "Description of Wine 1",
        "price": 0
      }, {
        "name": "Wine Name 2",
        "description": "Description of Wine 2",
        "price": 0
      }, {
        "name": "Wine Name 3",
        "description": "Description of Wine 3",
        "price": 0
      }]`,
      max_tokens: 400,
      temperature: 0.7,
    });

    if (!completion.data.choices) {
      return response.status(400).json({
        status: 400,
        message: "no choices available",
      });
    }

    const formattedResponse = JSON.parse(completion.data.choices[0].text);

    return response.status(200).json({
      status: 200,
      message: formattedResponse,
    });
  } catch (error) {
    console.log(error + "brian wrote this");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

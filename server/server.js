const express = require("express");
const fs = require("fs");
require("dotenv").config({ path: "../.env" });
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

JSON.truncate = require("json-truncate");

const PORT = process.env.PORT || 8000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());

app.use(cors());

const wineData = JSON.parse(fs.readFileSync("wineData.json"));

// const truncatedData = JSON.truncate(wineData);

// const url = "https://nlliquor.com/product-category/wine/";

// const reqFormatter = (inputStr) => {
//   const convertedInputStr = inputStr.replace(/\n/g, "").replace(/\a/g, "");
//   return convertedInputStr;
// };

app.get("/completions", async (request, response) => {
  try {
    const prompt = request.query.prompt;

    //    [{
    // 	"name": "Wine Name 1",
    // 	"description": "Description of Wine 1",
    // 	"price": 0
    // }, {
    // 	"name": "Wine Name 2",
    // 	"description": "Description of Wine 2",
    // 	"price": 0
    // }, {
    // 	"name": "Wine Name 3",
    // 	"description": "Description of Wine 3",
    // 	"price": 0
    // }]

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
    // console.log(completion.data.choices[0].text.trim());

    const formattedResponse = JSON.parse(completion.data.choices[0].text);
    // console.log("formatted", formatetdResponse);
    // console.log(completion.data.choices[0].text);

    return response.status(200).json({
      status: 200,
      message: formattedResponse,
    });
  } catch (error) {
    console.log(error + "brian wrote this");
  }
});

// app.get("/completions", async (request, response) => {
//   const userInput = request.body.input;

//   const options = {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     data: JSON.stringify({
//       model: "text-davinci-003",
//       max_tokens: 100,
//       temperature: 0.7,
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a world-class sommelier, from the list of wines provided, pick 3 possible options at different price points, one around $20, one around $50, and one higher in price." +
//             userInput,
//         },
//         { role: "user", content: userInput },
//       ],
//     }),
//   };

//   try {
//     const openAIResponse = await axios.post(
//       "https://api.openai.com/v1/engines/davinci-codex/completions",
//       options
//     );

//     const { choices } = openAIResponse.data;
//     const pairingResponse = choices[0].message.content;

//     // Pairing response can be processed and combined with wine data
//     const pairingsWithWines = combinePairingsWithWineData(
//       pairingResponse,
//       wineData
//     );
//     console.log(pairingsWithWines);
//     response.json({ pairings: pairingsWithWines });
//   } catch (error) {
//     console.log("Error: ", error);
//     response.status(500).json({ error: "An error occurred" });
//   }
// });

// const combinePairingsWithWineData = (pairingResponse, wineData) => {
//   // Your logic to combine the pairing response with wine data
//   // Example implementation:
//   const pairings = JSON.parse(pairingResponse);
//   const pairingsWithWines = pairings.map((pairing) => {
//     const { wineId, score } = pairing;
//     const wine = wineData.find((wine) => wine.id === wineId);
//     return {
//       wineId,
//       score,
//       wine,
//     };
//   });
//   console.log(pairingsWithWines);
//   return pairingsWithWines;
// };

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

// const express = require("express");

// const PORT = process.env.PORT || 8000;

// const app = express();
// app.use(express.json());

// const API_KEY = process.env.OPENAI_API_KEY;

// app.post("/completions", async (request, response) => {
//   const options = {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "text-davinci-003",
//       messages: [{ role: "user", content: "hello how are you" }],
//       max,
//       _tokens: 50,
//     }),
//   };
//   try {
//     const response = await fetch(
//       `
//     https://api.openai.com/v1/completions`,
//       options
//     );
//     const data = await response.json();
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Listening on ${PORT}`);
// });

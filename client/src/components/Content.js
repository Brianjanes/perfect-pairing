import React, { useState } from "react";
import axios from "axios";
import ResultsModal from "./ResultsModal";

const Content = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
    setIsLoading(true);

    const data = {
      model: "text-davinci-003",
      prompt: `You are a world-class sommelier. Your goal is to find a great match for ${input}. Use current wine pricing information from the NLC website https://nlliquor.com/product-category/wine/?ml-size=750-ml, and do not lie about any information regarding these wines. Please provide 3 options at different price points, starting at no more than 20 Canadian Dollars (wine 1), then no more than 50 Canadian Dollars (wine 2), and then no more than 100 Canadian dollars (wine 3). respond in the following format precisely, without any additional characters or line breaks: [{
        "name": "Wine Name 1",
        "description": " Brief description of Wine 1",
        "price": 20
      }, {
        "name": "Wine Name 2",
        "description": "Brief description of Wine 2",
        "price": 50
      }, {
        "name": "Wine Name 3",
        "description": "Brief description of Wine 3",
        "price": 100
      }]`,
      max_tokens: 500,
      temperature: 0.7,
    };

    axios
      .post("https://api.openai.com/v1/completions", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        setResult(JSON.parse(response.data.choices[0].text));
        setIsLoading(false);
        setInput("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //from server
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setShowModal(true);
  //   setIsLoading(true);

  //   axios
  //     .post("https://api.openai.com/v1/engines/davinci-codex/completions", {
  //       params: {
  //         prompt: `You are a world-class sommelier. The goal is to find a great match for ${input}. Please provide some one option at 3 price points, starting around $20 CAD(wine 1), then $50 CAD (wine 2), and then $100 CAD (wine 3). respond in the following format precisely, without any additional characters or line breaks: [{
  //           "name": "Wine Name 1",
  //           "description": "Description of Wine 1",
  //           "price": 0
  //         }, {
  //           "name": "Wine Name 2",
  //           "description": "Description of Wine 2",
  //           "price": 0
  //         }, {
  //           "name": "Wine Name 3",
  //           "description": "Description of Wine 3",
  //           "price": 0
  //         }]`,
  //         max_tokens: 400,
  //         temperature: 0.7,
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       setResult(response.data.message);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  return (
    <div className="content-main">
      <h2>What would you like to pair wine with?</h2>
      <form className="form">
        <textarea
          type="text"
          placeholder="Describe your meal here"
          className="query-input"
          onChange={(e) => {
            handleInputChange(e);
          }}
          value={input}
        />

        <button
          className="button"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Find Pairing
        </button>
      </form>
      {showModal && (
        <ResultsModal
          setShowModal={setShowModal}
          result={result}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Content;

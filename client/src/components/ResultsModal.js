import React, { useState } from "react";
import "../components/Modal.css";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

const ResultsModal = ({
  result,
  isLoading,
  setIsLoading,
  setShowModal,
  input,
  setInput,
  apiKey,
}) => {
  const [wineDetails, setWineDetails] = useState("");

  const handleNewPairing = (e) => {
    e.preventDefault();
    setShowModal(false);
    setInput("");
  };

  const handleDetails = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      model: "text-davinci-003",
      prompt: `You are a world-class sommelier. Your goal is to find a great match for ${input}. Please describe the considerations when picking a wine to match the input, and 3 things the user should look for when finding their best match with their specific query.`,
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
        console.log(response.data.choices[0].text);
        setWineDetails(response.data.choices[0].text);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="modal-background">
      <div className="results-modal">
        <div className="modal-title">
          <h1>Pairing Options:</h1>
        </div>
        {isLoading ? (
          <div className="modal-body">
            <h2>Please wait while we find a match</h2>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="modal-body">
              {result?.map((wine, index) => {
                return (
                  <div className="wine-box" key={index}>
                    <div className="name-price">
                      {wine.name} - ${wine.price}
                    </div>
                    <div className="wine-description">{wine.description}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex-button">
              <button
                className="newPairing-button"
                onClick={(e) => {
                  handleNewPairing(e);
                }}
              >
                New Pairing
              </button>
              <button
                className="newPairing-button"
                onClick={(e) => handleDetails(e)}
              >
                Pairing Notes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsModal;

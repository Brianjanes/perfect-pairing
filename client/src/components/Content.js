import React, { useState } from "react";
import axios from "axios";
import ResultsModal from "./ResultsModal";

const Content = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
    setIsLoading(true);

    axios
      .get("/completions", {
        params: {
          prompt: input,
        },
      })
      .then((response) => {
        setResult(response.data.message);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

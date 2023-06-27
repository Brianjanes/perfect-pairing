import React, { useState } from "react";

const Content = () => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
    console.log(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInput("");
    console.log(input);
  };

  return (
    <div className="content-main">
      <h2>What would you like to pair wine with?</h2>
      <form className="form">
        <textarea
          type="text"
          placeholder="Describe your meal."
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
    </div>
  );
};

export default Content;

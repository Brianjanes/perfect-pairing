import React, { useState } from "react";
import axios from "axios";

const Content = () => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.get("/completions", {
  //       input: input,
  //     });
  //     const data = response.data;
  //     // Process the response data as needed
  //     console.log(data);
  //   } catch (error) {
  //     console.log("Error: " + error);
  //   }
  //   setInput("");
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get("/completions", {
        params: {
          prompt: input,
        },
      })
      .then((response) => {
        console.log(response);
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

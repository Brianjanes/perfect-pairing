import React from "react";

const Content = () => {
  return (
    <div className="content-main">
      <h2>What would you like to pair wine with?</h2>
      <form className="form">
        <textarea type="textarea" class="query-input" />
        <button className="button" type="submit">
          Find Pairing
        </button>
      </form>
    </div>
  );
};

export default Content;

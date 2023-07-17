import React from "react";
import "../components/Modal.css";
import LoadingSpinner from "./LoadingSpinner";

const ResultsModal = ({ result, isLoading, setShowModal }) => {
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
            <div>
              <button
                className="newPairing-button"
                onClick={() => setShowModal(false)}
              >
                New Pairing
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsModal;

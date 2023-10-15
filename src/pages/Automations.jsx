import React, { useState } from 'react';
import "./Automations.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function Automations() {
  const [showBanner, setShowBanner] = useState(true);

  const handleClose = () => {
    setShowBanner(false);
  };

  return (
    <div className="Appenos">
      {showBanner && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Work In Progress!</strong> This feature is currently under development.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={handleClose}></button>
        </div>
      )}
      <h1>Automations</h1>
    </div>
  );
}

export default Automations;

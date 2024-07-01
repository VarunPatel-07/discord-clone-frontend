import React from "react";
import "./scss/components.css";
function SpinnerComponent() {
  return (
    <>
      <svg className="sinner-component" viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </>
  );
}

export default SpinnerComponent;

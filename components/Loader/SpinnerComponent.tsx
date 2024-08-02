import React from "react";
// import "../scss/components.css";
function SpinnerComponent() {
  return (
    <>
      <div className="w-[100%] h-[100%] ">
        <svg
          className="sinner-component w-[20px] h-[20px]"
          viewBox="25 25 50 50"
        >
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    </>
  );
}

export default SpinnerComponent;

import React from "react";

const PulsingSVG: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="blue"
        opacity="0.3"
        style={{
          animation: "pulse 2s infinite",
          transformOrigin: "center",
        }}
      />
    </svg>
  );
};

export default PulsingSVG;
import React from "react";

function CircularProgressBar({ percentage }: { percentage: Number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  // Function to calculate the stroke-dashoffset based on percentage
  const strokeDashoffset = circumference - ((percentage as number) / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          className="text-gray-300"
          strokeWidth="5"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className="text-blue-500"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <span className="absolute text-xl font-bold text-white">{percentage as number}%</span>
    </div>
  );
}

export default CircularProgressBar;

"use client";
import React, { useEffect, useState } from "react";
import SpinnerComponent from "./Loader/SpinnerComponent";
// Ensure correct import

function RedirectLoader() {
  return (
    <div className="fixed w-[100%] h-[100%] top-0 left-0 animate-fade-in z-[10] bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px]">
      <div className="w-[100%] h-[100%] flex flex-col items-center justify-center  gap-[15px]">
        <div className="loader">
          <svg
            viewBox="-1 -1 18 18"
            fill="currentColor"
            height="150"
            width="150"
            xmlns="http://www.w3.org/2000/svg"
            className="logo"
          >
            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"></path>
          </svg>
        </div>
        <p className="text-white  text-[20px] capitalize font-mono flex items-center justify-center">
          <span className="capitalize font-semibold">redirecting</span>
          <span className="block w-8 h-8">
            <svg
              className="sinner-component w-[20px] h-[20px]"
              viewBox="25 25 50 50"
            >
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </span>
        </p>
      </div>
    </div>
  );
}

export default RedirectLoader;

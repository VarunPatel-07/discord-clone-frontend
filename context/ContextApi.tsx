"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContextApiProps {
  HelloFunction: () => void;
}

const Context = createContext<ContextApiProps | undefined>(undefined);

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const HelloFunction = () => {
    console.log("Hello");
  };
  const context_value = { HelloFunction };
  return <Context.Provider value={context_value}>{children}</Context.Provider>;
};
export { Context, ContextProvider };

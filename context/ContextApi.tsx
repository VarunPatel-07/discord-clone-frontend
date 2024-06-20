"use client";
import { configDotenv } from "dotenv";
configDotenv();
import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

interface ContextApiProps {
  Login_User_Function: (user_info: object) => void;
  CheckUsersLoginStatus: () => boolean;
}

const Context = createContext<ContextApiProps | undefined>(undefined);

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const Host = process.env.BACKEND_DOMAIN || "http://localhost:500";
  const Login_User_Function = async (loginInfo: object) => {
    try {
      console.log(process.env.BACKEND_DOMAIN);
      console.log("host", Host);
      if (loginInfo) {
        const formData = new FormData();
        formData.append("UserName", (loginInfo as any).UserName);
        formData.append("Password", (loginInfo as any).Password);

        const response = await axios({
          method: "post",
          url: `http://localhost:500/app/api/auth/login`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        console.log(response.data);
        if (response.data.success) {
          localStorage.setItem("AuthToken", response.data.token);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const CheckUsersLoginStatus = (): boolean => {
    if (localStorage.getItem("AuthToken")) {
      return true;
    } else {
      return false;
    }
  };
  const context_value = { Login_User_Function  , CheckUsersLoginStatus};
  return <Context.Provider value={context_value}>{children}</Context.Provider>;
};
export { Context, ContextProvider };

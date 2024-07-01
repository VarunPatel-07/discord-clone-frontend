"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

interface ContextApiProps {
  //
  //? exporting all the state
  //

  Server_Profile_Image: string;
  setServer_Profile_Image: React.Dispatch<React.SetStateAction<string>>;

  Show_Create_Server_PopUp: boolean;
  setShow_Create_Server_PopUp: React.Dispatch<React.SetStateAction<boolean>>;

  //
  //? exporting all the functions
  //
  Login_User_Function: (user_info: object) => void;
  Register_User_Function: (user_info: object) => void;
  CheckUsersLoginStatus: () => void;
}

const Context = createContext<ContextApiProps | undefined>(undefined);

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;

  //
  //
  // ? defining all the state
  //
  //
  const [Server_Profile_Image, setServer_Profile_Image] = useState(
    "" as string
  );
  const [Show_Create_Server_PopUp, setShow_Create_Server_PopUp] = useState(
    false as boolean
  );
  //
  //
  // ? defining all the functions
  //
  //
  const Login_User_Function = async (loginInfo: object) => {
    try {
      if (loginInfo) {
        const formData = new FormData();
        formData.append("UserName", (loginInfo as any).UserName);
        formData.append("Password", (loginInfo as any).Password);

        const response = await axios({
          method: "post",
          url: `${Host}/app/api/auth/login`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });

        if (response.data.success) {
          localStorage.setItem("AuthToken", response.data.token);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const Register_User_Function = async (user_info: object) => {
    try {
      if (user_info) {
        const { UserName, Password, Email, FullName, DateOfBirth } =
          user_info as any;

        const formData = new FormData();
        formData.append("UserName", UserName);
        formData.append("Password", Password);
        formData.append("Email", Email);
        formData.append("FullName", FullName);
        formData.append("DateOfBirth", DateOfBirth);
        const response = await axios({
          method: "post",
          url: `${Host}/app/api/auth/register`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });

        if (response.data.success) {
          localStorage.setItem("AuthToken", response.data.token);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const CheckUsersLoginStatus = async () => {
    const AuthToken = localStorage.getItem("AuthToken");
    if (AuthToken) {
      try {
        const response: any = await axios({
          method: "get",
          url: `${Host}/app/api/auth/check-user`,
          headers: {
            Authorization: AuthToken,
          },
        });

        if (!response.data.success) {
          localStorage.removeItem("AuthToken");
          return false;
        }
        return true;
      } catch (error) {
        localStorage.removeItem("AuthToken");
        return false;
      }
    } else {
      return false;
    }
  };

  //
  // ? defining the context value
  //
  const context_value = {
    Server_Profile_Image,
    setServer_Profile_Image,
    Show_Create_Server_PopUp,
    setShow_Create_Server_PopUp,
    Login_User_Function,
    CheckUsersLoginStatus,
    Register_User_Function,
  };
  return <Context.Provider value={context_value}>{children}</Context.Provider>;
};
export { Context, ContextProvider };

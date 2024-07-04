"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
interface ContextApiProps {
  //
  //? exporting all the state
  //

  Global_Server_Profile_Image: {
    Preview__Image__URL: string;
    File_Of_Image: string;
  };
  setGlobal_Server_Profile_Image: React.Dispatch<React.SetStateAction<object>>;

  Show_Create_Server_PopUp: boolean;
  setShow_Create_Server_PopUp: React.Dispatch<React.SetStateAction<boolean>>;

  Including_Server_Info_Array: object;

  //
  //? exporting all the functions
  //
  Login_User_Function: (user_info: object) => void;
  Register_User_Function: (user_info: object) => void;
  CheckUsersLoginStatus: () => void;
  Create_New_Server_Function: (server_info: object, AuthToken: string) => void;
  FetchTheIncludingServer: (AuthToke: string) => void;
}

const Context = createContext<ContextApiProps | undefined>(undefined);

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { push } = useRouter();
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  const socket = io(Host);
  const initialState = [];
  //
  //
  // ? defining all the state
  //
  //
  const [Global_Server_Profile_Image, setGlobal_Server_Profile_Image] =
    useState({
      Preview__Image__URL: "",
      File_Of_Image: "" as any,
    });
  const [Show_Create_Server_PopUp, setShow_Create_Server_PopUp] = useState(
    false as boolean
  );
  const [Including_Server_Info_Array, setIncluding_Server_Info_Array] =
    useState(initialState);
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
  const Create_New_Server_Function = async (
    server_info: object,
    AuthToken: string
  ) => {
    try {
      if (AuthToken) {
        const response = await axios({
          method: "post",
          url: `${Host}/app/api/server/create-server`,
          headers: {
            Authorization: AuthToken,
            "Content-Type": "multipart/form-data",
          },
          data: server_info,
        });

        if (response.data.success) {
          push(`/pages/server/${response.data.server_id}`);
           socket.emit("newServerCreationOccurred", response.data.server_id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const FetchTheIncludingServer = async (AuthToke: string) => {
    try {
      if (AuthToke) {
        const response = await axios({
          method: "get",
          url: `${Host}/app/api/server/get-servers`,
          headers: {
            Authorization: AuthToke,
          },
        });

        const Data = response.data;

        if (Data.success) {
          setIncluding_Server_Info_Array(Data.server_info);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //
  // ? defining the context value
  //
  const context_value = {
    Global_Server_Profile_Image,
    setGlobal_Server_Profile_Image:
      setGlobal_Server_Profile_Image as React.Dispatch<
        React.SetStateAction<object>
      >,
    Show_Create_Server_PopUp,
    setShow_Create_Server_PopUp,
    Including_Server_Info_Array,

    Login_User_Function,
    CheckUsersLoginStatus,
    Register_User_Function,
    Create_New_Server_Function,
    FetchTheIncludingServer,
  };
  return <Context.Provider value={context_value}>{children}</Context.Provider>;
};
export { Context, ContextProvider };

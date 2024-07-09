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
import { promises } from "dns";
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

  ServerInfoById: object;
  UserInformation: object;
  UpdateServerInfoImage: object;
  setUpdateServerInfoImage: React.Dispatch<React.SetStateAction<object>>;

  //
  //? exporting all the functions
  //
  Login_User_Function: (user_info: object) => void;
  Register_User_Function: (user_info: object) => void;
  CheckUsersLoginStatus: () => void;
  Create_New_Server_Function: (server_info: object, AuthToken: string) => void;
  FetchTheIncludingServer: (AuthToke: string) => void;
  FetchingTheServerInfoByServerId: (serverId: string, AuthToke: string) => void;
  UserInfoFetchingFunction: (AuthToken: string) => void;
  RegeneratingServerInviteCodeFunction: (
    AuthToken: string,
    serverId: string
  ) => object;
  JoiningServerWithInvitationCode: (
    AuthToken: string,
    serverId: string,
    invitationCode: string
  ) => object;
  UpdatingServerInformationFunction: (
    AuthToken: string,
    server_info: object
  ) => void;
  ChangingMemberRoleFunction: (
    AuthToken: string,
    serverId: string,
    MemberId: string,
    CurrentMemberRole: string,
    user_Id: string
  ) => void;
  KickOutMemberFromServerFunction: (
    AuthToken: string,
    serverId: string,
    userId: string,
    memberId: string
  ) => void;
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
  const [ServerInfoById, setServerInfoById] = useState("" as any);
  const [UserInformation, setUserInformation] = useState("" as any);

  const [UpdateServerInfoImage, setUpdateServerInfoImage] = useState({
    Preview_Image: "" as string,
    File_Of_Image: "" as any,
  });
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
  const FetchingTheServerInfoByServerId = async (
    serverId: string,
    AuthToke: string
  ) => {
    try {
      if (!AuthToke) return;
      const result = await axios({
        method: "get",
        url: `${Host}/app/api/server/serverInfo/${serverId}`,
        headers: {
          Authorization: AuthToke,
        },
      });
      const Data = result.data;

      if (Data.success) {
        setServerInfoById(Data.Server__Info);
        setUpdateServerInfoImage({
          Preview_Image: Data.Server__Info.imageUrl,
          File_Of_Image: "" as any,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const UserInfoFetchingFunction = async (AuthToken: string) => {
    try {
      if (!AuthToken) return;
      if (!localStorage.getItem("User__Info")) {
        const response = await axios({
          method: "get",
          url: `${Host}/app/api/auth/userDetails`,
          headers: {
            Authorization: AuthToken,
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.success) {
          localStorage.setItem(
            "User__Info",
            JSON.stringify(response.data.user)
          );
          setUserInformation(response.data.user);
        }
      } else {
        const user_info = JSON.parse(localStorage.getItem("User__Info") as any);
        setUserInformation(user_info);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const RegeneratingServerInviteCodeFunction = async (
    AuthToken: string,
    serverId: string
  ) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/server/regenerateInviteCode`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: {
          serverId: serverId,
        },
      });

      if (response.data.success) {
        return { success: true, inviteCode: response.data.Invite_Code };
      }
    } catch (error) {
      return { success: false };
    }
  };
  const JoiningServerWithInvitationCode = async (
    AuthToken: string,
    InvitationCode: string
  ) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/server/joinServerWithInviteCode`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: {
          inviteCode: InvitationCode,
        },
      });

      if (response.data.success) {
        socket.emit("NewMemberJoined", response.data.server_id);
        return {
          success: true,
          allReadyInServer: response.data.allReadyInServer,
          serverId: response.data.Server_Id,
        };
      }
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  };
  const UpdatingServerInformationFunction = async (
    AuthToken: string,
    server_info: object
  ) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/server/updateServerInfo`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: server_info,
      });

      if (response.data.success) {
        socket.emit("newServerCreationOccurred", response.data.server_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const ChangingMemberRoleFunction = async (
    AuthToken: string,
    serverId: string,
    MemberId: string,
    CurrentMemberRole: string,
    user_Id: string
  ) => {
    console.log(MemberId, CurrentMemberRole, user_Id);
    try {
      if (!AuthToken) return;
      const formData = new FormData();
      formData.append("memberId", MemberId);
      formData.append("CurrentMemberRole", CurrentMemberRole);
      formData.append("user_Id", user_Id);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/server/changeMemberRole/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (response.data.success) {
        socket.emit("newServerCreationOccurred", response.data.server_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const KickOutMemberFromServerFunction = async (
    AuthToken: string,
    serverId: string,
    userId: string,
    memberId: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("memberId", memberId);
      if (!AuthToken) return;
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/server/kickOutMemberFromServer/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (response.data.success) {
        socket.emit("newServerCreationOccurred", response.data.server_id);
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
    ServerInfoById,
    UserInformation,
    UpdateServerInfoImage,
    setUpdateServerInfoImage: setUpdateServerInfoImage as React.Dispatch<
      React.SetStateAction<object>
    >,

    Login_User_Function,
    CheckUsersLoginStatus,
    Register_User_Function,
    Create_New_Server_Function,
    FetchTheIncludingServer,
    FetchingTheServerInfoByServerId,
    UserInfoFetchingFunction,
    RegeneratingServerInviteCodeFunction,
    JoiningServerWithInvitationCode,
    UpdatingServerInformationFunction,
    ChangingMemberRoleFunction,
    KickOutMemberFromServerFunction,
  };
  return <Context.Provider value={context_value}>{children}</Context.Provider>;
};
export { Context, ContextProvider };

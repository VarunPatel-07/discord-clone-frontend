"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

import { promises } from "dns";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import UseSocketIO from "@/hooks/UseSocketIO";

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

  GlobalAlertInformation: object;
  setGlobalAlertInformation: React.Dispatch<React.SetStateAction<object>>;

  AllTheTextChannelsOfTheServer: Array<object>;
  AllTheAudioChannelsOfTheServer: Array<object>;
  AllTheVideoChannelsOfTheServer: Array<object>;
  CurrentChatChannelInfo: object;
  setCurrentChatChannelInfo: React.Dispatch<React.SetStateAction<object>>;
  ChangingTheMemberRole: boolean;
  FetchAllTheOtherUsers: Array<object>;
  // setFetchAllTheOtherUsers: React.Dispatch<React.SetStateAction<object>>;
  AllTheUsersRequestSendOrReceived: object;
  // setAllTheUsersRequestSendOrReceived: React.Dispatch<
  //   React.SetStateAction<object>
  // >;

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
  CreateNewChannelFunction: (
    AuthToken: string,
    serverId: string,
    ChannelName: string,
    ChannelType: string
  ) => void;
  LeaveFromServerFunction: (
    AuthToken: string,
    serverId: string,
    userId: string,
    memberId: string
  ) => void;
  Check_The_User_Is_KickedOut: (
    SocketData: {
      message: string;
      success: boolean;
      serverId: string;
      memberId: string;
      userId: string;
      serverName: string;
    },
    UserCurrentPath: Array<string>
  ) => object;
  DeleteServerFunction: (AuthToken: string, serverId: string) => void;
  Check_Server_Is_Deleted: (
    SocketData: {
      message: string;
      success: boolean;
      serverId: string;
      serverName: string;
      adminId: string;
    },
    UserCurrentPath: Array<string>
  ) => object;
  FetchTheTextChannelOfTheServer: (AuthToken: string, serverId: string) => void;
  FetchTheAudioChannelOfTheServer: (
    AuthToken: string,
    serverId: string
  ) => void;
  FetchTheVideoChannelOfTheServer: (
    AuthToken: string,
    serverId: string
  ) => void;
  UpdateChannelInfoFunction: (
    AuthToken: string,
    serverId: string,
    ChannelName: string,
    ChannelType: string,
    channelId: string
  ) => void;
  DeleteChannelFunction: (
    AuthToken: string,
    serverId: string,
    channelId: string
  ) => void;
  FetchTheUserOnTheBaseOfDemand: (AuthToken: string, userType: string) => void;
}

const Context = createContext<ContextApiProps | undefined>(undefined);

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { push } = useRouter();

  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  const Pathname = usePathname();

  const socket = UseSocketIO();
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
  const [GlobalAlertInformation, setGlobalAlertInformation] = useState({
    showAlert: false as boolean,
    title: "" as string,
  });
  const [AllTheTextChannelsOfTheServer, setAllTheTextChannelsOfTheServer] =
    useState([] as Array<object>);
  const [AllTheAudioChannelsOfTheServer, setAllTheAudioChannelsOfTheServer] =
    useState([] as Array<object>);
  const [AllTheVideoChannelsOfTheServer, setAllTheVideoChannelsOfTheServer] =
    useState([] as Array<object>);
  const [CurrentChatChannelInfo, setCurrentChatChannelInfo] = useState({
    ChatId: "" as string,
    ChatName: "" as string,
    ChatType: "" as string,
    ChatUserId: "" as string,
  });
  const [ChangingTheMemberRole, setChangingTheMemberRole] = useState(
    false as boolean
  );

  const [FetchAllTheOtherUsers, setFetchAllTheOtherUsers] = useState(
    [] as Array<object>
  );
  const [
    AllTheUsersRequestSendOrReceived,
    setAllTheUsersRequestSendOrReceived,
  ] = useState({
    Send: [] as Array<object>,
    Received: [] as Array<object>,
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

        await axios({
          method: "post",
          url: `${Host}/app/api/auth/login`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
          withCredentials: true,
        });
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
        await axios({
          method: "post",
          url: `${Host}/app/api/auth/register`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
          withCredentials: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const CheckUsersLoginStatus = async () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;

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
          deleteCookie("User_Authentication_Token");
          return false;
        }
        return true;
      } catch (error) {
        deleteCookie("User_Authentication_Token");
        deleteCookie("User__Info");
        console.log(error);
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
          socket?.emit("newServerCreationOccurred", response.data.server_id);
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
          // console.log(Data.server_info);
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
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/auth/userDetails`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setUserInformation(response.data.user);
        setCookie("User__Info", JSON.stringify(response.data.user));
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
        push(`/pages/server/${response.data.Server_Id}`);
        socket?.emit("NewMemberJoinedUsingInvitationCode", response.data);
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
        console.log(response.data);
        socket?.emit("newServerCreationOccurred", response.data);
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
    try {
      if (!AuthToken) return;
      setChangingTheMemberRole(true);
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
        console.log(response.data);
        socket?.emit("newServerCreationOccurred", response.data);
        setChangingTheMemberRole(false);
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
      if (!AuthToken) return;
      setChangingTheMemberRole(true);
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("memberId", memberId);
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
        socket?.emit("MemberRemovedByAdmin", response.data);
        socket?.emit("newServerCreationOccurred", response.data.server_id);
        setChangingTheMemberRole(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const CreateNewChannelFunction = async (
    AuthToken: string,
    serverId: string,
    ChannelName: string,
    ChannelType: string
  ) => {
    try {
      if (!AuthToken) return;

      const formData = new FormData();
      formData.append("ChannelName", ChannelName);
      formData.append("ChannelType", ChannelType);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/server/createNewChannel/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (response.data.success) {
        socket?.emit("NewChannelHasBeenCreated", response.data.server_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const UpdateChannelInfoFunction = async (
    AuthToken: string,
    serverId: string,
    ChannelName: string,
    ChannelType: string,
    channelId: string
  ) => {
    try {
      if (!AuthToken) return;
      const formData = new FormData();
      formData.append("ChannelName", ChannelName);
      formData.append("ChannelType", ChannelType);
      formData.append("channelId", channelId);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/server/updateChannel/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (response.data.success) {
        socket?.emit("NewChannelHasBeenCreated", response.data.server_id);
      }
    } catch (error) {}
  };
  const DeleteChannelFunction = async (
    AuthToken: string,
    serverId: string,
    channelId: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("channelId", channelId);
      const response = await axios({
        method: "delete",
        url: `${Host}/app/api/server/deleteChannel/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (response.data.success) {
        console.log(response.data);
        socket?.emit("NewChannelHasBeenCreated");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const LeaveFromServerFunction = async (
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
        url: `${Host}/app/api/server/LeaveServer/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (response.data.success) {
        socket?.emit("newServerCreationOccurred", response.data.server_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const Check_The_User_Is_KickedOut = async (
    SocketData: {
      message: string;
      success: boolean;
      serverId: string;
      memberId: string;
      userId: string;
      serverName: string;
    },
    UserCurrentPath: Array<string>
  ) => {
    try {
      if (!SocketData) return;
      if (
        UserCurrentPath.includes("server") &&
        UserCurrentPath.includes(SocketData.serverId)
      ) {
        const serverId = UserCurrentPath[3];
        const user_id = JSON.parse(getCookie("User__Info") || "").id;
        if (serverId === SocketData.serverId && user_id === SocketData.userId) {
          return {
            userKickedOut: true,
            isInTheCurrentServer: true,
            serverName: SocketData.serverName,
          };
        } else
          return {
            userKickedOut: false,
            isInTheCurrentServer: false,
          };
      } else {
        return {
          userKickedOut: true,
          isInTheCurrentServer: false,
          serverName: SocketData.serverName,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  const DeleteServerFunction = async (AuthToken: string, serverId: string) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "delete",
        url: `${Host}/app/api/server/deleteServer/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        socket?.emit("ServerHasBeenDeleted", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const Check_Server_Is_Deleted = async (
    SocketData: {
      message: string;
      success: boolean;
      serverId: string;
      serverName: string;
      adminId: string;
    },
    UserCurrentPath: Array<string>
  ) => {
    try {
      if (!SocketData) return;
      if (
        UserCurrentPath.includes("server") &&
        UserCurrentPath.includes(SocketData.serverId)
      ) {
        const serverId = UserCurrentPath[3];
        if (serverId === SocketData.serverId) {
          if (
            SocketData.adminId === JSON.parse(getCookie("User__Info") || "").id
          ) {
            return {
              serverHasBeenDeleted: true,
              userIsInTheCurrentServer: true,
              serverName: SocketData.serverName,
              userIsAdmin: true,
            };
          } else {
            return {
              serverHasBeenDeleted: true,
              userIsInTheCurrentServer: true,
              serverName: SocketData.serverName,
              userIsAdmin: false,
            };
          }
        }
      } else {
        return {
          serverHasBeenDeleted: true,
          userIsInTheCurrentServer: false,
          serverName: "",
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  const FetchTheTextChannelOfTheServer = async (
    AuthToken: string,
    serverId: string
  ) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/server/FetchTextChannel/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        // console.log(response.data);
        setAllTheTextChannelsOfTheServer(response.data.text_channels);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const FetchTheAudioChannelOfTheServer = async (
    AuthToken: string,
    serverId: string
  ) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/server/FetchAudioChannel/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        // console.log(response.data);
        setAllTheAudioChannelsOfTheServer(response.data.audio_channels);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const FetchTheVideoChannelOfTheServer = async (
    AuthToken: string,
    serverId: string
  ) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/server/FetchVideoChannel/${serverId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        // console.log(response.data);
        setAllTheVideoChannelsOfTheServer(response.data.video_channels);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const FetchTheUserOnTheBaseOfDemand = async (
    AuthToken: string,
    userType: string
  ) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/follow/FetchAllTheTypeOfUserFollowers/${userType}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      if (response.data.success) {
        if (response.data.It_Is_Pending) {
          setAllTheUsersRequestSendOrReceived({
            Send: response.data.RequestSent,
            Received: response.data.RequestReceived,
          });
        } else {
          setFetchAllTheOtherUsers(response.data.user);
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
    ServerInfoById,
    UserInformation,
    UpdateServerInfoImage,
    setUpdateServerInfoImage: setUpdateServerInfoImage as React.Dispatch<
      React.SetStateAction<object>
    >,
    GlobalAlertInformation,
    setGlobalAlertInformation: setGlobalAlertInformation as React.Dispatch<
      React.SetStateAction<object>
    >,
    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
    CurrentChatChannelInfo,
    setCurrentChatChannelInfo: setCurrentChatChannelInfo as React.Dispatch<
      React.SetStateAction<object>
    >,
    FetchAllTheOtherUsers,
    AllTheUsersRequestSendOrReceived,

    ChangingTheMemberRole,
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
    CreateNewChannelFunction,
    LeaveFromServerFunction,
    Check_The_User_Is_KickedOut,
    DeleteServerFunction,
    Check_Server_Is_Deleted,
    FetchTheTextChannelOfTheServer,
    FetchTheAudioChannelOfTheServer,
    FetchTheVideoChannelOfTheServer,
    UpdateChannelInfoFunction,
    DeleteChannelFunction,
    FetchTheUserOnTheBaseOfDemand,
  };
  return <Context.Provider value={context_value}>{children}</Context.Provider>;
};
export { Context, ContextProvider };

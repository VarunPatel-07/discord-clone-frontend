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
import { Type } from "lucide-react";

interface ContextApiProps {
  //
  //? exporting all the state
  //

  GlobalSuccessNotification: {
    ShowAlert: boolean;
    Profile_Picture: string;
    FullName: string;
    UserName: string;
    Message: string;
    Type: string;
    Notification_Position: string;
  };
  setGlobalSuccessNotification: React.Dispatch<React.SetStateAction<object>>;

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

  AllTheTextChannelsOfTheServer: Array<object>;
  AllTheAudioChannelsOfTheServer: Array<object>;
  AllTheVideoChannelsOfTheServer: Array<object>;
  CurrentChatChannelInfo: object;
  setCurrentChatChannelInfo: React.Dispatch<React.SetStateAction<object>>;
  ChangingTheMemberRole: boolean;
  FetchAllTheOtherUsers: Array<object>;

  AllTheSendRequestOfTheUser: Array<object>;
  AllTheReceivedRequestOfTheUser: Array<object>;
  AllTheFollowerOfTheUser: Array<object>;
  AllTheFollowingOfTheUser: Array<object>;
  GlobalMetaTagHandler: object;
  setGlobalMetaTagHandler: React.Dispatch<React.SetStateAction<object>>;
  AllTheMessageOfTheChannel: Array<object>;
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
  FetchingAllTheSentRequestOfUser: (AuthToken: string) => void;
  FetchingAllTheReceivedRequestOfUser: (AuthToken: string) => void;
  FetchAllTheFollowerOfTheUser: (AuthToken: string) => void;
  FetchAllTheFollowingOfTheUser: (AuthToken: string) => void;
  SendTheFollowRequestToTheUser: (
    AuthToken: string,
    UserYouWantToFollow: string
  ) => void;
  WithDrawTheSentFollowRequest: (AuthToken: string, receiverId: string) => void;
  IgnoreReceivedFollowRequest: (AuthToken: string, senderId: string) => void;
  AcceptFollowRequestFunction: (AuthToken: string, receiverId: string) => void;
  UnFollowSelectedUser: (AuthToken: string, UserId: string) => void;
  RemoveASpecificFollowerFunction: (
    AuthToken: string,
    FollowerId: string
  ) => void;
  Block_A_Specific_User: (AuthToken: string, BlockUserId: string) => void;
  UnBlock_A_Specific_User: (AuthToken: string, UnBlockUserId: string) => void;
  UpdatingTheUserProfileDetails: (
    AuthToken: string,
    formData: FormData
  ) => void;
  CreateAnOneToOneConversation: (
    AuthToken: string,
    receiver_id: string
  ) => void;
  SendMessageInTheSelectedChannelOfServer: (
    AuthToken: string,
    server_id: string,
    channel_id: string,
    content: string
  ) => void;
  FetchTheMessageOFTheChannel: (
    AuthToken: string,
    server_id: string,
    channel_id: string
  ) => void;
}

const Context = createContext<ContextApiProps | undefined>(undefined);

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { push } = useRouter();

  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;

  const socket = UseSocketIO();
  const initialState = [];
  //
  //
  // ? defining all the state
  //
  //
  const [GlobalMetaTagHandler, setGlobalMetaTagHandler] = useState({
    Title: "Discord Clone" as string,
    Description: "" as string,
    Keywords: "" as string,
  });
  const [GlobalSuccessNotification, setGlobalSuccessNotification] = useState({
    ShowAlert: false as boolean,
    Profile_Picture: "" as string,
    FullName: "" as string,
    UserName: "" as string,
    Message: "" as string,
    Type: "NORMAL" as string,
    Notification_Position: "" as string,
  });

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
  const [AllTheSendRequestOfTheUser, setAllTheSendRequestOfTheUser] = useState(
    [] as Array<object>
  );
  const [AllTheReceivedRequestOfTheUser, setAllTheReceivedRequestOfTheUser] =
    useState([] as Array<object>);
  const [AllTheFollowerOfTheUser, setAllTheFollowerOfTheUser] = useState(
    [] as Array<object>
  );
  const [AllTheFollowingOfTheUser, setAllTheFollowingOfTheUser] = useState(
    [] as Array<object>
  );
  const [AllTheMessageOfTheChannel, setAllTheMessageOfTheChannel] = useState(
    [] as Array<object>
  );

  //
  //
  // ? defining all the functions
  //
  //

  //
  // ?  The Function Below Is Used To Handel The Error Globally
  //
  const GlobalErrorHandler = (error: any) => {
    console.log("error From GlobalErrorHandler", error);
  };
  const GlobalSuccessNotificationHandler = (
    data: any,
    type: string,
    ...OtherData: any
  ) => {
    setGlobalSuccessNotification({
      ShowAlert: true,
      Message: data.message,
      Type: type,
      FullName: OtherData.FullName,
      Notification_Position: OtherData.Notification_Position,
      Profile_Picture: OtherData.Profile_Picture,
      UserName: OtherData.UserName,
    });
    setTimeout(() => {
      setGlobalSuccessNotification({
        ShowAlert: false,
        Message: "",
        Type: "",
        FullName: "",
        Notification_Position: "",
        Profile_Picture: "",
        UserName: "",
      });
    }, 2500);
  };
  //
  // ?  The Function Above Is Used To Handel The Error Globally
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
      GlobalErrorHandler(error);
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
      GlobalErrorHandler(error);
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
        GlobalErrorHandler(error);
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
      GlobalErrorHandler(error);
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
      GlobalErrorHandler(error);
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
      GlobalErrorHandler(error);
    }
  };
  const UserInfoFetchingFunction = async (AuthToken: string) => {
    try {
      if (!AuthToken) return;
      deleteCookie("User__Info");
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
      GlobalErrorHandler(error);
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
      console.log(response.data);
      if (response.data.success) {
        socket?.emit("New_UserJoined_The_Server", response.data);
        console.log(response.data);
        push(`/pages/server/${response.data.Server_Id}`);
      }
    } catch (error) {
      GlobalErrorHandler(error);
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
        socket?.emit("newServerCreationOccurred", response.data);
      }
    } catch (error) {
      GlobalErrorHandler(error);
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
        socket?.emit("newServerCreationOccurred", response.data);
        setChangingTheMemberRole(false);
      }
    } catch (error) {
      GlobalErrorHandler(error);
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
      GlobalErrorHandler(error);
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
        GlobalSuccessNotificationHandler(response.data, "NORMAL");
        socket?.emit("NewChannelHasBeenCreated", response.data);
      }
    } catch (error) {
      GlobalErrorHandler(error);
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
      console.log(response.data);
      if (response.data.success) {
        GlobalSuccessNotificationHandler(response.data, "NORMAL");
        socket?.emit("NewChannelHasBeenCreated", response.data);
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
        GlobalSuccessNotificationHandler(response.data, "NORMAL");
        socket?.emit("NewChannelHasBeenCreated");
      }
    } catch (error) {
      GlobalErrorHandler(error);
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
      GlobalErrorHandler(error);
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
      GlobalErrorHandler(error);
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
      GlobalErrorHandler(error);
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
      GlobalErrorHandler(error);
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
        setAllTheTextChannelsOfTheServer(response.data.text_channels);
      }
    } catch (error) {
      GlobalErrorHandler(error);
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
        setAllTheAudioChannelsOfTheServer(response.data.audio_channels);
      }
    } catch (error) {
      GlobalErrorHandler(error);
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
        setAllTheVideoChannelsOfTheServer(response.data.video_channels);
      }
    } catch (error) {
      GlobalErrorHandler(error);
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

      if (response.data.success) {
        setFetchAllTheOtherUsers(response.data.user);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const FetchingAllTheSentRequestOfUser = async (AuthToken: string) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/follow/FetchAllTheSentRequestsOfUser`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setAllTheSendRequestOfTheUser(response.data.sent_requests);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const FetchingAllTheReceivedRequestOfUser = async (AuthToken: string) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/follow/FetchAllTheReceivedRequestsOfUser`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setAllTheReceivedRequestOfTheUser(response.data.received_requests);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const FetchAllTheFollowerOfTheUser = async (AuthToken: string) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/follow/FetchAllTheFollowersOfUser`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setAllTheFollowerOfTheUser(response.data.followers);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const FetchAllTheFollowingOfTheUser = async (AuthToken: string) => {
    try {
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/follow/FetchAllTheFollowingOfUser`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setAllTheFollowingOfTheUser(response.data.following);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const SendTheFollowRequestToTheUser = async (
    AuthToken: string,
    UserYouWantToFollow: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("UserIdYouWantToFollow", UserYouWantToFollow);
      const response = await axios({
        method: "post",
        url: `${Host}/app/api/follow/SendFollowRequest`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (response.data.success) {
        socket?.emit("NewFollowRequestHasBeenSent", response.data);
        GlobalSuccessNotificationHandler(response.data, "NORMAL");
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const WithDrawTheSentFollowRequest = async (
    AuthToken: string,
    receiverId: string
  ) => {
    try {
      if (!AuthToken) return;
      const formData = new FormData();
      formData.append("receiverId", receiverId);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/follow/WithdrawTheFollowRequest`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (response.data.success) {
        socket?.emit("A_FollowRequestHasBeenWithdrawn");
        GlobalSuccessNotificationHandler(response.data, "NORMAL");
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const IgnoreReceivedFollowRequest = async (
    AuthToken: string,
    senderId: string
  ) => {
    try {
      if (!AuthToken) return;
      const formData = new FormData();
      formData.append("senderId", senderId);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/follow/IgnoreTheFollowRequestFromTheUser`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (response.data.success) {
        socket?.emit("A_FollowRequestHasBeenIgnored");
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const AcceptFollowRequestFunction = async (
    AuthToken: string,
    receiverId: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("receiverId", receiverId);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/follow/AcceptTheFollowRequestOfTheUser`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (response.data.success) {
        socket?.emit("YourFollowRequestHasBeenAccepted", response.data);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const UnFollowSelectedUser = async (AuthToken: string, UserId: string) => {
    try {
      if (!AuthToken || UserId === "undefined") return;
      const formData = new FormData();
      formData.append("followerId", UserId);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/follow//UnfollowTheSpecificUser`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      console.log(response.data);
      if (response.data.success) {
        socket?.emit("UserUnFollowedAnFollower", response.data);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const RemoveASpecificFollowerFunction = async (
    AuthToken: string,
    FollowerId: string
  ) => {
    try {
      if (!AuthToken || FollowerId === "undefined") return;
      const formData = new FormData();
      formData.append("followerId", FollowerId);

      const response = await axios({
        method: "put",
        url: `${Host}/app/api/follow/RemoveFollowerFromYourFollowerList`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (response.data.success) {
        socket?.emit("AnFollowerHasBeenRemoved");
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const Block_A_Specific_User = async (
    AuthToken: string,
    BlockUserId: string
  ) => {
    try {
      if (!AuthToken || BlockUserId === "undefined") return;
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/follow/BlockASpecificUser/${BlockUserId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        socket?.emit("AnUserBlockedSuccessfully");
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const UnBlock_A_Specific_User = async (
    AuthToken: string,
    unBlockUserId: string
  ) => {
    try {
      if (!AuthToken || unBlockUserId === "undefined") return;
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/follow/UnBlockASpecificUser/${unBlockUserId}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        socket?.emit("AnUser_UnBlocked_Successfully");
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const UpdatingTheUserProfileDetails = async (
    AuthToken: string,
    formData: FormData
  ) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/auth/updateUserDetails`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      console.log(response.data);
      if (response.data.success) {
        socket?.emit("UserProfileUpdatedSuccessfully", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CreateAnOneToOneConversation = async (
    AuthToken: string,
    receiver_id: string
  ) => {
    try {
      console.log(receiver_id);
      if (!AuthToken || receiver_id === "undefined") return;
      const formData = new FormData();
      formData.append("receiver_id", receiver_id);
      const response = await axios({
        method: "post",
        url: `${Host}/app/api/Messages/CreateOneToOneChat`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      console.log(response.data);
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };

  const SendMessageInTheSelectedChannelOfServer = async (
    AuthToken: string,
    server_id: string,
    channel_id: string,
    content: string
  ) => {
    try {
      if (!AuthToken || server_id === "undefined") return;
      const formData = new FormData();
      formData.append("server_id", server_id);
      formData.append("channel_id", channel_id);
      formData.append("content", content);
      const response = await axios({
        method: "post",
        url: `${Host}/app/api/Messages/sendMessageInTheSelectedChannel`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      console.log(response.data);
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const FetchTheMessageOFTheChannel = async (
    AuthToken: string,
    server_id: string,
    channel_id: string
  ) => {
    try {
      console.log(server_id, channel_id, AuthToken);
      if (!AuthToken || server_id === "undefined" || channel_id === "undefined")
        return;

      const response = await axios({
        method: "get",
        url: `${Host}/app/api/Messages/FetchingMessagesOfChannel?server_id=${server_id}&channel_id=${channel_id}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setAllTheMessageOfTheChannel(response.data.Data);
        // socket?.emit("NewMessageHasBeenSent", response.data);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };

  //
  // ? defining the context value
  //
  const context_value = {
    GlobalMetaTagHandler,
    setGlobalMetaTagHandler: setGlobalMetaTagHandler as React.Dispatch<
      React.SetStateAction<object>
    >,

    GlobalSuccessNotification,
    setGlobalSuccessNotification:
      setGlobalSuccessNotification as React.Dispatch<
        React.SetStateAction<object>
      >,
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

    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
    CurrentChatChannelInfo,
    setCurrentChatChannelInfo: setCurrentChatChannelInfo as React.Dispatch<
      React.SetStateAction<object>
    >,

    FetchAllTheOtherUsers,
    AllTheSendRequestOfTheUser,
    AllTheReceivedRequestOfTheUser,
    ChangingTheMemberRole,
    AllTheFollowerOfTheUser,
    AllTheFollowingOfTheUser,
    AllTheMessageOfTheChannel,
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
    FetchingAllTheSentRequestOfUser,
    FetchingAllTheReceivedRequestOfUser,
    FetchAllTheFollowerOfTheUser,
    FetchAllTheFollowingOfTheUser,
    SendTheFollowRequestToTheUser,
    WithDrawTheSentFollowRequest,
    IgnoreReceivedFollowRequest,
    AcceptFollowRequestFunction,
    UnFollowSelectedUser,
    RemoveASpecificFollowerFunction,
    Block_A_Specific_User,
    UnBlock_A_Specific_User,
    UpdatingTheUserProfileDetails,
    CreateAnOneToOneConversation,
    SendMessageInTheSelectedChannelOfServer,
    FetchTheMessageOFTheChannel,
  };
  return <Context.Provider value={context_value}>{children}</Context.Provider>;
};
export { Context, ContextProvider };

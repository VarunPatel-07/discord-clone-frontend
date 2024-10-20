"use client";
import React, { createContext, useState, ReactNode } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import UseSocketIO from "@/hooks/UseSocketIO";
import { v4 as uuidv4 } from "uuid";
import { NotificationType } from "@/enums/enums";

interface GlobalNotification {
  id: string;
  Show_Notification: boolean;
  Profile_Picture: string;
  FullName: string;
  UserName: string;
  Message: string;
  Type: NotificationType;
  Notification_Position: string;
  Notification_Time: number;
  ProfileBgColor: string;
  ProfileBanner_Color: string;
}

interface ContextApiProps {
  //
  //? exporting all the state
  //

  GlobalSuccessNotification: GlobalNotification[];
  setGlobalSuccessNotification: React.Dispatch<React.SetStateAction<GlobalNotification[]>>;

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
  AllTheMessageOfTheChannel: {
    HasMoreData: boolean;
    Message: Array<object>;
    TotalPage: number;
  };
  editingAMessage: {
    is_Editing: boolean;
    data: object;
  };
  setEditingAMessage: React.Dispatch<React.SetStateAction<object>>;
  replyingASpecificMessage: {
    is_Replying: boolean;
    data: object;
  };
  setReplyingASpecificMessage: React.Dispatch<React.SetStateAction<object>>;
  ANew_VideoMeeting_HasBeenStarted: {
    Call_Started: boolean;
    Meeting_Initiator_Info: object;
    Server_Info: object;
    MeetingId: string;
    ChannelInfo: object;
  };
  setANew_VideoMeeting_HasBeenStarted: React.Dispatch<React.SetStateAction<object>>;
  ANew_AudioMeeting_HasBeenStarted: {
    Call_Started: boolean;
    Meeting_Initiator_Info: object;
    Server_Info: object;
    MeetingId: string;
    ChannelInfo: object;
  };
  setANew_AudioMeeting_HasBeenStarted: React.Dispatch<React.SetStateAction<Object>>;
  AnIncoming_VideoCall_Occurred: {
    An_Incoming_Call: boolean;
    Meeting_Initiator_Info: object;
    Server_Info: object;
    MeetingId: string;
    You_Joined: boolean;
    ChannelInfo: object;
  };
  setAnIncoming_VideoCall_Occurred: React.Dispatch<React.SetStateAction<object>>;
  AnIncoming_AudioCall_Occurred: {
    An_Incoming_Call: boolean;
    Meeting_Initiator_Info: object;
    Server_Info: object;
    MeetingId: string;
    You_Joined: boolean;
    ChannelInfo: object;
  };
  setAnIncoming_AudioCall_Occurred: React.Dispatch<React.SetStateAction<object>>;
  PinningAnSpecificVideoStream: {
    PinVideo: boolean;
    video_id: string;
  };
  Current_VideoCall_Participant_Info: object;
  setCurrent_VideoCall_Participant_Info: React.Dispatch<React.SetStateAction<object>>;
  Current_AudioCall_Participant_Info: object;
  setCurrent_AudioCall_Participant_Info: React.Dispatch<React.SetStateAction<object>>;
  setPinningAnSpecificVideoStream: React.Dispatch<React.SetStateAction<object>>;
  selectedFinalImagesArray: Array<File>;
  setSelectedFinalImagesArray: React.Dispatch<React.SetStateAction<Array<File>>>;
  selectedFilesFinalArray: Array<File>;
  setSelectedFilesFinalArray: React.Dispatch<React.SetStateAction<Array<File>>>;

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
  RegeneratingServerInviteCodeFunction: (AuthToken: string, serverId: string) => object;
  JoiningServerWithInvitationCode: (AuthToken: string, serverId: string, invitationCode: string) => object;
  UpdatingServerInformationFunction: (AuthToken: string, server_info: object) => void;
  ChangingMemberRoleFunction: (
    AuthToken: string,
    serverId: string,
    MemberId: string,
    CurrentMemberRole: string,
    user_Id: string
  ) => void;
  KickOutMemberFromServerFunction: (AuthToken: string, serverId: string, userId: string, memberId: string) => void;
  CreateNewChannelFunction: (AuthToken: string, serverId: string, ChannelName: string, ChannelType: string) => void;
  LeaveFromServerFunction: (AuthToken: string, serverId: string, userId: string, memberId: string) => void;
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
  FetchTheAudioChannelOfTheServer: (AuthToken: string, serverId: string) => void;
  FetchTheVideoChannelOfTheServer: (AuthToken: string, serverId: string) => void;
  UpdateChannelInfoFunction: (
    AuthToken: string,
    serverId: string,
    ChannelName: string,
    ChannelType: string,
    channelId: string
  ) => void;
  DeleteChannelFunction: (AuthToken: string, serverId: string, channelId: string) => void;
  FetchTheUserOnTheBaseOfDemand: (AuthToken: string, userType: string) => void;
  FetchingAllTheSentRequestOfUser: (AuthToken: string) => void;
  FetchingAllTheReceivedRequestOfUser: (AuthToken: string) => void;
  FetchAllTheFollowerOfTheUser: (AuthToken: string) => void;
  FetchAllTheFollowingOfTheUser: (AuthToken: string) => void;
  SendTheFollowRequestToTheUser: (AuthToken: string, UserYouWantToFollow: string) => void;
  WithDrawTheSentFollowRequest: (AuthToken: string, receiverId: string) => void;
  IgnoreReceivedFollowRequest: (AuthToken: string, senderId: string) => void;
  AcceptFollowRequestFunction: (AuthToken: string, receiverId: string) => void;
  UnFollowSelectedUser: (AuthToken: string, UserId: string) => void;
  RemoveASpecificFollowerFunction: (AuthToken: string, FollowerId: string) => void;
  Block_A_Specific_User: (AuthToken: string, BlockUserId: string) => void;
  UnBlock_A_Specific_User: (AuthToken: string, UnBlockUserId: string) => void;
  UpdatingTheUserProfileDetails: (AuthToken: string, formData: FormData) => void;
  CreateAnOneToOneConversation: (AuthToken: string, receiver_id: string) => void;
  SendMessageInTheSelectedChannelOfServer: (
    AuthToken: string,
    server_id: string,
    channel_id: string,
    content: string
  ) => void;
  FetchTheMessageOFTheChannel: (
    AuthToken: string,
    server_id: string,
    channel_id: string,
    Page: number,
    Limit: number
  ) => void;
  EditMessageFunction: (AuthToken: string, message_id: string, content: string, Current_Page: number) => void;
  DeleteMessageFunction: (AuthToken: string, message_id: string, Current_Page: number) => void;
  Reply_A_SpecificMessageFunction: (
    AuthToken: string,
    server_id: string,
    channel_id: string,
    content: string,
    replying_to_message: string,
    replying_to_user_member_id: string,
    replying_message_message_id: string,
    replyingImage: string
  ) => void;
  Delete_MessageReplayFunction: (AuthToken: string, message_id: string, message_replay_id: string) => void;
  Edit_MessageReplayFunction: (
    AuthToken: string,
    message_id: string,
    message_replay_id: string,
    content: string
  ) => void;
  SendVideoCallInfoSdp_To_Backend: (AuthToken: string, Payload: any) => void;
  GlobalNotificationHandlerFunction: (
    data: any,
    type: NotificationType,
    Message: string,
    NotificationPosition?: string,
    NotificationTime?: number,
    sender_id?: string,
    receiver_id?: string
  ) => void;
  StoreMessageNotificationInTheDB: (
    AuthToken: string,
    sender_id: string,
    server_id: string,
    channel_id: string,
    type: string,
    message: string
  ) => void;
  FetchingAllTheOneToOneConversation: (AuthToken: string) => void;
  FetchAllTheMessageOfAnOneToOneConversation: (AuthToken: string, conversation_id: string, Page: number) => void;
  replyingMessageInOneOnOneConversation: (AuthToken: string, formData: FormData, conversation_id: string) => void;
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
  const [GlobalSuccessNotification, setGlobalSuccessNotification] = useState<GlobalNotification[]>([]);

  const [editingAMessage, setEditingAMessage] = useState({
    is_Editing: false as boolean,
    data: {},
  });
  const [replyingASpecificMessage, setReplyingASpecificMessage] = useState({
    is_Replying: false as boolean,
    data: {},
  });

  const [Global_Server_Profile_Image, setGlobal_Server_Profile_Image] = useState({
    Preview__Image__URL: "",
    File_Of_Image: "" as any,
  });
  const [Show_Create_Server_PopUp, setShow_Create_Server_PopUp] = useState(false as boolean);
  const [Including_Server_Info_Array, setIncluding_Server_Info_Array] = useState(initialState);
  const [ServerInfoById, setServerInfoById] = useState("" as any);
  const [UserInformation, setUserInformation] = useState("" as any);

  const [UpdateServerInfoImage, setUpdateServerInfoImage] = useState({
    Preview_Image: "" as string,
    File_Of_Image: "" as any,
  });

  const [AllTheTextChannelsOfTheServer, setAllTheTextChannelsOfTheServer] = useState([] as Array<object>);
  const [AllTheAudioChannelsOfTheServer, setAllTheAudioChannelsOfTheServer] = useState([] as Array<object>);
  const [AllTheVideoChannelsOfTheServer, setAllTheVideoChannelsOfTheServer] = useState([] as Array<object>);
  const [CurrentChatChannelInfo, setCurrentChatChannelInfo] = useState({
    ChatId: "" as string,
    ChatName: "" as string,
    ChatType: "TEXT" as string,
    ChatUserId: "" as string,
  });
  const [ChangingTheMemberRole, setChangingTheMemberRole] = useState(false as boolean);

  const [FetchAllTheOtherUsers, setFetchAllTheOtherUsers] = useState([] as Array<object>);
  const [AllTheSendRequestOfTheUser, setAllTheSendRequestOfTheUser] = useState([] as Array<object>);
  const [AllTheReceivedRequestOfTheUser, setAllTheReceivedRequestOfTheUser] = useState([] as Array<object>);
  const [AllTheFollowerOfTheUser, setAllTheFollowerOfTheUser] = useState([] as Array<object>);
  const [AllTheFollowingOfTheUser, setAllTheFollowingOfTheUser] = useState([] as Array<object>);
  const [AllTheMessageOfTheChannel, setAllTheMessageOfTheChannel] = useState({
    HasMoreData: false as boolean,
    Message: [] as Array<object>,
    TotalPage: 0 as number,
  });
  const [ANew_VideoMeeting_HasBeenStarted, setANew_VideoMeeting_HasBeenStarted] = useState({
    Call_Started: false as boolean,
    Meeting_Initiator_Info: {} as object,
    Server_Info: {} as object,
    MeetingId: "" as string,
    ChannelInfo: {} as object,
  });
  const [ANew_AudioMeeting_HasBeenStarted, setANew_AudioMeeting_HasBeenStarted] = useState({
    Call_Started: false as boolean,
    Meeting_Initiator_Info: {} as object,
    Server_Info: {} as object,
    MeetingId: "" as string,
    ChannelInfo: {} as object,
  });
  const [AnIncoming_VideoCall_Occurred, setAnIncoming_VideoCall_Occurred] = useState({
    An_Incoming_Call: false as boolean,
    Meeting_Initiator_Info: {} as object,
    Server_Info: {} as object,
    MeetingId: "" as string,
    You_Joined: false as boolean,
    ChannelInfo: {} as object,
  });
  const [AnIncoming_AudioCall_Occurred, setAnIncoming_AudioCall_Occurred] = useState({
    An_Incoming_Call: false as boolean,
    Meeting_Initiator_Info: {} as object,
    Server_Info: {} as object,
    MeetingId: "" as string,
    You_Joined: false as boolean,
    ChannelInfo: {} as object,
  });

  const [PinningAnSpecificVideoStream, setPinningAnSpecificVideoStream] = useState({
    PinVideo: false as boolean,
    video_id: "" as string,
  });
  const [Current_VideoCall_Participant_Info, setCurrent_VideoCall_Participant_Info] = useState({} as any);
  const [Current_AudioCall_Participant_Info, setCurrent_AudioCall_Participant_Info] = useState({} as any);

  const [GlobalNotificationStoredInDB, setGlobalNotificationStoredInDB] = useState([] as Array<object>);
  const [selectedOneToOneChatInfo, setSelectedOneToOneChatInfo] = useState({} as any);
  const [selectedFinalImagesArray, setSelectedFinalImagesArray] = useState([] as Array<File>);
  const [selectedFilesFinalArray, setSelectedFilesFinalArray] = useState([] as Array<File>);
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
    GlobalNotificationHandlerFunction("", NotificationType.ERROR, "internal server error");
  };
  const GlobalNotificationHandlerFunction = async (
    data: any,
    type: NotificationType,
    Message: string,
    NotificationPosition?: string,
    NotificationTime?: number
  ) => {
    const uuid = uuidv4();
    const NotificationData = {
      id: uuid,
      Show_Notification: true,
      Profile_Picture: data.Profile_Picture || "",
      FullName: data.FullName || "",
      UserName: data.UserName || "",
      Message: Message,
      Type: type,
      Notification_Position: NotificationPosition || "top-right",
      Notification_Time: NotificationTime || 3000,
      ProfileBgColor: data.ProfileBgColor || "",
      ProfileBanner_Color: data.ProfileBanner_Color || "",
    };
    setGlobalSuccessNotification((prev: Array<GlobalNotification>) => [...prev, NotificationData]);

    setTimeout(() => {
      const element = document.getElementById(NotificationData.id);
      if (element) {
        element.classList.remove("animate-enter");
        element.classList.add("animate-exit");
        element.addEventListener("animationend", () => {
          setGlobalSuccessNotification((prev: Array<GlobalNotification>) =>
            prev.filter((item: GlobalNotification) => item.id !== uuid)
          );
        });
      }
    }, NotificationTime || 3000);
  };
  const StoreFriendRequestInTheDB = async (sender_id: string, receiver_id: string, Message: string) => {
    try {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const formData = new FormData();
      formData.append("sender_id", sender_id);
      formData.append("receiver_id", receiver_id);
      formData.append("type", "FRIEND_REQUEST");
      formData.append("message", Message);

      const response = await axios({
        method: "post",
        url: `${Host}/app/api/Notification/FollowNotification`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (response.data.success) {
        setGlobalNotificationStoredInDB((prev: Array<object>) => [...prev, response?.data?.data]);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const StoreMessageNotificationInTheDB = async (
    AuthToken: string,
    sender_id: string,
    server_id: string,
    channel_id: string,
    type: string,
    message: string
  ) => {
    try {
      if (!server_id || !channel_id || !type || !message) return;
      const formData = new FormData();
      formData.append("sender_id", sender_id);
      formData.append("server_id", server_id);
      formData.append("channel_id", channel_id);
      formData.append("type", type);
      formData.append("message", message);
      await axios({
        method: "post",
        url: `${Host}/app/api/Notification/StoreMessageNotification`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: AuthToken,
        },
        data: formData,
      });
    } catch (error) {
      GlobalErrorHandler(error);
    }
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
        const { UserName, Password, Email, FullName, DateOfBirth } = user_info as any;

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
  const Create_New_Server_Function = async (server_info: object, AuthToken: string) => {
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
          return response?.data?.server_id;
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
  const FetchingTheServerInfoByServerId = async (serverId: string, AuthToke: string) => {
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
      // deleteCookie("User__Info");
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

  const RegeneratingServerInviteCodeFunction = async (AuthToken: string, serverId: string) => {
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
  const JoiningServerWithInvitationCode = async (AuthToken: string, InvitationCode: string) => {
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
        socket?.emit("New_UserJoined_The_Server", response.data);

        push(`/pages/server/${response.data.Server_Id}`);
      }
    } catch (error) {
      GlobalErrorHandler(error);
      return { success: false };
    }
  };
  const UpdatingServerInformationFunction = async (AuthToken: string, server_info: object) => {
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
        FetchingTheServerInfoByServerId(serverId, AuthToken);
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
        GlobalNotificationHandlerFunction(response.data, NotificationType.NORMAL, "New Channel Has Been Created");
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
        GlobalNotificationHandlerFunction(response.data, NotificationType.NORMAL, "Channel Has Been Updated");
        socket?.emit("NewChannelHasBeenCreated", response.data);
      }
    } catch (error) {}
  };
  const DeleteChannelFunction = async (AuthToken: string, serverId: string, channelId: string) => {
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
        GlobalNotificationHandlerFunction(response.data, NotificationType.NORMAL, "Channel Has Been Deleted");
        socket?.emit("NewChannelHasBeenCreated");
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const LeaveFromServerFunction = async (AuthToken: string, serverId: string, userId: string, memberId: string) => {
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
      if (UserCurrentPath.includes("server") && UserCurrentPath.includes(SocketData.serverId)) {
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
      if (UserCurrentPath.includes("server") && UserCurrentPath.includes(SocketData.serverId)) {
        const serverId = UserCurrentPath[3];
        if (serverId === SocketData.serverId) {
          if (SocketData.adminId === JSON.parse(getCookie("User__Info") || "").id) {
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
  const FetchTheTextChannelOfTheServer = async (AuthToken: string, serverId: string) => {
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
  const FetchTheAudioChannelOfTheServer = async (AuthToken: string, serverId: string) => {
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
  const FetchTheVideoChannelOfTheServer = async (AuthToken: string, serverId: string) => {
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
  const FetchTheUserOnTheBaseOfDemand = async (AuthToken: string, userType: string) => {
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
  const SendTheFollowRequestToTheUser = async (AuthToken: string, UserYouWantToFollow: string) => {
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
        GlobalNotificationHandlerFunction(response.data, NotificationType.NORMAL, "Follow Request Has Been Sent");
        StoreFriendRequestInTheDB(
          response.data?.request_sender_info?.id,
          response.data?.request_receiver_info?.id,
          "wants to follow"
        );
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const WithDrawTheSentFollowRequest = async (AuthToken: string, receiverId: string) => {
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
        GlobalNotificationHandlerFunction(response.data, NotificationType.NORMAL, "Follow Request Has Been Withdrawn");
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const IgnoreReceivedFollowRequest = async (AuthToken: string, senderId: string) => {
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
  const AcceptFollowRequestFunction = async (AuthToken: string, receiverId: string) => {
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
  const RemoveASpecificFollowerFunction = async (AuthToken: string, FollowerId: string) => {
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
  const Block_A_Specific_User = async (AuthToken: string, BlockUserId: string) => {
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
  const UnBlock_A_Specific_User = async (AuthToken: string, unBlockUserId: string) => {
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
  const UpdatingTheUserProfileDetails = async (AuthToken: string, formData: FormData) => {
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

  const CreateAnOneToOneConversation = async (AuthToken: string, receiver_id: string) => {
    try {
      if (!AuthToken || receiver_id === "undefined") return;
      const formData = new FormData();
      formData.append("receiver_id", receiver_id);
      const response = await axios({
        method: "post",
        url: `${Host}/app/api/OneToOneMessage/CreateOneToOneChat`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      return response.data.data;
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const FetchAllTheMessageOfAnOneToOneConversation = async (AuthToken, conversation_id, Page = 1) => {
    try {
      if (!AuthToken || conversation_id === "undefined") return;
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/OneToOneMessage/FetchConversationMessages/${conversation_id}?page=${Page}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };

  const replyingMessageInOneOnOneConversation = async (
    AuthToken: string,
    formData: FormData,
    conversation_id: string
  ) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "post",
        url: `${Host}/app/api/OneToOneMessage/replyMessage?conversation_id=${conversation_id}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      socket?.emit("NewMessageInOneOnOneConversation", response.data);
      return response.data;
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };

  const FetchingAllTheOneToOneConversation = async (AuthToken) => {
    try {
      if (!AuthToken) return;
      const response = await axios({
        method: "get",
        url: `${Host}/app/api/OneToOneMessage/FetchAllTheConversation`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        return response.data;
      }
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
      if (response.data.success) {
        socket?.emit("NewMessageHasBeenSent", response.data);
        return response.data.data;
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const FetchTheMessageOFTheChannel = async (
    AuthToken: string,
    server_id: string,
    channel_id: string,
    Page: number,
    Limit: number
  ) => {
    console.log("fetching message");
    try {
      if (!AuthToken || server_id === "undefined" || channel_id === "undefined") {
        return;
      }

      const response = await axios({
        method: "get",
        url: `${Host}/app/api/Messages/FetchingMessagesOfChannel?server_id=${server_id}&channel_id=${channel_id}&page=${Page}&limit=${Limit}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        return response.data.Data;
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const EditMessageFunction = async (AuthToken: string, message_id: string, content: string, Current_Page: number) => {
    try {
      if (!AuthToken || message_id === "undefined") return;
      const formData = new FormData();
      formData.append("message", content);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/Messages/EditMessage?message_id=${message_id}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (response.data.success) {
        const Data = {
          response: response.data,
          currentPage: Current_Page,
        };
        socket?.emit("MessageHasBeenEditedSuccessfully", Data);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const DeleteMessageFunction = async (AuthToken: string, message_id: string) => {
    try {
      if (!AuthToken || message_id === "undefined") return;

      const response = await axios({
        method: "put",
        url: `${Host}/app/api/Messages/DeleteMessage?message_id=${message_id}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        const Data = {
          response: response.data,
        };
        socket?.emit("MessageHasBeenEditedSuccessfully", Data);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };

  const Reply_A_SpecificMessageFunction = async (
    AuthToken: string,
    server_id: string,
    channel_id: string,
    content: string,
    replying_to_message: string,
    replying_to_user_member_id: string,
    replying_message_message_id: string,
    replyingImage: string
  ) => {
    try {
      if (!AuthToken || server_id === "undefined") return;
      const formData = new FormData();
      formData.append("server_id", server_id);
      formData.append("channel_id", channel_id);
      formData.append("content", content);

      formData.append("replying_to_message", replying_to_message);

      formData.append("replying_to_user_member_id", replying_to_user_member_id);

      formData.append("replying_message_message_id", replying_message_message_id);
      formData.append("replyingImage", replyingImage);

      const response = await axios({
        method: "put",
        url: `${Host}/app/api/Messages/ReplayMessage`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (response.data.success) {
        socket?.emit("NewMessageHasBeenSent", response.data);
        return response.data.data;
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };

  const Delete_MessageReplayFunction = async (AuthToken: string, message_id: string, message_replay_id: string) => {
    try {
      if (!AuthToken || message_id === "undefined") return;

      const response = await axios({
        method: "put",
        url: `${Host}/app/api/Messages/DeleteMessageReply?message_id=${message_id}&message_replay_id=${message_replay_id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: AuthToken,
        },
      });
      console.log(response.data);
      if (response.data.success) {
        const Data = {
          response: response.data,
        };
        socket?.emit("MessageHasBeenEditedSuccessfully", Data);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const Edit_MessageReplayFunction = async (
    AuthToken: string,
    message_id: string,
    message_replay_id: string,
    content: string
  ) => {
    try {
      if (!AuthToken || message_id === "undefined" || message_replay_id === "undefined" || content === "") return;
      const formData = new FormData();
      formData.append("content", content);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/Messages/EditMessageReply?message_id=${message_id}&message_replay_id=${message_replay_id}`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (response.data.success) {
        const Data = {
          response: response.data,
        };
        socket?.emit("MessageHasBeenEditedSuccessfully", Data);
      }
    } catch (error) {
      GlobalErrorHandler(error);
    }
  };
  const SendVideoCallInfoSdp_To_Backend = async (AuthToken: string, Payload: any) => {
    try {
      if (!AuthToken) return;
      console.log(Payload);
      const formData = new FormData();
      formData.append("Payload", Payload);
      const response = await axios({
        method: "post",
        url: `${Host}/app/api/webrtc/StartVideoCall`,
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

  // const SendImagesToTheSelectedTextChannel = async (AuthToke: string, channel_id: string, payload: FormData) => {
  //   try {
  //     console.log(AuthToke, channel_id, payload);
  //     if (!AuthToke || channel_id === undefined) return;
  //     console.log("sending The Message .......");
  //     const response = await axios({
  //       method: "post",
  //       url: `${Host}/app/api/Messages/SendImagesInTheChannel`,
  //       headers: {
  //         Authorization: AuthToke,
  //         "Content-Type": "multipart/form-data",
  //       },
  //       data: payload,
  //     });
  //     console.log("api Called");
  //     console.log(response);
  //   } catch (error) {
  //     GlobalErrorHandler(error);
  //   }
  // };

  //
  // ? defining the context value
  //
  const context_value = {
    GlobalMetaTagHandler,
    setGlobalMetaTagHandler: setGlobalMetaTagHandler as React.Dispatch<React.SetStateAction<object>>,

    GlobalSuccessNotification,
    setGlobalSuccessNotification: setGlobalSuccessNotification as React.Dispatch<
      React.SetStateAction<GlobalNotification[]>
    >,
    Global_Server_Profile_Image,
    setGlobal_Server_Profile_Image: setGlobal_Server_Profile_Image as React.Dispatch<React.SetStateAction<object>>,
    Show_Create_Server_PopUp,
    setShow_Create_Server_PopUp,
    Including_Server_Info_Array,
    ServerInfoById,
    UserInformation,
    UpdateServerInfoImage,
    setUpdateServerInfoImage: setUpdateServerInfoImage as React.Dispatch<React.SetStateAction<object>>,

    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
    CurrentChatChannelInfo,
    setCurrentChatChannelInfo: setCurrentChatChannelInfo as React.Dispatch<React.SetStateAction<object>>,

    FetchAllTheOtherUsers,
    AllTheSendRequestOfTheUser,
    AllTheReceivedRequestOfTheUser,
    ChangingTheMemberRole,
    AllTheFollowerOfTheUser,
    AllTheFollowingOfTheUser,
    AllTheMessageOfTheChannel,

    editingAMessage,
    setEditingAMessage: setEditingAMessage as React.Dispatch<React.SetStateAction<object>>,
    replyingASpecificMessage,
    setReplyingASpecificMessage: setReplyingASpecificMessage as React.Dispatch<React.SetStateAction<object>>,

    ANew_VideoMeeting_HasBeenStarted,
    setANew_VideoMeeting_HasBeenStarted: setANew_VideoMeeting_HasBeenStarted as React.Dispatch<
      React.SetStateAction<object>
    >,
    ANew_AudioMeeting_HasBeenStarted,
    setANew_AudioMeeting_HasBeenStarted: setANew_AudioMeeting_HasBeenStarted as React.Dispatch<
      React.SetStateAction<object>
    >,
    AnIncoming_VideoCall_Occurred,
    setAnIncoming_VideoCall_Occurred: setAnIncoming_VideoCall_Occurred as React.Dispatch<React.SetStateAction<object>>,
    AnIncoming_AudioCall_Occurred,
    setAnIncoming_AudioCall_Occurred: setAnIncoming_AudioCall_Occurred as React.Dispatch<React.SetStateAction<object>>,
    PinningAnSpecificVideoStream,
    setPinningAnSpecificVideoStream: setPinningAnSpecificVideoStream as React.Dispatch<React.SetStateAction<object>>,
    Current_VideoCall_Participant_Info,
    setCurrent_VideoCall_Participant_Info: setCurrent_VideoCall_Participant_Info as React.Dispatch<
      React.SetStateAction<object>
    >,
    Current_AudioCall_Participant_Info,
    setCurrent_AudioCall_Participant_Info: setCurrent_AudioCall_Participant_Info as React.Dispatch<
      React.SetStateAction<object>
    >,
    selectedFinalImagesArray,
    setSelectedFinalImagesArray: setSelectedFinalImagesArray as React.Dispatch<React.SetStateAction<Array<File>>>,
    selectedFilesFinalArray,
    setSelectedFilesFinalArray: setSelectedFilesFinalArray as React.Dispatch<React.SetStateAction<Array<File>>>,

    selectedOneToOneChatInfo,
    setSelectedOneToOneChatInfo: setSelectedOneToOneChatInfo as React.Dispatch<React.SetStateAction<object>>,
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
    EditMessageFunction,
    DeleteMessageFunction,
    Reply_A_SpecificMessageFunction,
    Delete_MessageReplayFunction,
    Edit_MessageReplayFunction,
    SendVideoCallInfoSdp_To_Backend,
    GlobalNotificationHandlerFunction,
    StoreMessageNotificationInTheDB,
    FetchingAllTheOneToOneConversation,
    FetchAllTheMessageOfAnOneToOneConversation,
    replyingMessageInOneOnOneConversation,
  };
  return <Context.Provider value={context_value}>{children}</Context.Provider>;
};
export { Context, ContextProvider };

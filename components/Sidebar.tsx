"use client";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { FaDiscord, FaPlus } from "react-icons/fa";
import "./scss/components.css";
import { Context } from "@/context/ContextApi";
import Create_Update_Server_PopUp from "./Create_Update_Server_PopUp";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getCookie, setCookie } from "cookies-next";
import { MdExplore } from "react-icons/md";
import UseSocketIO from "@/hooks/UseSocketIO";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { NotificationType } from "@/enums/enums";

function Sidebar() {

  const { push } = useRouter();
  const {
    setShow_Create_Server_PopUp,
    FetchTheIncludingServer,
    Including_Server_Info_Array,
    UserInfoFetchingFunction,
    setAnIncoming_AudioCall_Occurred,
    setAnIncoming_VideoCall_Occurred,
    UserInformation,
    GlobalNotificationHandlerFunction,
    FetchingAllTheSentRequestOfUser,
    FetchingAllTheReceivedRequestOfUser,
    FetchTheUserOnTheBaseOfDemand,
    StoreMessageNotificationInTheDB,
    CurrentChatChannelInfo,
  } = useContext(Context) as any;

  const [ShowAccountSettingPopUp, setShowAccountSettingPopUp] = useState(
    false as boolean
  );
  const socket = UseSocketIO();
  const Path = usePathname();

  const A_New_CallHasBeen_Started = useCallback(
    (data) => {
      const User_Info = UserInformation
        ? UserInformation
        : JSON?.parse(getCookie("User__Info") as string);

      if (
        data.ServerInfo.members.some(
          (member: any) => member.userId === User_Info?.id
        )
      ) {
        if (data?.CallInitiatorInfo?.id === User_Info?.id) {
          return;
        }
        const NotificationData = {
          Profile_Picture: data?.CallInitiatorInfo?.Profile_Picture as string,
          FullName: data?.CallInitiatorInfo?.FullName as string,
          UserName: data?.CallInitiatorInfo?.UserName as string,
          ProfileBgColor: data?.CallInitiatorInfo?.ProfileBgColor as string,
          ProfileBanner_Color: data?.CallInitiatorInfo
            ?.ProfileBanner_Color as string,
        };
        GlobalNotificationHandlerFunction(
          NotificationData,
          NotificationType.MESSAGE,
          `Started An Video Call In "${data?.ServerInfo?.name}" Server`,
          "top-right",
          4000
        );
        if (data?.ChannelInfo?.ChatType === "VIDEO") {
          setAnIncoming_VideoCall_Occurred({
            An_Incoming_Call: true,
            Meeting_Initiator_Info: data?.CallInitiatorInfo,
            Server_Info: data?.ServerInfo,
            MeetingId: data?.RoomId,
            You_Joined: false,
            ChannelInfo: data?.ChannelInfo,
          });
          const Data = {
            An_Incoming_Call: true,
            Meeting_Initiator_Info: data?.CallInitiatorInfo,
            Server_Info: data?.ServerInfo,
            MeetingId: data?.RoomId,
            You_Joined: false,
            ChannelInfo: data?.ChannelInfo,
          };
          setCookie("An_Incoming_VideoCall", JSON.stringify(Data));
        } else {
          setAnIncoming_AudioCall_Occurred({
            An_Incoming_Call: true,
            Meeting_Initiator_Info: data?.CallInitiatorInfo,
            Server_Info: data?.ServerInfo,
            MeetingId: data?.RoomId,
            You_Joined: false,
            ChannelInfo: data?.ChannelInfo,
          });
          const Data = {
            An_Incoming_Call: true,
            Meeting_Initiator_Info: data?.CallInitiatorInfo,
            Server_Info: data?.ServerInfo,
            MeetingId: data?.RoomId,
            You_Joined: false,
            ChannelInfo: data?.ChannelInfo,
          };
          setCookie("An_Incoming_AudioCall", JSON.stringify(Data));
        }
      }
    },
    [UserInformation]
  );

  useEffect(() => {
    socket?.on("EmitNewServerCreated", (data) => {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      FetchTheIncludingServer(AuthToken);
    });
    socket?.on("EmitSendMeetingIdToTheMemberOfTheServer", (data) => {
      A_New_CallHasBeen_Started(data);
    });
    return () => {
      socket?.off("EmitNewServerCreated");
      socket?.off("EmitSendMeetingIdToTheMemberOfTheServer");
    };
  }, [socket, Path]);

  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    socket?.on("EmitNewMessageHasBeenSent", async (data) => {
      const current_user_id = UserInformation
        ? UserInformation
        : JSON.parse(getCookie("User__Info") as string);

      if (data?.success) {
        if (
          data?.data?.channel?.server?.members?.some(
            (member) => member?.userId === current_user_id?.id
          )
        ) {
          const socket_serverId = data?.data?.channel?.serverId;
          const channel_id = data?.data?.channel?.id;
          const sender_id = data?.data?.member?.user?.id;

          // now we send a notification if user is not in the current server
          const current_server_id = Path.split("/")[3];

          if (
            current_server_id !== socket_serverId ||
            channel_id !== CurrentChatChannelInfo?.ChatId
          ) {
            if (data?.data?.member?.userId !== current_user_id?.id) {
              const Data = {
                Profile_Picture: data?.data?.member?.user
                  ?.Profile_Picture as string,
                FullName: data?.data?.member?.user?.FullName as string,
                UserName: data?.data?.member?.user?.UserName as string,
                ProfileBgColor: data?.data?.member?.user
                  ?.ProfileBgColor as string,
                ProfileBanner_Color: data?.data?.member?.user
                  ?.ProfileBanner_Color as string,
              };
              GlobalNotificationHandlerFunction(
                Data,
                NotificationType.MESSAGE,
                "Sent A New Message",
                "top-right",
                4000
              );
              StoreMessageNotificationInTheDB(
                AuthToken,
                sender_id,
                socket_serverId,
                channel_id,
                "MESSAGE",
                "Sent A New Message"
              );
            }
          }
        }
      }
    });
    socket?.on("EmitNewFollowRequestHasBeenSent", async (data: any) => {
      console.log(data);
      const sender = data.request_sender_info;
      const receiver = data.request_receiver_info;
      if (!sender || !receiver) return;
      const CurrentUser = JSON.parse(getCookie("User__Info") as string);
      if (receiver.id === CurrentUser.id) {
        const Data = {
          Profile_Picture: sender?.Profile_Picture as string,
          FullName: sender?.name as string,
          UserName: sender?.UserName as string,
          ProfileBgColor: sender?.ProfileBgColor as string,
          ProfileBanner_Color: sender?.ProfileBanner_Color as string,
        };
        GlobalNotificationHandlerFunction(
          Data,
          NotificationType.FRIEND_REQUEST,
          "Wants to Follow",
          "top-right",
          4000
        );
      }
      await FetchingAllTheSentRequestOfUser(AuthToken);
      await FetchingAllTheReceivedRequestOfUser(AuthToken);
    });
    socket?.on("EmitYourFollowRequestHasBeenAccepted", async (data) => {
      const sender_info = data.request_sender_info;
      const receiver_info = data.request_accepter_info;
      if (!sender_info || !receiver_info) return;
      const current_user_info = JSON.parse(getCookie("User__Info") as string);
      if (sender_info.id === current_user_info.id) {
        const Data = {
          Profile_Picture: receiver_info?.Profile_Picture as string,
          FullName: receiver_info?.name as string,
          UserName: receiver_info?.UserName as string,
          ProfileBgColor: receiver_info?.ProfileBgColor as string,
          ProfileBanner_Color: receiver_info?.ProfileBanner_Color as string,
        };
        GlobalNotificationHandlerFunction(
          Data,
          NotificationType.FRIEND_REQUEST,
          "Accepted Your Follow Request",
          "top-right",
          4000
        );
      } else if (receiver_info.id === current_user_info.id) {
        const Data = {
          Profile_Picture: sender_info?.Profile_Picture as string,
          FullName: sender_info?.name as string,
          UserName: sender_info?.UserName as string,
          ProfileBgColor: sender_info?.ProfileBgColor as string,
          ProfileBanner_Color: sender_info?.ProfileBanner_Color as string,
        };
        GlobalNotificationHandlerFunction(
          Data,
          NotificationType.FOLLOW,
          "Started Following You",
          "top-right",
          4000
        );
      }

      await FetchingAllTheSentRequestOfUser(AuthToken);
      await FetchingAllTheReceivedRequestOfUser(AuthToken);
      await FetchTheUserOnTheBaseOfDemand(AuthToken, "all");
    });
    socket?.on("EmitNew_UserJoined_The_Server", async (data: any) => {
      if (!data.Server_Id) return;
      if (!data.allReadyInServer) {
        try {
          const Data = {
            Profile_Picture: data?.UserInfo?.Profile_Picture as string,
            FullName: data?.UserInfo?.FullName as string,
            UserName: data?.UserInfo?.UserName as string,
            ProfileBgColor: data?.UserInfo.ProfileBgColor as string,
            ProfileBanner_Color: data?.UserInfo?.ProfileBanner_Color as string,
          };
          GlobalNotificationHandlerFunction(
            Data,
            NotificationType.FOLLOW,
            "joined the server",
            "top-right",
            4000
          );
        } catch (error) {
          console.error("Error handling new member joined event:", error);
        }
      }
    });
    return () => {
      socket?.off("EmitNewMessageHasBeenSent");
      socket?.off("EmitNewFollowRequestHasBeenSent");
      socket?.off("EmitYourFollowRequestHasBeenAccepted");
      socket?.off("EmitNew_UserJoined_The_Server");
    };
  }, [socket, Path, CurrentChatChannelInfo]);

  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    FetchTheIncludingServer(AuthToken);
    UserInfoFetchingFunction(AuthToken);
  }, []);

  // const Server__Clicked = (server_info: any) => {
  //   push(`/pages/server/${server_info.id}`);
  // };
  return (
    <>
      <div className="sidebar bg-[#202225] h-100  w-100 overflow-y-auto  overflow-x-visible ">
        <div className="w-100 h-100 flex flex-col items-center justify-start relative ">
          <div className="create-new-server-wrapper flex flex-col items-center mt-1 constant-create-button w-100 sticky top-0 bg-[#202225] z-10">
            <div
              className="create-new-server-button my-[10px] hover:bg-green-600"
              data-tooltip-id="Create-New-Server-tooltip"
              data-tooltip-content="Create Server"
            >
              <button
                className="w-100 h-100 flex items-center justify-center fs-18"
                onClick={() => setShow_Create_Server_PopUp(true)}
              >
                <FaPlus />
              </button>
            </div>
            <div className="w-100 px-2  flex">
              <span className="bg-[#36393F] w-100 h-[3px] inline-block rounded-sm "></span>
            </div>
          </div>
          <div className="fetching-servers-wrapper h-100 mt-6 overflow-auto w-100">
            <div className="flex flex-col justify-between w-100">
              <Link
                prefetch={false}
                href={"/pages/dashboard"}
                className={`w-100  flex items-center justify-center relative mb-[20px] cursor-pointer ${
                  Path.split("/").includes("dashboard")
                    ? "active-server"
                    : "server-logo-wrapper"
                }`}
                data-tooltip-id="HomePage-tooltip"
                data-tooltip-content="Home Page"
              >
                <div className="clickable-button">
                  <div className="image-section w-100 h-100">
                    <div className="w-[52px] h-[52px] bg-indigo-600 flex flex-col items-center justify-center">
                      <FaDiscord className="text-white w-[35px] h-[30px]" />
                    </div>
                  </div>
                </div>
                <span className={`absolute active-server-indicator  `}></span>
              </Link>

              {Including_Server_Info_Array?.map((Info: any) => {
                return (
                  <Link
                    prefetch={false}
                    href={`/pages/server/${Info?.id}`}
                    key={Info.id}
                    className={`w-100  flex items-center justify-center relative mb-[20px] cursor-pointer ${
                      Path.split("/").includes(Info.id)
                        ? "active-server"
                        : "server-logo-wrapper"
                    }`}
                    data-tooltip-id="Server-name-tooltip"
                    data-tooltip-content={Info?.name}
                  >
                    <div className="clickable-button">
                      <div className="image-section w-100 h-100">
                        <video autoPlay muted loop poster={Info.imageUrl}>
                          <source src={Info.imageUrl} type="video/mp4" />
                          <source src={Info.imageUrl} type="video/ogg" />
                        </video>
                      </div>
                    </div>
                    <span
                      className={`absolute active-server-indicator  `}
                    ></span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="account-detailed-section absolute bottom-0 bg-[#202225] z-10 py-6 w-100 left-0">
            <div className="w-[100%] flex items-center justify-center">
              <Link href="/pages/explorer" prefetch={false}>
                <div
                  className="w-[52px] h-[52px] bg-[rgba(255,255,255,0.1)] rounded-full flex flex-col items-center justify-center cursor-pointer transition duration-[0.15s] hover:bg-green-800 hover:rounded-[20px] group"
                  data-tooltip-id="Explorer-tooltip"
                  data-tooltip-content="Explorer Server"
                >
                  <MdExplore className="w-[28px] h-[28px] text-green-700 transition duration-[0.15s] group-hover:text-black" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Create_Update_Server_PopUp Pop_Up_Mode="Create-PopUp-Mode" />
    </>
  );
}

export default Sidebar;

"use client";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { FaDiscord, FaPlus } from "react-icons/fa";
import "./scss/components.css";
import { Context } from "@/context/ContextApi";
import Create_Update_Server_PopUp from "./Create_Update_Server_PopUp";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { MdExplore } from "react-icons/md";
import UseSocketIO from "@/hooks/UseSocketIO";
import { Tooltip as ReactTooltip } from "react-tooltip";
function Sidebar() {
  const Path = usePathname();
  const { push } = useRouter();
  const {
    setShow_Create_Server_PopUp,
    FetchTheIncludingServer,
    Including_Server_Info_Array,
    UserInfoFetchingFunction,
    FetchTheMessageOFTheChannel,
    setGlobalSuccessNotification,
    A_New_Meeting_Started,
    setA_New_Meeting_Started,
    UserInformation,
  } = useContext(Context) as any;

  const [ShowAccountSettingPopUp, setShowAccountSettingPopUp] = useState(
    false as boolean
  );
  const socket = UseSocketIO();

  const A_New_CallHasBeen_Started = useCallback(
    (data) => {
      const serverId = Path?.split("/")[3];
      const User_Info = UserInformation
        ? UserInformation
        : JSON?.parse(getCookie("User__Info") as string);
      if (serverId === data?.ServerInfo?.id) {
        if (
          data.ServerInfo.members.some(
            (member: any) => member.userId === User_Info?.id
          )
        ) {
          setA_New_Meeting_Started({
            Call_Started: true,
            Meeting_Initiator_Info: data?.CallInitiatorInfo,
            Server_Info: data?.ServerInfo,
            MeetingId: data?.RoomId,
          });
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
  }, [socket]);

  useEffect(() => {
    socket?.on("EmitNewMessageHasBeenSent", async (data) => {
      console.log("data", data);
      const current_user_id = JSON.parse(getCookie("User__Info") as string);

      if (data?.success) {
        if (
          data?.data?.channel?.server?.members?.some(
            (member) => member?.userId === current_user_id?.id
          )
        ) {
          const socket_serverId = data?.data?.channel?.serverId;

          // now we send a notification if user is not in the current server
          const current_server_id = Path.split("/")[3];
          console.log(Path.split("/"));
          console.log(current_server_id, socket_serverId);
          if (current_server_id !== socket_serverId) {
            if (data?.data?.member?.userId !== current_user_id?.id) {
              setGlobalSuccessNotification({
                ShowAlert: true as boolean,
                Profile_Picture: data?.data?.member?.user
                  ?.Profile_Picture as string,
                FullName: data?.data?.member?.user?.FullName as string,
                UserName: data?.data?.member?.user?.UserName as string,
                Message: `sent you a message` as string,
                Type: "FOLLOW" as string,
              });
              setTimeout(() => {
                setGlobalSuccessNotification({
                  ShowAlert: false as boolean,
                  Profile_Picture: "" as string,
                  FullName: "" as string,
                  UserName: "" as string,
                  Message: "" as string,
                  Type: "NORMAL" as string,
                });
              }, 2500);
            }
          }
        }
      }
    });
    return () => {
      socket?.off("EmitNewMessageHasBeenSent");
    };
  }, [socket]);

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

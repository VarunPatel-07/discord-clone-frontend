"use client";
import React, { useEffect, useContext, useState } from "react";
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
  } = useContext(Context) as any;

  const [ShowAccountSettingPopUp, setShowAccountSettingPopUp] = useState(
    false as boolean
  );
  const socket = UseSocketIO();
  useEffect(() => {
    socket?.on("EmitNewServerCreated", (data) => {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      FetchTheIncludingServer(AuthToken);
    });
    return () => {
      socket?.off("EmitNewServerCreated");
    };
  }, []);
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
              <div
                className={`w-100  flex items-center justify-center relative mb-[20px] cursor-pointer ${
                  Path.split("/").includes("dashboard")
                    ? "active-server"
                    : "server-logo-wrapper"
                }`}
                onClick={() => {
                  push(`/pages/dashboard`);
                }}
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
              </div>

              {Including_Server_Info_Array?.map((Info: any) => {
                return (
                  <div
                    key={Info.id}
                    className={`w-100  flex items-center justify-center relative mb-[20px] cursor-pointer ${
                      Path.split("/").includes(Info.id)
                        ? "active-server"
                        : "server-logo-wrapper"
                    }`}
                    onClick={() => {
                      push(`/pages/server/${Info?.id}`);
                    }}
                    data-tooltip-id="Server-name-tooltip"
                    data-tooltip-content={Info?.name}
                  >
                    <div className="clickable-button">
                      <div className="image-section w-100 h-100">
                        <picture>
                          <source src={Info.imageUrl} type="" />
                          <img
                            src={Info.imageUrl}
                            alt=""
                            className="w-100 h-100 object-cover"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                    </div>
                    <span
                      className={`absolute active-server-indicator  `}
                    ></span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="account-detailed-section absolute bottom-0 bg-[#202225] z-10 py-6 w-100 left-0">
            <div className="w-[100%] flex items-center justify-center">
              <Link href="/pages/explorer">
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

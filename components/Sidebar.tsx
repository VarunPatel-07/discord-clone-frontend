"use client";
import React, { useEffect, useContext, use, useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./scss/components.css";
import { Context } from "@/context/ContextApi";
import Create_Update_Server_PopUp from "./Create_Update_Server_PopUp";
import io from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";

function Sidebar() {
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  const socket = io(Host);
  const Path = usePathname();
  const { push } = useRouter();
  const {
    setShow_Create_Server_PopUp,
    FetchTheIncludingServer,
    Including_Server_Info_Array,
    UserInfoFetchingFunction,
    UserInformation,
  } = useContext(Context) as any;

  const [ShowAccountSettingPopUp, setShowAccountSettingPopUp] = useState(
    false as boolean
  );

  useEffect(() => {
    socket.on("EmitNewServerCreated", (data) => {
      
      const AuthToken = localStorage.getItem("AuthToken");
      FetchTheIncludingServer(AuthToken);
    });
  }, []);
  useEffect(() => {
    const AuthToken = localStorage.getItem("AuthToken");
    FetchTheIncludingServer(AuthToken);
    UserInfoFetchingFunction(AuthToken);
  }, []);

  const Server__Clicked = (server_info: any) => {
    push(`/pages/server/${server_info.id}`);
  };
  return (
    <>
      <div className="sidebar bg-[#202225] h-100  w-100 overflow-y-auto  overflow-x-visible ">
        <div className="w-100 h-100 flex flex-col items-center justify-start relative ">
          <div className="create-new-server-wrapper flex flex-col items-center mt-1 constant-create-button w-100 sticky top-0 bg-[#202225] z-10">
            <div className="create-new-server-button my-4 ">
              <button
                className="w-100 h-100 flex items-center justify-center fs-18"
                onClick={() => setShow_Create_Server_PopUp(true)}
              >
                <FaPlus />
              </button>
            </div>
            <div className="w-100 px-2">
              <span className="bg-[#36393F] w-100 h-1 inline-block rounded-sm "></span>
            </div>
          </div>
          <div className="fetching-servers-wrapper h-100 mt-6 overflow-auto w-100">
            <div className="flex flex-col justify-between w-100">
              {Including_Server_Info_Array?.map((Info: any) => {
               
                return (
                  <div
                    key={Info.id}
                    className={`w-100 server-logo-wrapper flex items-center justify-center relative mb-6 cursor-pointer ${
                      Path.split("/").includes(Info.id) ? "active-server" : ""
                    }`}
                    onClick={() => {
                      Server__Clicked(Info);
                    }}
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
            <div
              className="w-[48px] bg-red-600 h-[48px] mx-auto rounded-full cursor-pointer"
              onClick={() =>
                setShowAccountSettingPopUp(
                  ShowAccountSettingPopUp ? false : true
                )
              }
            >
              <div className="flex flex-col items-center justify-center w-100 h-100">
                <p className="global-font-roboto capitalize fs-28 font-semibold text-white cursor-pointer">
                  {UserInformation?.FullName?.slice(0, 1)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {ShowAccountSettingPopUp ? (
          <div className="absolute bottom-[100px] left-[15px] bg-white w-[200px] z-20  flex flex-col  rounded-[10px] transition overflow-hidden">
            <p className="global-font-roboto bg-white capitalize fs-16 font-semibold text-black cursor-pointer hover:bg-gray-200 w-100 py-2 px-3">
              hello
            </p>
            <p className="global-font-roboto bg-white capitalize fs-16 font-semibold text-black cursor-pointer hover:bg-gray-200 w-100 py-2 px-3">
              hello
            </p>
          </div>
        ) : (
          ""
        )}
      </div>

      <Create_Update_Server_PopUp Pop_Up_Mode="Create-PopUp-Mode" />
    </>
  );
}

export default Sidebar;

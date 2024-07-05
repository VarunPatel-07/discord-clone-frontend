"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { useContext, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "../../../scss/pages.css";
import { FaChevronDown, FaTrash, FaUserFriends } from "react-icons/fa";
import { BiUserPlus } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
import { Context } from "@/context/ContextApi";
import { usePathname } from "next/navigation";
import { FaCirclePlus } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";

function ServerDetails() {
  const Pathname = usePathname();
  const {
    FetchingTheServerInfoByServerId,
    ServerInfoById,
    UserInfoFetchingFunction,
    UserInformation,
  } = useContext(Context) as any;
  useEffect(() => {
    const AuthToke = localStorage.getItem("AuthToken") || "";
    const serverId = Pathname?.split("/")[3];

    FetchingTheServerInfoByServerId(serverId, AuthToke);
    UserInfoFetchingFunction(AuthToke);
  }, []);

  return (
    <>
      <div className="flex w-full h-full max-w-full max-h-full flex-col bg-[#202225]">
        <div className="w-100 navbar">
          <Navbar />
        </div>
        <div className="w-100 h-100">
          <div className="w-100 h-100 flex">
            <div className="w--15">
              <Sidebar />
            </div>
            <div className="w-100 bg-[#36393F] rounded overflow-auto">
              <div className="w-100 h-100 flex items-stretch">
                <div className="server-configuration w-[18%] bg-[#2F3136]">
                  <div className="server-setting-and-modification">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="curser-pointer text-white border-0 outline-none ">
                          <span className="flex items-center justify-between px-[10px] py-[10px]">
                            <span className="global-font-roboto fs-18 font-medium capitalize ">
                              open
                            </span>
                            <FaChevronDown />
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-0">
                        {ServerInfoById?.members?.map((MemberInfo) => {
                          const isAllowed =
                            ["ADMIN", "MODERATOR", "GUEST"].includes(
                              MemberInfo.role
                            ) && MemberInfo.userId === UserInformation.id;
                          const isAdmin =
                            MemberInfo.role === "ADMIN" &&
                            MemberInfo.userId === UserInformation.id;
                          const isAuthorized = ["MODERATOR", "ADMIN"].includes(
                            MemberInfo.role
                          );

                          return (
                            <React.Fragment key={MemberInfo.userId}>
                              {isAllowed && (
                                <DropdownMenuItem className="p-0 bg-black">
                                  <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 text-indigo-600 hover:text-indigo-800 py-[10px] px-[12px] ">
                                    <span>invite people</span>
                                    <span className="fs-20">
                                      <BiUserPlus />
                                    </span>
                                  </span>
                                </DropdownMenuItem>
                              )}
                              {isAdmin && (
                                <DropdownMenuItem className="p-0">
                                  <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 py-[10px] px-[12px]">
                                    <span>server settings</span>
                                    <span className="fs-20">
                                      <IoIosSettings />
                                    </span>
                                  </span>
                                </DropdownMenuItem>
                              )}
                              {isAdmin && (
                                <DropdownMenuItem className="p-0">
                                  <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 py-[10px] px-[12px]">
                                    <span>manage members</span>
                                    <span className="fs-18">
                                      <FaUserFriends />
                                    </span>
                                  </span>
                                </DropdownMenuItem>
                              )}
                              {isAuthorized && (
                                <DropdownMenuItem className="p-0">
                                  <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 py-[10px] px-[12px]" >
                                    <span>create channel</span>
                                    <span className="fs-18">
                                      <FaCirclePlus />
                                    </span>
                                  </span>
                                </DropdownMenuItem>
                              )}
                              {isAuthorized && <DropdownMenuSeparator className="bg-[#2F3136] m-0" />}
                              {isAdmin && (
                                <DropdownMenuItem className="p-0">
                                  <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 text-rose-500 py-[10px] px-[12px]">
                                    <span>delete server</span>
                                    <span className="fs-16">
                                    <FaTrash />
                                    </span>
                                  </span>
                                </DropdownMenuItem>
                              )}
                              {!isAdmin && (
                                <DropdownMenuItem className="py-0">
                                  <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 text-rose-500 py-[10px] px-[12px]">
                                    <span>leave server</span>
                                    <span className="fs-16">
                                    <RxExit />

                                    </span>
                                  </span>
                                </DropdownMenuItem>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="more-action-on-server-section w-[82%] bg-[#36393F]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServerDetails;

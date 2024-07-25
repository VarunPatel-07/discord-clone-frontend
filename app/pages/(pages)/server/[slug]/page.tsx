"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import "../../../scss/pages.css";
import { FaChevronDown, FaTrash, FaUserFriends } from "react-icons/fa";
import { BiUserPlus } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
import { Context } from "@/context/ContextApi";
import { usePathname, useRouter } from "next/navigation";
import { FaCirclePlus } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { toast } from "sonner";
import GlobalDiscordLoader from "@/components/GlobalDiscordLoader";
import io from "socket.io-client";

import InviteFriendsModel from "@/components/Model/ServerModel/InviteFriendsModel";
import ManageMemberModal from "@/components/Model/ServerModel/ManageMemberModal";
import UpdateServerInfo from "@/components/Model/ServerModel/UpdateServerInfo";
import CreateChannelModal from "@/components/Model/ServerModel/CreateChannelModal";
import LeaveServerAlertModal from "@/components/Model/ServerModel/LeaveServerAlertModal";
import DeleteServerAlertModal from "@/components/Model/ServerModel/DeleteServerAlertModal";
import ServerSideBarChannelContent from "@/components/ServerSideBarChannalContent/ServerSideBarChannelContent";
import { getCookie } from "cookies-next";
import ServerChatsPlayground from "@/components/ServerChatsSection/ServerChatsPlayground";

function ServerDetails() {
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;

  const { push } = useRouter();
  const Pathname = usePathname();
  const {
    socket,
    CheckUsersLoginStatus,
    FetchingTheServerInfoByServerId,
    ServerInfoById,
    UserInfoFetchingFunction,
    UserInformation,
    Check_The_User_Is_KickedOut,
    setGlobalAlertInformation,
    Check_Server_Is_Deleted,
  } = useContext(Context) as any;

  const [ShowInviteMemberModal, setShowInviteMemberModal] = useState(
    false as boolean
  );

  const [ShowManageServerMembersModal, setShowManageServerMembersModal] =
    useState(false as boolean);

  const [ShowUpdateServerInformation, setShowUpdateServerInformation] =
    useState(false as boolean);

  const [ShowCreateNewChannelModal, setShowCreateNewChannelModal] = useState(
    false as boolean
  );

  const [Discord_Loader, setDiscord_Loader] = useState(true as boolean);

  const [ShowLeaveModal, setShowLeaveModal] = useState(false as boolean);
  const [CreateChanelInfoChannelName, setCreateChanelInfoChannelName] =
    useState("" as string);
  const [CreateChanelInfoChannelType, setCreateChanelInfoChannelType] =
    useState("" as string);
  const [ShowDeleteServerModal, setShowDeleteServerModal] = useState(
    false as boolean
  );

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await CheckUsersLoginStatus();
        if (status) {
          setDiscord_Loader(false);
        } else {
          setDiscord_Loader(false);
          push("/pages/login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkStatus();
    const AuthToke = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];

    FetchingTheServerInfoByServerId(serverId, AuthToke);
    UserInfoFetchingFunction(AuthToke);
  }, []);

  useEffect(() => {
    socket.on("New_Member_Joined", (data) => {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const serverId = Pathname?.split("/")[3];

      FetchingTheServerInfoByServerId(serverId, AuthToken);
    });
    socket.on("EmitNewServerCreated", (data) => {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const serverId = Pathname?.split("/")[3];
      FetchingTheServerInfoByServerId(serverId, AuthToken);
    });

    return () => {
      socket.off("New_Member_Joined");
      socket.off("EmitNewServerCreated");
    };

    // socket
  }, []);
  useEffect(() => {
    socket.on("EmitMemberRemovedByAdmin", async (data) => {
      console.log(data);
      const Current_PathName = Pathname?.split("/");
      const response = await Check_The_User_Is_KickedOut(
        data,
        Current_PathName
      );

      if (response?.userKickedOut) {
        if (response?.isInTheCurrentServer) {
          setGlobalAlertInformation({
            showAlert: true,
            title: `You have been removed from the "${response?.serverName}" server`,
          });
          setTimeout(() => {
            setGlobalAlertInformation({
              showAlert: false,
              title: "",
            });
          }, 2500);
          push("/pages/dashboard");
        }
      }
    });
    socket.on("EmitServerHasBeenDeleted", async (data) => {
      const Current_PathName = Pathname?.split("/");
      const response = await Check_Server_Is_Deleted(data, Current_PathName);

      if (response?.serverHasBeenDeleted) {
        if (response?.userIsInTheCurrentServer) {
          if (response?.userIsAdmin) {
            setGlobalAlertInformation({
              showAlert: true,
              title: `You have deleted the Server`,
              message: `The Server "${response?.serverName}" has been deleted by You`,
            });
            setTimeout(() => {
              setGlobalAlertInformation({
                showAlert: false,
                title: "",
                message: "",
              });
            }, 2500);
            push("/pages/dashboard");
          } else {
            setGlobalAlertInformation({
              showAlert: true,
              title: `The Server has been deleted`,
              message: `The Server "${response?.serverName}" has been deleted by the Admin`,
            });
            setTimeout(() => {
              setGlobalAlertInformation({
                showAlert: false,
                title: "",
                message: "",
              });
            }, 2500);
            push("/pages/dashboard");
          }
        }
      }
    });
    return () => {
      socket.off("EmitMemberRemovedByAdmin");
      socket.off("EmitServerHasBeenDeleted");
    };
  }, []);
  useEffect(() => {
    socket.on("EmitUserStatusChanged", () => {
      const AuthToken = getCookie("User_Authentication_Token") as string;

      const serverId = Pathname?.split("/")[3];
      FetchingTheServerInfoByServerId(serverId, AuthToken);
    });
    return () => {
      socket.off("EmitUserStatusChanged");
    };
  });

  if (Discord_Loader) {
    return <GlobalDiscordLoader />;
  } else {
    return (
      <>
        <div className="flex w-full h-full  flex-col bg-[#202225]">
          <div className="w-100 h-100">
            <div className="w-100 h-100 flex">
              <div className="w--15">
                <Sidebar />
              </div>
              <div className="w-100 bg-[#36393F] rounded overflow-auto">
                <div className="w-[100%] h-[100%] flex flex-col items-start justify-start ">
                  <div className="w-100 navbar">
                    <Navbar />
                  </div>
                  <div className="w-100 h-100 flex items-stretch">
                    <div className="server-configuration w-[18%] h-full overflow-hidden  min-w-[200px] bg-[#2a2d31] relative flex flex-col items-start justify-start">
                      <div className="server-setting-and-modification absolute top-0  z-10 left-0 w-100 bg-[#2a2d31] shadow-[0_0_10px_0_rgba(0,0,0,0.5)] min-h-[45px] max-h-[45px] h-[8%]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="curser-pointer text-white border-0 outline-none h-[45px] ">
                              <span className="flex items-center justify-between px-[10px] py-[8px]">
                                <span className="global-font-roboto fs-18 text-start font-medium capitalize text-nowrap w-[95%] text-ellipsis  overflow-hidden ">
                                  {ServerInfoById?.name}
                                </span>
                                <span className=" w-[5%] min-w-[30px] flex items-center justify-end">
                                  <FaChevronDown />
                                </span>
                              </span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="p-0">
                            {ServerInfoById?.members?.some(
                              (MemberInfo) =>
                                MemberInfo.userId === UserInformation.id &&
                                ["ADMIN", "MODERATOR", "GUEST"].includes(
                                  MemberInfo.role
                                )
                            ) ? (
                              <DropdownMenuItem
                                className="p-0 bg-black cursor-pointer"
                                onClick={() => {
                                  setShowInviteMemberModal(true);
                                }}
                              >
                                <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 text-indigo-600 hover:text-indigo-800 py-[10px] px-[12px] ">
                                  <span>invite people</span>
                                  <span className="fs-20">
                                    <BiUserPlus />
                                  </span>
                                </span>
                              </DropdownMenuItem>
                            ) : (
                              ""
                            )}
                            {ServerInfoById?.members?.some(
                              (MemberInfo) =>
                                MemberInfo.userId === UserInformation.id &&
                                MemberInfo.role === "ADMIN"
                            ) ? (
                              <>
                                <DropdownMenuItem
                                  className="p-0 cursor-pointer"
                                  onClick={() => {
                                    setShowUpdateServerInformation(true);
                                  }}
                                >
                                  <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 py-[10px] px-[12px]">
                                    <span>server settings</span>
                                    <span className="fs-20">
                                      <IoIosSettings />
                                    </span>
                                  </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="p-0 cursor-pointer"
                                  onClick={() =>
                                    setShowManageServerMembersModal(true)
                                  }
                                >
                                  <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 py-[10px] px-[12px]">
                                    <span>manage members</span>
                                    <span className="fs-18">
                                      <FaUserFriends />
                                    </span>
                                  </span>
                                </DropdownMenuItem>
                              </>
                            ) : (
                              ""
                            )}
                            {ServerInfoById?.members?.some(
                              (MemberInfo) =>
                                MemberInfo.userId === UserInformation.id &&
                                ["ADMIN", "MODERATOR"].includes(MemberInfo.role)
                            ) ? (
                              <>
                                <DropdownMenuItem
                                  className="p-0 cursor-pointer"
                                  onClick={() => {
                                    setShowCreateNewChannelModal(true);
                                    setCreateChanelInfoChannelName("");
                                    setCreateChanelInfoChannelType("");
                                  }}
                                >
                                  <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 py-[10px] px-[12px]">
                                    <span>create channel</span>
                                    <span className="fs-18">
                                      <FaCirclePlus />
                                    </span>
                                  </span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#2F3136] m-0" />
                              </>
                            ) : (
                              ""
                            )}
                            {ServerInfoById?.members?.some(
                              (MembersInfo) =>
                                MembersInfo.userId === UserInformation.id &&
                                MembersInfo.role === "ADMIN"
                            ) ? (
                              <DropdownMenuItem
                                className="p-0 cursor-pointer"
                                onClick={() => setShowDeleteServerModal(true)}
                              >
                                <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 text-rose-500 py-[10px] px-[12px]">
                                  <span>delete server</span>
                                  <span className="fs-16">
                                    <FaTrash />
                                  </span>
                                </span>
                              </DropdownMenuItem>
                            ) : (
                              ""
                            )}
                            {ServerInfoById?.members?.some(
                              (MembersInfo) =>
                                MembersInfo.userId === UserInformation.id &&
                                ["MODERATOR", "GUEST"].includes(
                                  MembersInfo.role
                                )
                            ) ? (
                              <DropdownMenuItem
                                className="p-0 cursor-pointer"
                                onClick={() => setShowLeaveModal(true)}
                              >
                                <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 text-rose-500 py-[10px] px-[12px]">
                                  <span>leave server</span>
                                  <span className="fs-16">
                                    <RxExit />
                                  </span>
                                </span>
                              </DropdownMenuItem>
                            ) : (
                              ""
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="h-[100%] w-[100%] pt-[45px]  overflow-auto remove-scrollbar">
                        <ServerSideBarChannelContent />
                      </div>
                    </div>
                    <div className="chats w-[82%] bg-[#36393F]">
                      <ServerChatsPlayground />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* different popup modal */}
        <InviteFriendsModel
          ShowInviteMemberModal={ShowInviteMemberModal}
          setShowInviteMemberModal={setShowInviteMemberModal}
          ServerInfoById={ServerInfoById}
        />
        <ManageMemberModal
          ShowManageServerMembersModal={ShowManageServerMembersModal}
          setShowManageServerMembersModal={setShowManageServerMembersModal}
          ServerInfoById={ServerInfoById}
        />
        <UpdateServerInfo
          ShowUpdateServerInformation={ShowUpdateServerInformation}
          setShowUpdateServerInformation={setShowUpdateServerInformation}
        />
        <CreateChannelModal
          ShowCreateNewChannelModal={ShowCreateNewChannelModal}
          setShowCreateNewChannelModal={setShowCreateNewChannelModal}
          CreateChanelInfoChannelName={CreateChanelInfoChannelName}
          CreateChanelInfoChannelType={CreateChanelInfoChannelType}
          setCreateChanelInfoChannelName={setCreateChanelInfoChannelName}
          setCreateChanelInfoChannelType={setCreateChanelInfoChannelType}
        />
        <LeaveServerAlertModal
          ShowLeaveModal={ShowLeaveModal}
          setShowLeaveModal={setShowLeaveModal}
          ServerInfoById={ServerInfoById}
        />
        <DeleteServerAlertModal
          ShowDeleteServerModal={ShowDeleteServerModal}
          setShowDeleteServerModal={setShowDeleteServerModal}
          ServerInfoById={ServerInfoById}
        />
      </>
    );
  }
}

export default ServerDetails;

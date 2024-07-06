"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import "../../../scss/pages.css";
import {
  FaCheck,
  FaChevronDown,
  FaRegCheckCircle,
  FaTrash,
  FaUserFriends,
} from "react-icons/fa";
import { BiUserPlus } from "react-icons/bi";
import {
  IoIosCloseCircle,
  IoIosCloseCircleOutline,
  IoIosSettings,
} from "react-icons/io";
import { Context } from "@/context/ContextApi";
import { usePathname, useRouter } from "next/navigation";
import { FaCirclePlus } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { MdContentCopy } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import GlobalDiscordLoader from "@/components/GlobalDiscordLoader";
import { useDropzone } from "react-dropzone";
import io from "socket.io-client";
function ServerDetails() {
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  const socket = io(Host);
  const { push } = useRouter();
  const Pathname = usePathname();
  const {
    CheckUsersLoginStatus,
    FetchingTheServerInfoByServerId,
    ServerInfoById,
    UserInfoFetchingFunction,
    UserInformation,
    RegeneratingServerInviteCodeFunction,
    UpdateServerInfoImage,
    setUpdateServerInfoImage,
    UpdatingServerInformationFunction,
  } = useContext(Context) as any;

  const [ShowInviteMemberModal, setShowInviteMemberModal] = useState(
    false as boolean
  );

  const [ShowManageServerMembersModal, setShowManageServerMembersModal] =
    useState(false as boolean);

  const [ShowUpdateServerInformation, setShowUpdateServerInformation] =
    useState(false as boolean);

  const [Copy, setCopy] = useState(false as boolean);
  const [Updated__Invite__Code, setUpdated__Invite__Code] = useState({
    Updated: false as boolean,
    InviteCode: "" as string,
  });

  const [Preview__Image__URL, setPreview__Image__URL] = useState("" as string);

  const [Discord_Loader, setDiscord_Loader] = useState(true as boolean);
  const CopyUrlButton = (inviteCode: string) => {
    if (!Copy) {
      setCopy(true);
      navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_SERVER_INVITE_BASE_LINK}/${inviteCode}`
      );
    } else {
      setCopy(false);
    }
  };
  const [Server__Name, setServer__Name] = useState("" as string);
  const RegenerateServerInviteCode = async () => {
    const AuthToken = localStorage.getItem("AuthToken");
    const serverId = Pathname?.split("/")[3];
    const Updated_Invite_Code = await RegeneratingServerInviteCodeFunction(
      AuthToken,
      serverId
    );
    if (Updated_Invite_Code?.success) {
      setUpdated__Invite__Code({
        Updated: true,
        InviteCode: Updated_Invite_Code?.inviteCode,
      });
    }
  };
  const RandomBackgroundColorGenerator = () => {
    const ColorArray = ["gray", "red", "blue", "green", "purple", "yellow"];
    const RandomColor = ColorArray[Math.floor(Math.random() * 6)];
    const RadomeInt = Math.floor(Math.random() * 100);
    const BgColor = RandomColor;
    return BgColor;
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const Image_URL = URL.createObjectURL(file);

      setPreview__Image__URL(Image_URL);

      setUpdateServerInfoImage({
        Preview_Image: Image_URL,
        File_Of_Image: file,
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    const AuthToke = localStorage.getItem("AuthToken") || "";
    const serverId = Pathname?.split("/")[3];

    FetchingTheServerInfoByServerId(serverId, AuthToke);
    UserInfoFetchingFunction(AuthToke);
  }, []);

  useEffect(() => {
    socket.on("New_Member_Joined", (data) => {
      const AuthToken = localStorage.getItem("AuthToken") || "";
      const serverId = Pathname?.split("/")[3];

      FetchingTheServerInfoByServerId(serverId, AuthToken);
    });
    socket.on("EmitNewServerCreated", (data) => {
      const AuthToken = localStorage.getItem("AuthToken") || "";
      const serverId = Pathname?.split("/")[3];
      FetchingTheServerInfoByServerId(serverId, AuthToken);
    });

    // socket
  }, []);

  const RemoveTheProfileImage = () => {
    setPreview__Image__URL("");
    setUpdateServerInfoImage({
      Preview_Image: "",
      File_Of_Image: "",
    });
  };
  const Submit__Form__Function = async (e: any) => {
    e.preventDefault();
    const AuthToken = localStorage.getItem("AuthToken");
    const serverId = Pathname?.split("/")[3];
    const formData = new FormData();

    formData.append("serverId", serverId);
    formData.append("serverImage", UpdateServerInfoImage.File_Of_Image);
    formData.append("ServerName", Server__Name);

    await UpdatingServerInformationFunction(AuthToken, formData);
    setShowUpdateServerInformation(false);
  };

  if (Discord_Loader) {
    return <GlobalDiscordLoader />;
  } else {
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
                                {ServerInfoById?.name}
                              </span>
                              <FaChevronDown />
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
                              className="p-0 bg-black"
                              onClick={() => {
                                setShowInviteMemberModal(true);
                                setCopy(false);
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
                                className="p-0"
                                onClick={() =>
                                  setShowUpdateServerInformation(true)
                                }
                              >
                                <span className="flex items-center justify-between w-100 capitalize global-font-roboto fs-14 py-[10px] px-[12px]">
                                  <span>server settings</span>
                                  <span className="fs-20">
                                    <IoIosSettings />
                                  </span>
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="p-0"
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
                              <DropdownMenuItem className="p-0">
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
                            <DropdownMenuItem className="p-0">
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
                              ["MODERATOR", "GUEST"].includes(MembersInfo.role)
                          ) ? (
                            <DropdownMenuItem className="py-0">
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
                  </div>
                  <div className="more-action-on-server-section w-[82%] bg-[#36393F]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`absolute w-full h-full max-h-full max-w-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-20 top-0 left-0 transition scale-0 opacity-0 not-visible ${
            ShowInviteMemberModal ? "scale-100 opacity-100 visible" : ""
          } `}
        >
          <div className="w-100 h-100 flex items-center justify-center w-100">
            <div className="modal-inner-section w-100  max-w-[500px] rounded-[10px] bg-[#f2f2f2] py-[15px] px-[15px]">
              <div className="inner-section">
                <div className="close-modal-button w-100 flex items-end justify-end">
                  <button
                    className="border-0 bg-transparent text-[30px]"
                    onClick={() => {
                      setShowInviteMemberModal(false);
                      setCopy(false);
                    }}
                  >
                    <IoIosCloseCircleOutline />
                  </button>
                </div>
                <div className="invite-people-card-main-content-section w-100">
                  <div className="card-title w-100">
                    <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                      Invite friends
                    </h3>
                  </div>
                  <div className="invite-url-section mt-7">
                    <p className="global-font-roboto uppercase fs-14 font-medium ">
                      server invite link
                    </p>
                    <div className="w-100    overflow-hidden  mt-3">
                      <div className="flex w-100 items-stretch justify-end gap-[8px]">
                        <div className="url w-[90%] flex items-center justify-start py-[5px] px-[6px] bg-[#000000] rounded-[3px]">
                          <p className="global-font-roboto  fs-14 font-medium text-ellipsis text-nowrap overflow-hidden text-start text-white ">
                            {`${
                              process.env.NEXT_PUBLIC_SERVER_INVITE_BASE_LINK
                            }/${
                              Updated__Invite__Code.Updated
                                ? Updated__Invite__Code.InviteCode
                                : ServerInfoById?.inviteCode
                            }`}
                          </p>
                        </div>
                        <div className="copy-button w-[10%] bg-[#d6d7db] rounded-[3px]  ">
                          <button
                            className={`bg-transparent w-100 h-100 px-[12px] flex items-center justify-center ${
                              Copy ? "text-green-500" : "text-slate-600"
                            } `}
                            onClick={() =>
                              CopyUrlButton(ServerInfoById?.inviteCode)
                            }
                          >
                            {Copy ? <FaCheck /> : <MdContentCopy />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      className="flex w-fit items-center justify-start gap-[10px] mt-4 cursor-pointer border-b-[1px] border-slate-500 text-slate-600"
                      onClick={RegenerateServerInviteCode}
                    >
                      <p className="global-font-roboto capitalize fs-14 font-medium ">
                        generate a new link
                      </p>
                      <span className="flex items-center justify-center h-100">
                        <TbReload />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`absolute w-full h-full max-h-full max-w-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-20 top-0 left-0 transition scale-0 opacity-0 not-visible ${
            ShowManageServerMembersModal ? "scale-100 opacity-100 visible" : ""
          } `}
        >
          <div className="w-100 h-100 flex items-center justify-center w-100">
            <div className="modal-inner-section w-100  max-w-[600px] max-h-[600px] overflow-auto no- rounded-[10px] bg-[#f2f2f2] py-[15px]  ">
              <div className="inner-section">
                <div className="close-modal-button w-100 flex items-end justify-end px-[15px]">
                  <button
                    className="border-0 bg-transparent text-[30px]"
                    onClick={() => setShowManageServerMembersModal(false)}
                  >
                    <IoIosCloseCircleOutline />
                  </button>
                </div>
                <div className="invite-people-card-main-content-section w-100">
                  <div className="card-title w-100 px-[15px]">
                    <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                      Manage server members
                    </h3>
                  </div>
                  <div className="members-information-wrapper mt-8 flex flex-col items-start justify-start w-100 ">
                    {ServerInfoById?.members?.map((MemberInfo: any) => (
                      <div
                        className="user-avatar-wrapper-main w-100 transition hover:bg-white border-b-[1px] py-[10px] px-[15px] rounded-[5px] cursor-pointer last:border-0"
                        key={MemberInfo.userId}
                      >
                        <div className="w-100 flex items-center justify-between">
                          <div className="left-part">
                            <div className="avatar flex items-center justify-center gap-[10px] ">
                              <div className="profile-image">
                                <div className="w-[52px] h-[52px] rounded-full overflow-hidden">
                                  {MemberInfo?.user?.Profile_Image ? (
                                    <picture>
                                      <source src="https://images.unsplash.com/photo-1720188228786-e6cb3b668aef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8" />
                                      <img
                                        src="https://images.unsplash.com/photo-1720188228786-e6cb3b668aef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
                                        alt=""
                                        className="w-100 h-100 object-cover"
                                      />
                                    </picture>
                                  ) : (
                                    <div
                                      className={`w-100 h-100 flex items-center justify-center bg-${RandomBackgroundColorGenerator()}-400 bg-red-400 `}
                                    >
                                      <p className="global-font-roboto uppercase fs-28 font-semibold">
                                        {
                                          MemberInfo?.user?.FullName.split(
                                            ""
                                          )[0]
                                        }
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="members-information flex flex-col items-start justify-start gap-[2px]">
                                <p className="global-font-roboto capitalize h-[20px] fs-16 font-medium ">
                                  {MemberInfo?.user?.FullName}
                                </p>
                                <p className="global-font-roboto capitalize fs-14 h-[20px] text-[#8e8e8e] font-medium ">
                                  {MemberInfo?.user?.UserName}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="right-part">
                            <div className="role-of-member">
                              {MemberInfo?.role === "ADMIN" ? (
                                <p className="global-font-roboto uppercase fs-14 font-medium rounded-[5px] bg-orange-200 px-[10px] py-[3px] text-center text-orange-900 ">
                                  ADMIN
                                </p>
                              ) : (
                                ""
                              )}
                              {MemberInfo?.role === "MODERATOR" ? (
                                <p className="global-font-roboto uppercase fs-14 font-medium rounded-[5px] bg-green-200 px-[10px] py-[3px] text-center text-green-900 ">
                                  moderator
                                </p>
                              ) : (
                                ""
                              )}
                              {MemberInfo?.role === "GUEST" ? (
                                <p className="global-font-roboto uppercase fs-14 font-medium rounded-[5px] bg-blue-200 px-[10px] py-[3px] text-center text-blue-900 ">
                                  GUEST
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="action-done-on-user"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`absolute w-full h-full max-h-full max-w-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-20 top-0 left-0 transition scale-0 opacity-0 not-visible ${
            ShowUpdateServerInformation ? "scale-100 opacity-100 visible" : ""
          } `}
        >
          <div className="w-100 h-100 flex items-center justify-center w-100">
            <div className="modal-inner-section w-100  max-w-[600px] max-h-[600px] overflow-auto no- rounded-[10px] bg-[#f2f2f2] py-[15px]  ">
              <div className="inner-section">
                <div className="close-modal-button w-100 flex items-end justify-end px-[15px]">
                  <button
                    className="border-0 bg-transparent text-[30px]"
                    onClick={() => setShowUpdateServerInformation(false)}
                  >
                    <IoIosCloseCircleOutline />
                  </button>
                </div>
                <div className="invite-people-card-main-content-section w-100">
                  <div className="card-title w-100 px-[15px]">
                    <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                      Update Server Information
                    </h3>
                  </div>
                  <div className="server-information-section mt-8">
                    {Preview__Image__URL ||
                    UpdateServerInfoImage.Preview_Image ? (
                      <div className="profile-image w-[100px] h-[100px] rounded-full mx-auto bg-black relative">
                        <picture>
                          <img
                            src={
                              UpdateServerInfoImage.Preview_Image
                                ? UpdateServerInfoImage.Preview_Image
                                : Preview__Image__URL
                            }
                            alt=""
                            className="w-100 h-100 object-cover w-[100px] h-[100px] rounded-full"
                            loading="lazy"
                          />
                        </picture>
                        <div
                          className="absolute top-0 right-0 cursor-pointer text-[24px] text-red-600"
                          onClick={RemoveTheProfileImage}
                        >
                          <IoIosCloseCircle />
                        </div>
                      </div>
                    ) : (
                      <div className="drag-drop-zone-section text-center border-dashed border-[3px] border-indigo-500 w-fit mx-auto rounded-[6px] py-[15px] px-[30px] fs-20 text-indigo-500 font-semibold ">
                        <div
                          {...getRootProps()}
                          className="drag-drop-image__uploader cursor-pointer"
                        >
                          <input {...getInputProps()} />
                          {isDragActive ? (
                            <p>Drop the files here ...</p>
                          ) : (
                            <p>Drag n drop some files </p>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="input-section w-100 px-[15px]">
                      <form className="form" onSubmit={Submit__Form__Function}>
                        <div className="flex flex-col items-start justify-start">
                          <label
                            htmlFor="Sever_Name"
                            className="global-font-roboto fs-14 font-medium global-font-roboto fs-14 text-black pb-2"
                          >
                            Sever Name
                          </label>
                          <input
                            className="w-100 bg-white py-[10px] px-[8px] rounded-[5px] text-black fs-14 global-font-roboto"
                            type="text"
                            id="Sever_Name"
                            name="Sever_Name"
                            placeholder="Enter Sever Name"
                            value={Server__Name}
                            onChange={(e: any) => {
                              setServer__Name(e.target.value);
                            }}
                            required
                          />
                        </div>

                        <button
                          className="bg-indigo-500 text-white w-100 px-[15px] py-[12px] rounded-[5px]  capitalize fs-20 font-medium global-font-roboto mt-9 transition hover:bg-indigo-700"
                          type="submit"
                        >
                          create server
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ServerDetails;

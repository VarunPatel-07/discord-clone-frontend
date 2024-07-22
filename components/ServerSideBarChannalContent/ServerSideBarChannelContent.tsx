"use client";
import React, { useEffect, useContext, useState } from "react";

import { Context } from "@/context/ContextApi";
import { usePathname } from "next/navigation";
import { FaHashtag } from "react-icons/fa";
import { AiOutlineAudio } from "react-icons/ai";

import { IoIosLock, IoMdVideocam } from "react-icons/io";

import UserProfile from "../UserProfile";
import { getCookie } from "cookies-next";
import { Edit } from "lucide-react";
import { MdDelete } from "react-icons/md";
import SearchServerChannel from "../Model/ServerModel/SearchServerChannel";
import DeleteChannelModal from "../Model/ServerModel/DeleteChannelModal";
import UpdateChannelInfoModel from "../Model/ServerModel/UpdateChannelInfoModel";
function ServerSideBarChannelContent() {
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  // const socket = io(Host);
  const PathName = usePathname();
  const {
    socket,
    FetchTheTextChannelOfTheServer,
    FetchTheAudioChannelOfTheServer,
    FetchTheVideoChannelOfTheServer,
    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
    UserInfoFetchingFunction,
    UserInformation,
  } = useContext(Context) as any;
  const [Open, setOpen] = useState(false as boolean);
  const [SearchInputVal, setSearchInputVal] = useState("" as string);
  const [ShowDeleteChannelModal, setShowDeleteChannelModal] = useState(
    false as boolean
  );
  const [ShowUpdateChannelInfoModal, setShowUpdateChannelInfoModal] = useState(
    false as boolean
  );
  const [ChannelInfo, setChannelInfo] = useState({} as object);
  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = PathName.split("/")[3];
    Promise.all([
      FetchTheTextChannelOfTheServer(AuthToken, serverId),
      FetchTheAudioChannelOfTheServer(AuthToken, serverId),
      FetchTheVideoChannelOfTheServer(AuthToken, serverId),
    ]);
  }, []);
  useEffect(() => {
    socket.on("EmitNewChannelHasBeenCreated", () => {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const serverId = PathName.split("/")[3];
      Promise.all([
        FetchTheTextChannelOfTheServer(AuthToken, serverId),
        FetchTheAudioChannelOfTheServer(AuthToken, serverId),
        FetchTheVideoChannelOfTheServer(AuthToken, serverId),
      ]);
    });
  });
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((Open) => !Open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="w-[100%] h-[100%] ">
        <div className="flex flex-col items-start justify-start relative h-[100%]">
          <div className="search-bar w-[100%] bg-[#2F3136]  px-[12px] py-[15px] sticky top-0 left-0">
            <div className="relative" onClick={() => setOpen((Open) => !Open)}>
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                >
                  <path
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke="currentColor"
                  ></path>
                </svg>
              </div>
              <input
                required
                placeholder="Search"
                className="block w-full p-4 py-[5px] ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50  outline-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="default-search"
                type="search"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[8px] w-[100%]">
            {AllTheTextChannelsOfTheServer.length >= 1 && (
              <div className="text-channal w-[100%] px-[15px]">
                <div className="channal-header w-[100%]">
                  <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
                    text channel
                  </span>
                </div>
                <ul className="flex flex-col pt-[8px] ">
                  {AllTheTextChannelsOfTheServer?.map((channel_info) => {
                    return (
                      <li
                        className="w-[100%] cursor-pointer   hover:bg-[rgba(255,255,255,0.15)] px-[8px] py-[8px] rounded flex items-center justify-between group"
                        key={channel_info.id}
                      >
                        <span className="flex items-center gap-[5px] w-[70%] text-[#f2f2f2]">
                          <span className="w-[16px] h-[16px] ">
                            <FaHashtag className="w-[16px] h-[16px] " />
                          </span>
                          <span className="block capitalize  overflow-hidden whitespace-nowrap text-ellipsis">
                            {channel_info.name}
                          </span>
                        </span>
                        {channel_info.name === "general" ? (
                          <span className="flex w-[30%] items-center justify-end  ">
                            <button
                              className="text-[#f2f2f2] w-[20px] h-[20px]"
                              title="locked"
                            >
                              <IoIosLock className="w-[20px] h-[20px]" />
                            </button>
                          </span>
                        ) : (
                          <span className="flex  items-center justify-center transition duration-[0.01s] opacity-0 group-hover:opacity-100">
                            <button
                              className="text-[#f2f2f2] w-[20px] h-[20px]"
                              onClick={(e) => {
                                setShowUpdateChannelInfoModal(true);
                                setChannelInfo(channel_info);
                              }}
                            >
                              <Edit className="w-[20px] h-[20px]" />
                            </button>
                            <button
                              className="text-[#f2f2f2] w-[20px] h-[20px]"
                              onClick={(e) => {
                                setShowDeleteChannelModal(true);
                                setChannelInfo(channel_info);
                              }}
                            >
                              <MdDelete className="w-[20px] h-[20px]" />
                            </button>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {AllTheAudioChannelsOfTheServer.length >= 1 && (
              <div className="audio-channal w-[100%] px-[15px]">
                <div className="channal-header w-[100%]">
                  <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
                    audio channel
                  </span>
                </div>
                <ul className="flex flex-col pt-[8px]">
                  {AllTheAudioChannelsOfTheServer?.map((channel_info) => {
                    return (
                      <li
                        className="w-[100%] cursor-pointer   hover:bg-[rgba(255,255,255,0.15)] px-[8px] py-[8px] rounded flex items-center justify-between group"
                        key={channel_info.id}
                      >
                        <span className="flex items-center gap-[5px] w-[70%] text-[#f2f2f2]">
                          <span className="w-[20px] h-[20px] block">
                            <AiOutlineAudio className="w-[20px] h-[20px]" />
                          </span>

                          <span className="block capitalize  overflow-hidden whitespace-nowrap text-ellipsis">
                            {channel_info.name}
                          </span>
                        </span>
                        <span className="flex w-[30%]  items-center justify-end transition duration-[0.01s] opacity-0 group-hover:opacity-100">
                          <button
                            className="text-[#f2f2f2] w-[20px] h-[20px]"
                            onClick={(e) => {
                              setShowUpdateChannelInfoModal(true);
                              setChannelInfo(channel_info);
                            }}
                          >
                            <Edit className="w-[20px] h-[20px]" />
                          </button>
                          <button
                            className="text-[#f2f2f2] w-[20px] h-[20px]"
                            onClick={(e) => {
                              setShowDeleteChannelModal(true);
                              setChannelInfo(channel_info);
                            }}
                          >
                            <MdDelete className="w-[20px] h-[20px]" />
                          </button>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {AllTheVideoChannelsOfTheServer.length >= 1 && (
              <div className="video-channal w-[100%] px-[15px]">
                <div className="channal-header w-[100%]">
                  <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
                    video channel
                  </span>
                </div>
                <ul className="flex flex-col pt-[8px]">
                  {AllTheVideoChannelsOfTheServer?.map((channel_info) => {
                    return (
                      <li
                        className="w-[100%] cursor-pointer   hover:bg-[rgba(255,255,255,0.15)] px-[8px] py-[8px] rounded flex items-center justify-between group"
                        key={channel_info.id}
                      >
                        <span className="flex items-center gap-[5px] w-[70%] text-[#f2f2f2]">
                          <span className="w-[18px] h-[18px] block">
                            <IoMdVideocam className="w-[18px] h-[18px]" />
                          </span>

                          <span className="block capitalize  overflow-hidden whitespace-nowrap text-ellipsis">
                            {channel_info.name}
                          </span>
                        </span>
                        <span className="flex w-[30%] items-center justify-end transition duration-[0.01s] opacity-0 group-hover:opacity-100">
                          <button
                            className="text-[#f2f2f2] w-[20px] h-[20px]"
                            onClick={(e) => {
                              setShowUpdateChannelInfoModal(true);
                              setChannelInfo(channel_info);
                            }}
                          >
                            <Edit className="w-[20px] h-[20px]" />
                          </button>
                          <button
                            className="text-[#f2f2f2] w-[20px] h-[20px]"
                            onClick={(e) => {
                              setShowDeleteChannelModal(true);
                              setChannelInfo(channel_info);
                            }}
                          >
                            <MdDelete className="w-[20px] h-[20px]" />
                          </button>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <UserProfile
            Position="absolute bottom-[0px] left-[0px]"
            UserInformation={UserInformation}
          />
        </div>
      </div>
      <SearchServerChannel Open={Open} setOpen={setOpen} />
      <DeleteChannelModal
        ShowModal={ShowDeleteChannelModal}
        setShowModal={setShowDeleteChannelModal}
        ChannalInfo={ChannelInfo}
      />
      <UpdateChannelInfoModel
        ShowModal={ShowUpdateChannelInfoModal}
        setShowModal={setShowUpdateChannelInfoModal}
        ChannalInfo={ChannelInfo}
      />
    </>
  );
}

export default ServerSideBarChannelContent;

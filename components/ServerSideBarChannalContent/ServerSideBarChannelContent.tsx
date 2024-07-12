"use client";
import React, { useEffect, useContext, useState } from "react";

import { Context } from "@/context/ContextApi";
import { usePathname } from "next/navigation";
import { FaHashtag, FaSearch } from "react-icons/fa";
import { AiOutlineAudio } from "react-icons/ai";

import { IoIosCloseCircleOutline, IoMdVideocam } from "react-icons/io";
import io from "socket.io-client";
import UserProfile from "../UserProfile";
function ServerSideBarChannelContent() {
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  const socket = io(Host);
  const PathName = usePathname();
  const {
    FetchTheTextChannelOfTheServer,
    FetchTheAudioChannelOfTheServer,
    FetchTheVideoChannelOfTheServer,
    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
  } = useContext(Context) as any;
  const [Open, setOpen] = useState(false as boolean);
  const [SearchInputVal, setSearchInputVal] = useState("" as string);
  useEffect(() => {
    const AuthToken = localStorage.getItem("AuthToken");
    const serverId = PathName.split("/")[3];
    Promise.all([
      FetchTheTextChannelOfTheServer(AuthToken, serverId),
      FetchTheAudioChannelOfTheServer(AuthToken, serverId),
      FetchTheVideoChannelOfTheServer(AuthToken, serverId),
    ]);
  }, []);
  useEffect(() => {
    socket.on("EmitNewChannelHasBeenCreated", () => {
      const AuthToken = localStorage.getItem("AuthToken");
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
                        className="w-[100%] cursor-pointer   hover:bg-slate-900 px-[16px] py-[8px] rounded"
                        key={channel_info.id}
                      >
                        <span className="flex items-center gap-[10px] text-[#f2f2f2]">
                          <FaHashtag />
                          <span className="block capitalize">
                            {channel_info.name}
                          </span>
                        </span>
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
                        className="w-[100%] cursor-pointer  hover:bg-slate-900 px-[16px] py-[8px] rounded"
                        key={channel_info.id}
                      >
                        <span className="flex items-center gap-[10px] text-[#f2f2f2]">
                          <AiOutlineAudio className="text-[20px]" />

                          <span className="block capitalize">
                            {channel_info.name}
                          </span>
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
                        className="w-[100%] cursor-pointer   hover:bg-slate-900 px-[16px] py-[8px] rounded"
                        key={channel_info.id}
                      >
                        <span className="flex items-center gap-[10px] text-[#f2f2f2]">
                          <IoMdVideocam className="text-[18px]" />

                          <span className="block capitalize ">
                            {channel_info.name}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <UserProfile Position="absolute bottom-[0px] left-[0px]" />
        </div>
      </div>
      <div
        className={`w-[100vw] h-[100vh] fixed top-0 left-0 z-20 bg-[rgba(0,0,0,0.5)] backdrop-blur ${
          Open ? "block" : "hidden"
        } `}
      >
        <div className="w-[100%] h-[100%]  flex  items-center justify-center px-[15px]">
          <div className="search-card bg-black border-[1px] w-[100%] max-w-[500px]  rounded-[10px] pb-[10px]">
            <div className="inner-section flex flex-col items-start justify-start gap-[15px]">
              <div className="search-bar w-[100%]">
                <div className="relative border-b-[1px]">
                  <div className="absolute inset-y-0  start-0 flex items-center ps-3 pointer-events-none">
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
                    className="block w-full p-4 py-[5px] ps-10 text-lg   border-gray-300 rounded-lg bg-transparent outline-none  text-white  "
                    id="default-search"
                    type="search"
                  />
                  <button
                    className="border-0 bg-transparent text-[30px]  absolute right-[10px] top-[50%] translate-y-[-50%]  text-white"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <IoIosCloseCircleOutline />
                  </button>
                </div>
              </div>
              {AllTheTextChannelsOfTheServer.length >= 1 && (
                <div className="text-channal w-[100%] px-[15px]">
                  <div className="channal-header w-[100%]">
                    <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
                      text channel
                    </span>
                  </div>
                  <ul className="flex flex-col  ">
                    {AllTheTextChannelsOfTheServer?.map((channel_info) => {
                      return (
                        <li
                          className="w-[100%] cursor-pointer bg-black  hover:bg-slate-900 px-[16px] py-[4px] rounded"
                          key={channel_info.id}
                        >
                          <span className="flex items-center gap-[10px] text-[#f2f2f2]">
                            <FaHashtag />
                            <span className="block capitalize">
                              {channel_info.name}
                            </span>
                          </span>
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
                  <ul className="flex flex-col">
                    {AllTheAudioChannelsOfTheServer?.map((channel_info) => {
                      return (
                        <li
                          className="w-[100%] cursor-pointer bg-black  hover:bg-slate-900 px-[16px] py-[4px] rounded"
                          key={channel_info.id}
                        >
                          <span className="flex items-center gap-[10px] text-[#f2f2f2]">
                            <AiOutlineAudio className="text-[20px]" />

                            <span className="block capitalize">
                              {channel_info.name}
                            </span>
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
                  <ul className="flex flex-col ">
                    {AllTheVideoChannelsOfTheServer?.map((channel_info) => {
                      return (
                        <li
                          className="w-[100%] cursor-pointer bg-black  hover:bg-slate-900 px-[16px] py-[4px] rounded"
                          key={channel_info.id}
                        >
                          <span className="flex items-center gap-[10px] text-[#f2f2f2]">
                            <IoMdVideocam className="text-[18px]" />

                            <span className="block capitalize ">
                              {channel_info.name}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServerSideBarChannelContent;

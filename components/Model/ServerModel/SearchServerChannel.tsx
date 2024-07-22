"use client";
import { Context } from "@/context/ContextApi";
import React, { useContext } from "react";
import { AiOutlineAudio } from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import { IoIosCloseCircleOutline, IoMdVideocam } from "react-icons/io";

function SearchServerChannel({
  Open,
  setOpen,
}: {
  Open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
  } = useContext(Context) as any;

  return (
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
                        <span className="flex items-center gap-[5px] w-[100%] text-[#f2f2f2]">
                          <span className="w-[18px] h-[18px]">
                            <FaHashtag className="w-[18px] h-[18px]" />
                          </span>

                          <span className="block capitalize  overflow-hidden whitespace-nowrap text-ellipsis">
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
                        <span className="flex items-center gap-[5px] w-[100%] text-[#f2f2f2]">
                          <span className="w-[20px] h-[20px]">
                            <AiOutlineAudio className="w-[20px] h-[20px]" />
                          </span>

                          <span className="block capitalize  overflow-hidden whitespace-nowrap text-ellipsis">
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
                        <span className="flex items-center gap-[5px] w-[100%] text-[#f2f2f2]">
                          <span className="w-[18px] h-[18px]">
                            <IoMdVideocam className="w-[18px] h-[18px]" />
                          </span>

                          <span className="block capitalize  overflow-hidden whitespace-nowrap text-ellipsis">
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
  );
}

export default SearchServerChannel;

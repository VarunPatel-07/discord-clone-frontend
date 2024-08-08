"use client";
import React, { useEffect, useContext, useState } from "react";

import { Context } from "@/context/ContextApi";
import { usePathname } from "next/navigation";
import UserProfile from "../UserProfile";
import { getCookie } from "cookies-next";
import SearchServerChannel from "../Model/ServerModel/SearchServerChannel";
import DeleteChannelModal from "../Model/ServerModel/DeleteChannelModal";
import UpdateChannelInfoModel from "../Model/ServerModel/UpdateChannelInfoModel";
import ListOfAllTheServerChannel from "../ListOfAllTheServerChannel";
import UseSocketIO from "@/hooks/UseSocketIO";
function ServerSideBarChannelContent() {
  const PathName = usePathname();
  const {
    FetchTheTextChannelOfTheServer,
    FetchTheAudioChannelOfTheServer,
    FetchTheVideoChannelOfTheServer,

    ServerInfoById,
  } = useContext(Context) as any;
  const socket = UseSocketIO();
  const [Open, setOpen] = useState(false as boolean);

  const [ShowDeleteChannelModal, setShowDeleteChannelModal] = useState(
    false as boolean
  );
  const [ShowUpdateChannelInfoModal, setShowUpdateChannelInfoModal] = useState(
    false as boolean
  );
  const [ChannelInfo, setChannelInfo] = useState({
    name: "" as string,
    type: "" as string,
    id: "" as string,
  } as object);
  const [ChannalId, setChannalId] = useState("" as string);

  const FetchAllTheChannel = () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = PathName.split("/")[3];

    Promise.all([
      FetchTheTextChannelOfTheServer(AuthToken, serverId),
      FetchTheAudioChannelOfTheServer(AuthToken, serverId),
      FetchTheVideoChannelOfTheServer(AuthToken, serverId),
    ]);
  };

  useEffect(() => {
    FetchAllTheChannel();
  }, []);
  useEffect(() => {
    socket?.on("EmitNewChannelHasBeenCreated", () => {
      FetchAllTheChannel();
    });
    return () => {
      socket?.off("EmitNewChannelHasBeenCreated");
    };
  }, [socket]);
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
                  className="w-[14px] h-[14px] text-gray-500 dark:text-gray-400"
                >
                  <path
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    stroke="currentColor"
                  ></path>
                </svg>
              </div>
              <input
                required
                placeholder="Search"
                className="block w-full px-4 py-[5px] ps-10  text-gray-900 border border-gray-300 rounded-lg bg-gray-50  outline-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 fs-14 h-[30px]"
                id="default-search"
                type="search"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[8px] w-[100%] pt-[8px]">
            <ListOfAllTheServerChannel
              setShowUpdateChannelInfoModal={setShowUpdateChannelInfoModal}
              setShowDeleteChannelModal={setShowDeleteChannelModal}
              setChannelInfo={setChannelInfo}
              setChannalId={setChannalId}
              ServerInfoById={ServerInfoById}
            />
          </div>
          <UserProfile Position="absolute bottom-[0px] left-[0px]" />
        </div>
      </div>
      <SearchServerChannel Open={Open} setOpen={setOpen} />
      <DeleteChannelModal
        ShowModal={ShowDeleteChannelModal}
        setShowModal={setShowDeleteChannelModal}
        ChannalId={ChannalId}
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

"use client";
import { Context } from "@/context/ContextApi";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { AiOutlineAudio } from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import { IoIosCloseCircleOutline, IoMdVideocam } from "react-icons/io";

function SearchAllTheServerModal({
  Open,
  setOpen,
}: {
  Open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const Path = usePathname();
  const { push } = useRouter();
  const { FetchTheIncludingServer, Including_Server_Info_Array } = useContext(
    Context
  ) as any;
  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    FetchTheIncludingServer(AuthToken);
  }, []);
  return (
    <div
      className={`w-[100vw] h-[100vh] fixed top-0 left-0 z-20 bg-[rgba(0,0,0,0.5)] backdrop-blur ${
        Open ? "block" : "hidden"
      } `}
    >
      <div className="w-[100%] h-[100%]  flex  items-center justify-center px-[15px]">
        <div className="search-card bg-black border-[1px] w-[100%] max-w-[500px]  rounded-[10px] pb-[10px]">
          <div className="inner-section flex flex-col items-start justify-start gap-[10px]">
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
            <div className="w-[100%] px-[15px] py-[5px]">
              {Including_Server_Info_Array?.map((Info: any) => {
                return (
                  <div
                    key={Info?.id}
                    className=" py-[5px] px-[10px] rounded-[5px] transition-all cursor-pointer border-[1px] border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[transparent] "
                    onClick={() => {
                      push(`/pages/server/${Info?.id}`);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-[10px] ">
                      <div className="profile w-[35px] h-[35px] overflow-hidden rounded-full block">
                        <Avatar className="w-[100%] h-[100%] overflow-hidden  rounded-full block">
                          <AvatarImage
                            className="w-[100%] h-[100%] "
                            src={Info?.imageUrl}
                          />
                          <AvatarFallback>
                            {Info?.name?.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="servername">
                        <p className="global-font-roboto text-white fs-14 capitalize">
                          {Info?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchAllTheServerModal;

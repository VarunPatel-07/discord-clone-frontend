import React, { useContext, useEffect } from "react";

import { Context } from "@/context/ContextApi";
import { AiOutlineAudio } from "react-icons/ai";
import { IoMdVideocam } from "react-icons/io";
import { FaHashtag, FaPen } from "react-icons/fa";
import Message from "./Message";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";

function ShowChannelMessage() {
  const Pathname = usePathname();
  const {
    CurrentChatChannelInfo,
    FetchTheMessageOFTheChannel,
    AllTheMessageOfTheChannel,
  } = useContext(Context) as any;
  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];
    const channel_id = CurrentChatChannelInfo?.ChatId;
    FetchTheMessageOFTheChannel(AuthToken, serverId, channel_id);
  }, []);
  return (
    <div className="w-[100%] h-[100%] relative transition-all duration-300  overflow-auto">
      <div className="w-[100%] h-[100%] flex flex-col items-start justify-end px-[15px] py-[20px] transition-all duration-300">
        <div className="default-section w-[100%]">
          <div className="server_name flex flex-col items-start justify-start gap-[5px]">
            {CurrentChatChannelInfo.ChatType === "TEXT" ? (
              <span className=" w-[60px] h-[60px] flex flex-col items-center justify-center bg-gray-600 rounded-full mb-[10px]">
                <span className="block text-white">
                  <FaHashtag className="w-[35px] h-[35px] " />
                </span>
              </span>
            ) : (
              ""
            )}

            {CurrentChatChannelInfo.ChatType === "AUDIO" ? (
              <span className=" w-[60px] h-[60px] flex flex-col items-center justify-center bg-gray-600 rounded-full mb-[10px] ">
                <span className="block text-white">
                  <AiOutlineAudio className="w-[35px] h-[35px] " />
                </span>
              </span>
            ) : (
              ""
            )}
            {CurrentChatChannelInfo.ChatType === "VIDEO" ? (
              <span className=" w-[60px] h-[60px] flex flex-col items-center justify-center bg-gray-600 rounded-full mb-[10px]">
                <span className="block text-white">
                  <IoMdVideocam className="w-[35px] h-[35px] " />
                </span>
              </span>
            ) : (
              ""
            )}
            <p className="global-font-roboto  text-[30px] font-medium text-white flex items-center gap-[5px]">
              <span className="capitalize inline-block"> welcome to </span>
              <span>#{CurrentChatChannelInfo.ChatName}</span>
            </p>
            <p className="global-font-roboto  text-[16px] font-light text-slate-300 flex items-center gap-[5px]">
              <span className="capitalize inline-block">
                this is the start of
              </span>
              <span> #{CurrentChatChannelInfo.ChatName}</span>
              <span className="capitalize inline-block">the channel</span>
            </p>
            <button className="flex items-center gap-[5px] text-blue-400 px-[10px] py-[5px] transition-all duration-150 rounded-[5px] hover:bg-[#2f3136] mt-[5px]">
              <span>
                <FaPen className="w-[14px] h-[14px] " />
              </span>
              <span className="capitalize">edit channel</span>
            </button>
          </div>
        </div>
        <div className="message-fetching transition-all duration-300 w-[100%] ">
          <span className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.1)] mt-[25px] mb-[30px] block"></span>
          <div className="w-[100%]  ">
            {AllTheMessageOfTheChannel?.map((message: any) => {
              return (
                <Message
                  key={message._id}
                  FullName={message?.member?.user?.FullName}
                  Profile_Picture={message?.member?.user?.Profile_Picture}
                  UserName={message?.member?.user?.UserName}
                  message={message?.content}
                  Is_Edited={message?.Is_Edited}
                  Time={message?.createdAt}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowChannelMessage;

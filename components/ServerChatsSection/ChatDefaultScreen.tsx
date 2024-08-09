import React from "react";
import { FaHashtag, FaPen } from "react-icons/fa";
import { AiOutlineAudio } from "react-icons/ai";
import { IoMdVideocam } from "react-icons/io";
function ChatDefaultScreen({
  CurrentChatChannelInfo,
}: {
  CurrentChatChannelInfo: {
    ChatType: string;
    ChatName: string;
  };
}) {
  return (
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
          <span className="capitalize inline-block">this is the start of</span>
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
  );
}

export default ChatDefaultScreen;

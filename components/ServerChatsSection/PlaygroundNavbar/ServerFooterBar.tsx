import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import React, { useContext, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaRegSmileWink } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

function ServerFooterBar() {
  const Pathname = usePathname();
  const { CurrentChatChannelInfo, SendMessageInTheSelectedChannelOfServer } =
    useContext(Context) as any;
  const [Message, setMessage] = useState("");

  const SendMessageWithDebounce = useDebounce(
    async (
      AuthToken: string,
      serverId: string,
      channelId: string,
      message: string
    ) => {
      await SendMessageInTheSelectedChannelOfServer(
        AuthToken,
        serverId,
        channelId,
        message
      );
    },
    100
  );
  const OnFormSubmit = async (e) => {
    e.preventDefault();
    const AuthToken = getCookie("User_Authentication_Token") as string;

    const serverId = Pathname?.split("/")[3];
    const channel_id = CurrentChatChannelInfo?.ChatId;
    const message = Message;
    SendMessageWithDebounce(AuthToken, serverId, channel_id, message);
    setMessage("");
  };
  return (
    <div className="w-[100%] shadow   px-[12px] pb-[15px] pt-[6px]">
      <div className="w-[100%] h-[100%] py-[5px] bg-[#41464f] px-[12px] rounded-[5px]">
        <div className="w-[100%] flex gap-[5px] ">
          <button className="min-w-[32px] h-[32px] flex justify-center items-center bg-gray-400 rounded-full group">
            <IoMdAdd className="text-[22px] group-hover:rotate-180 transition  duration-150    font-bold text-black" />
          </button>
          <div className="w-[100%]">
            <form onSubmit={OnFormSubmit} className="w-[100%] h-[100%]">
              <input
                type="text"
                className="w-[100%] h-[100%] bg-transparent text-white focus:ring-0 focus:border-0 focus:outline-none global-font-roboto px-[5px]"
                placeholder={`Message #${CurrentChatChannelInfo?.ChatName}`}
                value={Message === "" ? "" : Message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </form>
          </div>
          <button className="min-w-[32px] h-[32px] flex justify-center items-center rounded-full group">
            <BsEmojiSmileFill className="text-[22px]  transition  duration-150    font-bold text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServerFooterBar;

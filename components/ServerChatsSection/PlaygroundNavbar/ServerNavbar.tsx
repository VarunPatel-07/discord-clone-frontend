import React, { useContext, useEffect, useState } from "react";

import { Context } from "@/context/ContextApi";
import { FaHashtag } from "react-icons/fa";
import { AiOutlineAudio } from "react-icons/ai";
import { IoMdVideocam } from "react-icons/io";
import NotificationIcon from "@/components/Notification/NotificationIcon";
import UseSocketIO from "@/hooks/UseSocketIO";
import { getCookie } from "cookies-next";

function ServerNavbar() {
  const { CurrentChatChannelInfo, UserInformation } = useContext(
    Context
  ) as any;
  const [typingIndicator, setTypingIndicator] = useState({
    Is_Typing: false,
    Info: {} as any,
  });
  const socket = UseSocketIO();
  useEffect(() => {
    socket?.on("EmitStartTyping", async (data) => {
      if (data?.is_group_chat) {
        const User_Info = UserInformation
          ? UserInformation
          : JSON.parse(getCookie("User__Info") as string);
        if (data?.user_info?.id !== User_Info?.id) {
          if (data?.chat_info?.ChatId === CurrentChatChannelInfo?.ChatId) {
            setTypingIndicator({
              Is_Typing: true,
              Info: data,
            });
          }
        }
      }
    });
    socket?.on("EmitStopTyping", () => {
      setTypingIndicator({
        Is_Typing: false,
        Info: {},
      });
    });

    return () => {
      socket?.off("EmitStartTyping");
      socket?.off("EmitStopTyping");
    };
  }, [socket]);

  return (
    <>
      <div className="w-[100%] bg-[#41464f] shadow-[0_0px_5px_0_rgba(0,0,0,0.1)] absolute top-0 left-0  z-[1] h-[45px] overflow-hidden ">
        <div className="w-[100%] h-[100%] px-[12px] py-[10px] flex items-center justify-between">
          <div className="w-[100%] h-[100%] max-h-[25px] overflow-hidden">
            <div
              className={`w-[100%] h-[100%] flex flex-col items-start gap-[15px] justify-start transition duration-200 ${
                typingIndicator.Is_Typing
                  ? " translate-y-[-38.5px]"
                  : " translate-y-[0px]"
              } `}
            >
              <div className="server_info">
                <div className="slider-button"></div>
                <div className="server_name flex items-center justify-start gap-[5px]">
                  {CurrentChatChannelInfo.ChatType === "TEXT" ? (
                    <span className="block">
                      <span className="block text-white">
                        <FaHashtag className="w-[16px] h-[16px] " />
                      </span>
                    </span>
                  ) : (
                    ""
                  )}

                  {CurrentChatChannelInfo.ChatType === "AUDIO" ? (
                    <span className="block">
                      <span className="block text-white">
                        <AiOutlineAudio className="w-[20px] h-[20px]" />
                      </span>
                    </span>
                  ) : (
                    ""
                  )}
                  {CurrentChatChannelInfo.ChatType === "VIDEO" ? (
                    <span className="block">
                      <span className="block text-white">
                        <IoMdVideocam className="w-[18px] h-[18px]" />
                      </span>
                    </span>
                  ) : (
                    ""
                  )}
                  <p className="global-font-roboto capitalize fs-16 font-medium text-white">
                    {CurrentChatChannelInfo.ChatName}
                  </p>
                </div>
              </div>
              {CurrentChatChannelInfo.ChatType === "TEXT" && (
                <div className="typing-indicator">
                  <p className="global-font-roboto capitalize text-[14px] font-medium text-[rgba(255,255,255,0.8)] flex items-center justify-center gap-[5px]">
                    <span>{typingIndicator?.Info?.user_info?.UserName}</span>
                    <span>is typing ......</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <NotificationIcon />
        </div>
      </div>
    </>
  );
}

export default ServerNavbar;

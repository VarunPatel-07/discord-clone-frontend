import React, { useContext, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Context } from "@/context/ContextApi";
import { FaHashtag } from "react-icons/fa";
import { AiOutlineAudio } from "react-icons/ai";
import { IoMdVideocam } from "react-icons/io";
import NotificationIcon from "@/components/Notification/NotificationIcon";

function ServerNavbar() {
  const { CurrentChatChannelInfo, TypingIndicator } = useContext(
    Context
  ) as any;
  const [OpenSidebar, setOpenSidebar] = useState(false);

  return (
    <>
      <div className="w-[100%] bg-[#41464f] shadow-[0_0px_5px_0_rgba(0,0,0,0.1)] absolute top-0 left-0  z-[1] h-[45px] overflow-hidden ">
        <div className="w-[100%] h-[100%] px-[12px] py-[10px] flex items-center justify-between">
          <div className="w-[100%] h-[100%] max-h-[25px] overflow-hidden">
            <div
              className={`w-[100%] h-[100%] flex flex-col items-start gap-[15px] justify-start transition duration-200 ${
                TypingIndicator.Is_Typing
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
                    <span>{TypingIndicator?.Info?.user_info?.UserName}</span>
                    <span>is typing ......</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <NotificationIcon />
        </div>
      </div>
      {/* <Sheet open={OpenSidebar} onOpenChange={setOpenSidebar}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet> */}
    </>
  );
}

export default ServerNavbar;

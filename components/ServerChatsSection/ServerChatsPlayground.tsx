import React, { useContext, useEffect } from "react";
import ServerNavbar from "./PlaygroundNavbar/ServerNavbar";
import ServerFooterBar from "./PlaygroundNavbar/ServerFooterBar";
import ShowChannelMessage from "./ShowChannelMessage";
import { ScrollArea } from "../ui/scroll-area";
import AudioAndVideoCallLayout from "../Audio_Video_Call/AudioAndVideoCallLayout";
import { VideoAudioCallContextProvider } from "@/context/CallContextApi";

import { Context } from "@/context/ContextApi";

function ServerChatsPlayground({
  CurrentChatChannelInfo,
  UserInformation,
}: {
  CurrentChatChannelInfo: {
    ChatId: string;
    ChatName: string;
    ChatType: string;
    ChatUserId: string;
  };
  UserInformation: {
    id: string;
  };
}) {
  return (
    <div className="w-[100%] h-[100%]  relative  transition-all duration-200 ease-in-out">
      <ServerNavbar />
      {CurrentChatChannelInfo.ChatType === "TEXT" && (
        <ScrollArea className="w-[100%] h-[100%] py-[50px] chat-section-wrapper">
          <ShowChannelMessage />
        </ScrollArea>
      )}
      <VideoAudioCallContextProvider>
        {CurrentChatChannelInfo.ChatType === "AUDIO" && (
          <div className="w-[100%] h-[100%] pt-[50px]">
            <AudioAndVideoCallLayout Call_Type="AUDIO" />
          </div>
        )}
        {CurrentChatChannelInfo.ChatType === "VIDEO" && (
          <div className="w-[100%] h-[100%] pt-[50px]">
            <AudioAndVideoCallLayout Call_Type="VIDEO" />
          </div>
        )}
      </VideoAudioCallContextProvider>
      {CurrentChatChannelInfo.ChatType === "TEXT" && <ServerFooterBar />}
    </div>
  );
}

export default ServerChatsPlayground;

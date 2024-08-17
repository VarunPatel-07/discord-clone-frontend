import React from "react";
import ServerNavbar from "./PlaygroundNavbar/ServerNavbar";
import ServerFooterBar from "./PlaygroundNavbar/ServerFooterBar";
import ShowChannelMessage from "./ShowChannelMessage";
import { ScrollArea } from "../ui/scroll-area";
import AudioVideoCall from "../AudioVideoCall/AudioVideoCall";
import AudioAndVideoCallLayout from "../Audio_Video_Call/AudioAndVideoCallLayout";
import { VideoAudioCallContextProvider } from "@/context/CallContextApi";

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
    <div className="w-[100%] h-[100%]  overflow-hidden relative  transition-all duration-200 ease-in-out">
      <ServerNavbar />
      {CurrentChatChannelInfo.ChatType === "TEXT" && (
        <ScrollArea className="w-[100%] h-[100%]">
          <ShowChannelMessage />
        </ScrollArea>
      )}
      {(CurrentChatChannelInfo.ChatType === "AUDIO" ||
        CurrentChatChannelInfo.ChatType === "VIDEO") && (
        <VideoAudioCallContextProvider>
          <div className="w-[100%] h-[100%] pt-[50px]">
            <AudioAndVideoCallLayout />
          </div>
        </VideoAudioCallContextProvider>
      )}
      {CurrentChatChannelInfo.ChatType === "TEXT" && <ServerFooterBar />}
    </div>
  );
}

export default ServerChatsPlayground;

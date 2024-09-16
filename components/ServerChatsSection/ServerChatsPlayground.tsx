import React, { useContext, useEffect, useRef, useState } from "react";
import ServerNavbar from "./PlaygroundNavbar/ServerNavbar";
import ServerFooterBar from "./PlaygroundNavbar/ServerFooterBar";
import ShowChannelMessage from "./ShowChannelMessage";
import { ScrollArea } from "../ui/scroll-area";
import AudioAndVideoCallLayout from "../Audio_Video_Call/AudioAndVideoCallLayout";
import { VideoAudioCallContextProvider } from "@/context/CallContextApi";

import { Context } from "@/context/ContextApi";
import SpinnerComponent from "../Loader/SpinnerComponent";
import PermissionRemover from "../Audio_Video_Call/PermissionRemover";

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
  const [Loading, setLoading] = useState(true);
  const [ChannalMessages, setChannalMessages] = useState([] as Array<object>);
  const [finalSelectedImagesArray, setFinalSelectedImagesArray] = useState([] as Array<File>);
  return (
    <div className="w-[100%] h-[100%]  relative  transition-all duration-200 ease-in-out">
      <ServerNavbar />

      {CurrentChatChannelInfo.ChatType === "TEXT" ? (
        <div className="w-[100%] h-[100%] flex flex-col justify-end pt-[50px] pb-[70px] relative">
          <ScrollArea className="w-[100%]   chat-section-wrapper">
            <ShowChannelMessage
              Loading={Loading}
              setLoading={setLoading}
              ChannalMessages={ChannalMessages}
              setChannalMessages={setChannalMessages}
              finalSelectedImagesArray={finalSelectedImagesArray}
            />
          </ScrollArea>
          {Loading && (
            <div className="w-[100%] h-[100%] flex flex-col items-center  justify-center absolute top-0 left-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-[10]">
              <div>
                <SpinnerComponent />
              </div>
            </div>
          )}
        </div>
      ) : null}
      <VideoAudioCallContextProvider>
        {CurrentChatChannelInfo.ChatType === "AUDIO" ? (
          <div className="w-[100%] h-[100%] pt-[50px]">
            <AudioAndVideoCallLayout Call_Type="AUDIO" />
          </div>
        ) : null}
        {CurrentChatChannelInfo.ChatType === "VIDEO" ? (
          <div className="w-[100%] h-[100%] pt-[50px]">
            <AudioAndVideoCallLayout Call_Type="VIDEO" />
          </div>
        ) : null}
      </VideoAudioCallContextProvider>
      {CurrentChatChannelInfo.ChatType === "TEXT" && (
        <ServerFooterBar
          ChannalMessages={ChannalMessages}
          setChannalMessages={setChannalMessages}
          setFinalSelectedImagesArray={setFinalSelectedImagesArray}
        />
      )}
    </div>
  );
}

export default ServerChatsPlayground;

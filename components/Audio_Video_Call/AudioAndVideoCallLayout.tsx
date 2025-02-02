import React, { useContext, useEffect } from "react";
import StartCallScreen from "./SartCallScreen";
import RunningMeetingLayout from "./RunningMeetingLayout";
import { Context } from "@/context/ContextApi";
import JoinAnOngoingMeeting from "./JoinAnOngoingMeeting";
import { getCookie } from "cookies-next";
import SpinnerComponent from "../Loader/SpinnerComponent";
import { VideoAudioCallContext } from "@/context/CallContextApi";

function AudioAndVideoCallLayout({ Call_Type }: { Call_Type: string }) {
  const {
    ANew_VideoMeeting_HasBeenStarted,
    UserInformation,
    UserInfoFetchingFunction,
    AnIncoming_VideoCall_Occurred,
    ANew_AudioMeeting_HasBeenStarted,
    AnIncoming_AudioCall_Occurred,
    CurrentChatChannelInfo,
  } = useContext(Context) as any;
  const { stopVideoTrackFunction, stopAudioTrackFunction } = useContext(VideoAudioCallContext) as any;

  const InComingAudioCall = AnIncoming_AudioCall_Occurred?.Meeting_Initiator_Info
    ? AnIncoming_AudioCall_Occurred
    : JSON.parse(getCookie("An_Incoming_AudioCall") || "");
  const InComingVideoCall = AnIncoming_VideoCall_Occurred?.Meeting_Initiator_Info
    ? AnIncoming_VideoCall_Occurred
    : JSON.parse(getCookie("An_Incoming_VideoCall") || "");

  useEffect(() => {
    if (!UserInformation) {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      UserInfoFetchingFunction(AuthToken);
    }
  }, []);

  useEffect(() => {
    if (CurrentChatChannelInfo.ChatType === "TEXT") {
      stopAudioTrackFunction();
      stopVideoTrackFunction();
    }
  }, [CurrentChatChannelInfo, stopAudioTrackFunction, stopVideoTrackFunction]);

  if (!UserInformation)
    return (
      <div className="w-[100%] h-[100%] relative flex items-center justify-center px-[15px]">
        <div className="flex">
          <SpinnerComponent />
        </div>
      </div>
    );
  return (
    <div className="w-[100%] h-[100%] max-h-[100vh] overflow-hidden relative">
      {InComingAudioCall.An_Incoming_Call ? (
        <JoinAnOngoingMeeting Call_Type={Call_Type} />
      ) : ANew_AudioMeeting_HasBeenStarted.Call_Started ? (
        <RunningMeetingLayout Call_Type={Call_Type} />
      ) : (
        <StartCallScreen Call_Type={Call_Type} />
      )}
    </div>
  );
}

export default AudioAndVideoCallLayout;

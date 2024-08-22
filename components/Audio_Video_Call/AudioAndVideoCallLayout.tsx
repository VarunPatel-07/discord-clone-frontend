import React, { useContext, useEffect, useRef, useState } from "react";
import StartCallScreen from "./SartCallScreen";
import RunningMeetingLayout from "./RunningMeetingLayout";

import { Context } from "@/context/ContextApi";
import JoinAnOngoingMeeting from "./JoinAnOngoingMeeting";
import { getCookie } from "cookies-next";
import { useMeeting } from "@videosdk.live/react-sdk";
import SpinnerComponent from "../Loader/SpinnerComponent";

function AudioAndVideoCallLayout({ Call_Type }: { Call_Type: string }) {
  const {
    ANew_VideoMeeting_HasBeenStarted,
    UserInformation,
    UserInfoFetchingFunction,
    AnIncoming_VideoCall_Occurred,
    ANew_AudioMeeting_HasBeenStarted,
    AnIncoming_AudioCall_Occurred,
  } = useContext(Context) as any;

  const InComingAudioCall =
    AnIncoming_AudioCall_Occurred?.Meeting_Initiator_Info
      ? AnIncoming_AudioCall_Occurred
      : JSON.parse(getCookie("An_Incoming_AudioCall") || "");
  const InComingVideoCall =
    AnIncoming_VideoCall_Occurred?.Meeting_Initiator_Info
      ? AnIncoming_VideoCall_Occurred
      : JSON.parse(getCookie("An_Incoming_VideoCall") || "");

  useEffect(() => {
    if (!UserInformation) {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      UserInfoFetchingFunction(AuthToken);
    }
  }, []);
  useEffect(() => {
    console.log(
      " ANew_VideoMeeting_HasBeenStarted",
      ANew_VideoMeeting_HasBeenStarted
    );
  }, [ANew_VideoMeeting_HasBeenStarted]);

  if (!UserInformation)
    return (
      <div className="w-[100%] h-[100%] relative flex items-center justify-center px-[15px]">
        <div className="flex">
          <SpinnerComponent />
        </div>
      </div>
    );
  if (Call_Type === "AUDIO") {
    return (
      <div className="w-[100%] h-[100%] relative px-[15px]">
        {InComingAudioCall.An_Incoming_Call ? (
          <JoinAnOngoingMeeting Call_Type={Call_Type} />
        ) : ANew_AudioMeeting_HasBeenStarted.Call_Started ? (
          <RunningMeetingLayout Call_Type={Call_Type} />
        ) : (
          <StartCallScreen Call_Type={Call_Type} />
        )}
      </div>
    );
  } else {
    return (
      <div className="w-[100%] h-[100%] relative">
        {InComingVideoCall.An_Incoming_Call ? (
          <div className="w-[100%] h-[100%] px-[15px]">
            <JoinAnOngoingMeeting Call_Type={Call_Type} />
          </div>
        ) : ANew_VideoMeeting_HasBeenStarted.Call_Started ? (
          <RunningMeetingLayout Call_Type={Call_Type} />
        ) : (
          <div className="w-[100%] h-[100%] px-[15px]">
            <StartCallScreen Call_Type={Call_Type} />
          </div>
        )}
      </div>
    );
  }
}

export default AudioAndVideoCallLayout;

import React, { useContext, useEffect, useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { GenerateCallToken } from "./GenerateToken";
import SpinnerComponent from "../Loader/SpinnerComponent";

import { VideoAudioCallContext } from "@/context/CallContextApi";

import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import MeetingController from "./Controller/MeetingController";

import MeetingViewGridLayout from "./MeetingView/MeetingViewGridLayout";
function RunningMeetingLayout({ Call_Type }: { Call_Type: string }) {
  const {
    UserInfoFetchingFunction,
    UserInformation,
    ANew_VideoMeeting_HasBeenStarted,
    ANew_AudioMeeting_HasBeenStarted,
  } = useContext(Context) as any;
  const { MicOn, VideoOn } = useContext(VideoAudioCallContext) as any;

  const [Token, setToken] = useState("" as string);
  const [ActiveSpeakerId, setActiveSpeakerId] = useState("" as string);

  useEffect(() => {
    (async () => {
      const token = await GenerateCallToken();
      setToken(token);
    })();
  }, []);

  useEffect(() => {
    if (!UserInformation) {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      UserInfoFetchingFunction(AuthToken);
    }
  }, [UserInfoFetchingFunction, UserInformation]);

  if (!Token) return <SpinnerComponent />;
  if (Call_Type === "AUDIO") {
    return (
      <MeetingProvider
        config={{
          micEnabled: MicOn,
          webcamEnabled: false,
          name: UserInformation?.UserName,
          debugMode: true,
          meetingId: ANew_AudioMeeting_HasBeenStarted.MeetingId,
          metaData: UserInformation,
        }}
        token={Token}
        // joinWithoutUserInteraction={true}
      >
        <div className="w-[100%] h-[100%] relative  px-[15px]">
          <MeetingViewGridLayout
            UserInformation={UserInformation}
            Call_Type={Call_Type}
            ActiveSpeakerId={ActiveSpeakerId}
            setActiveSpeakerId={setActiveSpeakerId}
          />
        </div>
        <div className="w-[100%] relative z-[10]">
          <MeetingController
            Call_Type={Call_Type}
            ActiveSpeakerId={ActiveSpeakerId}
            setActiveSpeakerId={setActiveSpeakerId}
          />
        </div>
      </MeetingProvider>
    );
  } else {
    return (
      <MeetingProvider
        config={{
          micEnabled: MicOn,
          webcamEnabled: VideoOn,
          name: UserInformation?.UserName,
          debugMode: true,
          meetingId: ANew_VideoMeeting_HasBeenStarted.MeetingId,
          metaData: UserInformation,
        }}
        token={Token}
        // joinWithoutUserInteraction={true}
      >
        <div className="w-[100%] h-[100%] relative px-[15px] ">
          <MeetingViewGridLayout
            UserInformation={UserInformation}
            Call_Type={Call_Type}
            ActiveSpeakerId={ActiveSpeakerId}
            setActiveSpeakerId={setActiveSpeakerId}
          />
        </div>
        <div className="w-[100%] relative z-[10]">
          <MeetingController
            Call_Type={Call_Type}
            ActiveSpeakerId={ActiveSpeakerId}
            setActiveSpeakerId={setActiveSpeakerId}
          />
        </div>
      </MeetingProvider>
    );
  }
}

export default RunningMeetingLayout;

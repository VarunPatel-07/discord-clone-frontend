import React, { useContext, useEffect, useRef, useState } from "react";
import {
  MeetingProvider,
  useMediaDevice,
  useMeeting,
} from "@videosdk.live/react-sdk";
import { GenerateCallToken } from "./GenerateToken";
import SpinnerComponent from "../Loader/SpinnerComponent";

import { VideoAudioCallContext } from "@/context/CallContextApi";
import ReactPlayer from "react-player";
import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import MeetingController from "./Controller/MeetingController";
import MeetingView from "./MeetingView/ParticipantProfile";
import MeetingViewGridLayout from "./MeetingView/MeetingViewGridLayout";
function RunningMeetingLayout() {
  const { UserInfoFetchingFunction, UserInformation, A_New_Meeting_Started } =
    useContext(Context) as any;

  const [Token, setToken] = useState("" as string);

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
  return (
    <MeetingProvider
      config={{
        micEnabled: true,
        webcamEnabled: true,
        name: UserInformation?.UserName,
        debugMode: true,
        meetingId: A_New_Meeting_Started.MeetingId,
        metaData: UserInformation,
      }}
      token={Token}
      // joinWithoutUserInteraction={true}
    >
      <div className="w-[100%] h-[100%] relative pt-[60px]">
        <MeetingViewGridLayout />
      </div>
    </MeetingProvider>
  );
}

export default RunningMeetingLayout;

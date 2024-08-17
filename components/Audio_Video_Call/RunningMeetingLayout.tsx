import React, { useContext, useEffect, useRef, useState } from "react";
import { MeetingProvider, useMediaDevice } from "@videosdk.live/react-sdk";
import { GenerateCallToken } from "./GenerateToken";
import SpinnerComponent from "../Loader/SpinnerComponent";

import { VideoAudioCallContext } from "@/context/CallContextApi";
import ReactPlayer from "react-player";
import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import MeetingController from "./Controller/MeetingController";
import MeetingView from "./MeetingView/MeetingView";
function RunningMeetingLayout() {
  const { UserInfoFetchingFunction, UserInformation } = useContext(
    Context
  ) as any;
  const {
    audioRef,
    Loader,
    MeetingID,
    Video_Stream,
    Audio_Stream,
    MicOn,
    VideoOn,

    GetAudioTrackFunction,
    SelectedMicrophone,
  } = useContext(VideoAudioCallContext) as any;
  const [Token, setToken] = useState("" as string);

  useEffect(() => {
    if (!audioRef.current) {
      GetAudioTrackFunction(SelectedMicrophone.deviceId);
    }
  }, [GetAudioTrackFunction, SelectedMicrophone, audioRef]);
  useEffect(() => {
    (async () => {
      const token = await GenerateCallToken();
      setToken(token);
    })();
    console.log(Video_Stream);
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
        customCameraVideoTrack: Video_Stream,
        customMicrophoneAudioTrack: Audio_Stream,
        micEnabled: MicOn,
        webcamEnabled: VideoOn,
        debugMode: true,
        meetingId: MeetingID,
        name: UserInformation.UserName
          ? UserInformation.UserName
          : "C.V. Raman",
        participantId: "",
        metaData: UserInformation,
      }}
      token={Token}
      joinWithoutUserInteraction={true}
    >
      <div className="w-[100%] h-[100%] relative">
        <MeetingView
          MeetingID={MeetingID}
          audioRef={audioRef}
          Loader={Loader}
          Video_Stream={Video_Stream}
          VideoOn={VideoOn}
          MicOn={MicOn}
        />
      </div>
      <MeetingController />
    </MeetingProvider>
  );
}

export default RunningMeetingLayout;

import React, { useContext, useEffect, useRef, useState } from "react";
import { MeetingProvider, useMediaDevice } from "@videosdk.live/react-sdk";
import { GenerateCallToken } from "./GenerateToken";
import SpinnerComponent from "../Loader/SpinnerComponent";

import { VideoAudioCallContext } from "@/context/CallContextApi";
import ReactPlayer from "react-player";
function RunningMeetingLayout() {
  const {
    audioRef,
    Loader,
    MeetingID,
    Video_Stream,
    Audio_Stream,
    MicOn,
    setMicOn,
    VideoOn,
    setVideoOn,
    GetAudioTrackFunction,
    SelectedMicrophone,
  } = useContext(VideoAudioCallContext) as any;
  const [Token, setToken] = useState("" as string);

  useEffect(() => {
    GetAudioTrackFunction(SelectedMicrophone.deviceId);
  }, [SelectedMicrophone]);
  useEffect(() => {
    (async () => {
      const token = await GenerateCallToken();
      setToken(token);
    })();
  }, []);

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
        name: "C.V. Raman",
        participantId: "",
        multiStream: true,
        maxResolution: "hd",
      }}
      token={Token}
      joinWithoutUserInteraction
    >
      <div className="users-screen-wrapper w-[100%] h-[100%] max-w-[400px] max-h-[200px] flex flex-col items-center justify-center bg-black rounded-[10px] relative">
        <p className="text-white bg-[rgba(0,0,0,0.08)] backdrop-blur-[10px] capitalize global-font-roboto text-[13px] absolute bottom-[10px] left-[10px] border-[1px] border-white px-[10px] py-[1px] rounded-full">
          <span>{MeetingID}</span>
        </p>
        <audio ref={audioRef} autoPlay muted={!MicOn} />
        {Loader ? (
          <div className="flex">
            <SpinnerComponent />
          </div>
        ) : (
          <>
            {!VideoOn ? (
              <p className="text-white capitalize global-font-roboto text-[15px]">
                Video is Off
              </p>
            ) : (
              <ReactPlayer
                url={Video_Stream}
                playsinline // extremely crucial prop
                pip={false}
                light={false}
                controls={false}
                muted={true}
                playing={true}
                height={"100%"}
                width={"100%"}
              />
            )}
          </>
        )}
      </div>
    </MeetingProvider>
  );
}

export default RunningMeetingLayout;

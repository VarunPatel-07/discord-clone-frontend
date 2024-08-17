import SpinnerComponent from "@/components/Loader/SpinnerComponent";
import React from "react";
import ReactPlayer from "react-player";
import { useMeeting } from "@videosdk.live/react-sdk";

function MeetingView({
  MeetingID,
  MicOn,
  audioRef,
  Loader,
  Video_Stream,
  VideoOn,
}: {
  MeetingID: string;
  MicOn: boolean;
  audioRef: any;
  Loader: boolean;
  Video_Stream: MediaStream;
  VideoOn: boolean;
}) {
  function onMeetingJoined() {
    console.log("onMeetingJoined");
  }

  //Event to determine some other participant has joined
  function onParticipantJoined(participant) {
    console.log(" onParticipantJoined", participant);
  }
  const { join, participants, end, leave } = useMeeting({
    onMeetingJoined,
    onParticipantJoined,
  });

  return (
    <div className="users-screen-wrapper w-[100%] h-[100%] max-w-[400px] max-h-[200px] flex flex-col items-center justify-center bg-black rounded-[10px] relative ">
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
  );
}

export default MeetingView;

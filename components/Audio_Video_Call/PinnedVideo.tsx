import { useParticipant } from "@videosdk.live/react-sdk";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LuPinOff } from "react-icons/lu";
import { Context } from "@/context/ContextApi";

function PinnedVideo({ VideoId }: { VideoId: string }) {
  const { setPinningAnSpecificVideoStream } = useContext(Context) as any;
  const micRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName,
    metaData,
  } = useParticipant(VideoId) as any;

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null; // Return null if webcam is off or stream is not available
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("audioElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);
  const UNPinThisVideoButton = () => {
    setPinningAnSpecificVideoStream({
      PinVideo: false,
      video_id: "",
    });
  };
  return (
    <div
      className="w-[100%] h-[100%]  overflow-hidden relative group"
      style={{ backgroundColor: metaData?.ProfileBanner_Color }}
    >
      <div className="flex items-center justify-center absolute top-[10px] right-[10px] z-[2] invisible group-hover:visible">
        <div className="pin-video">
          <button
            className={` w-[30px] h-[30px] rounded-full flex items-center justify-center  bg-indigo-600`}
            onClick={UNPinThisVideoButton}
          >
            <LuPinOff className="w-[18px] h-[18px] text-white transition duration-100 " />
          </button>
        </div>
      </div>

      <p className="text-white bg-[rgba(0,0,0,0.08)] backdrop-blur-[10px] capitalize global-font-roboto text-[13px] absolute bottom-[10px] left-[10px] border-[1px] border-white px-[10px] py-[1px] rounded-full z-[1] ">
        {displayName}
      </p>
      <audio ref={micRef} autoPlay />
      <div className="w-[100%] h-[100%] relative">
        {!webcamOn && !webcamStream ? (
          <div className="w-[100%] h-[100%] flex items-center justify-center">
            <Avatar
              className="w-[90px] h-[90px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: metaData?.ProfileBgColor }}
            >
              <AvatarImage src={metaData?.Profile_Picture}></AvatarImage>
              <AvatarFallback
                className="text-[24px] font-bold w-[100%] h-[100%] capitalize flex items-center justify-center"
                style={{ color: metaData?.ProfileBanner_Color }}
              >
                {metaData?.FullName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted={isLocal}
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
            className="w-[100%] h-[100%] "
          />
        )}
      </div>
    </div>
  );
}

export default PinnedVideo;

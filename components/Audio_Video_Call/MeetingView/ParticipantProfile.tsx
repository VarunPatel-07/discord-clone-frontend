import SpinnerComponent from "@/components/Loader/SpinnerComponent";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { VideoAudioCallContext } from "@/context/CallContextApi";
import { Context } from "@/context/ContextApi";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { IoMdMic, IoMdMicOff, IoMdVideocam } from "react-icons/io";
import { IoVideocamOff } from "react-icons/io5";

function ParticipantProfile({
  participantId,
  UserInformation,
  setCurrent_VideoCall_Participant_Info,
  setCurrent_AudioCall_Participant_Info,
  Call_Type,
}: {
  participantId: string;
  UserInformation: any;
  setCurrent_VideoCall_Participant_Info: React.Dispatch<
    React.SetStateAction<object>
  >;
  setCurrent_AudioCall_Participant_Info: React.Dispatch<
    React.SetStateAction<object>
  >;
  Call_Type: string;
}) {
  const micRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ANew_VideoMeeting_HasBeenStarted } = useContext(Context) as any;
  const {
    setParticipantWebcamYouWantToDisable,

    setParticipantMicYouWantToMute,
    setCurrent_Audio_Mic_Info,
    setCurrent_Webcam_Info,
  } = useContext(VideoAudioCallContext) as any;
  const {
    disableMic,
    disableWebcam,
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName,
    metaData,
  } = useParticipant(participantId) as any;

  useEffect(() => {
    if (webcamStream) {
      setCurrent_Webcam_Info({
        label: webcamStream?.track?.label as string,
        deviceId: webcamStream?.track?.id as string,
        groupId: webcamStream?.id as string,
        kind: webcamStream?.kind as string,
      });
    }
    if (micStream) {
      setCurrent_Audio_Mic_Info({
        label: micStream?.track?.label as string,
        deviceId: micStream?.track?.id as string,
        groupId: micStream?.id as string,
        kind: micStream?.kind as string,
      });
    }
  }, [webcamStream, micStream]);
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
  useEffect(() => {
    if (Call_Type === "VIDEO") {
      setCurrent_VideoCall_Participant_Info(metaData);
    } else {
      setCurrent_AudioCall_Participant_Info(metaData);
    }
  }, []);

  const HandelRemoteParticipantMic = (MicStatus) => {
    if (MicStatus) {
      disableMic();
    }
  };
  const HandelRemoteParticipantWebcam = (WebcamStatus) => {
    if (WebcamStatus) {
      disableWebcam();
    }
  };
  useEffect(() => {
    setParticipantMicYouWantToMute({
      participant_id: metaData?.id,
      mic_status: micOn,
    });
    setParticipantWebcamYouWantToDisable({
      participant_id: metaData?.id,
      webcam_status: webcamOn,
    });
  }, [micOn, webcamOn]);

  return (
    <div
      className="w-[100%] h-[100%]  overflow-hidden relative group"
      style={{ backgroundColor: metaData?.ProfileBanner_Color }}
    >
      {ANew_VideoMeeting_HasBeenStarted?.Meeting_Initiator_Info?.id ===
        UserInformation?.id && (
        <>
          {metaData?.id !== UserInformation?.id && (
            <div className="flex items-center justify-center gap-[10px] absolute top-[10px] right-[10px] z-[2] invisible group-hover:visible">
              <button
                className={` w-[30px] h-[30px] rounded-full flex items-center justify-center ${
                  !micOn ? "bg-pink-700" : "bg-white"
                }`}
                onClick={() => HandelRemoteParticipantMic(micOn)}
              >
                {micOn ? (
                  <IoMdMic className="w-[18px] h-[18px] text-black transition duration-100 " />
                ) : (
                  <IoMdMicOff className="w-[18px] h-[18px] text-white transition duration-100 " />
                )}
              </button>
              <button
                className={` w-[30px] h-[30px] rounded-full flex items-center justify-center ${
                  !webcamOn ? "bg-pink-700" : "bg-white"
                }`}
                onClick={() => HandelRemoteParticipantWebcam(webcamOn)}
              >
                {webcamOn ? (
                  <IoMdVideocam className="w-[18px] h-[18px] text-black transition duration-100 " />
                ) : (
                  <IoVideocamOff className="w-[18px] h-[18px] text-white transition duration-100 " />
                )}
              </button>
            </div>
          )}
        </>
      )}

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
            className="aspect-2by1"
          />
        )}
      </div>
    </div>
  );
}

export default ParticipantProfile;

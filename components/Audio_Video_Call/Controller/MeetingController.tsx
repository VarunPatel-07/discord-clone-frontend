import { VideoAudioCallContext } from "@/context/CallContextApi";
import React, { useContext } from "react";
import { IoMdMic, IoMdMicOff, IoMdVideocam } from "react-icons/io";
import { IoVideocamOff } from "react-icons/io5";
import { MdCall, MdCallEnd } from "react-icons/md";

function MeetingController() {
  const { MicOn, setMicOn, VideoOn, setVideoOn, StartCall } = useContext(
    VideoAudioCallContext
  ) as any;
  return (
    <div className="w-[100%] bg-[#121314] absolute bottom-0 right-0 py-[5px] px-[10px]">
      <div className="flex items-center justify-center w-[100%] h-[100%]">
        <div className="buttons flex items-center justify-center gap-[15px]">
          <button
            className={`w-[50px] h-[50px] ${
              !MicOn ? "bg-pink-700" : "bg-white"
            } transition flex items-center justify-center rounded-full  hover:scale-105`}
            onClick={() => setMicOn(!MicOn)}
            data-tooltip-id="start-call-screen-mic-icon-tooltip"
            data-tooltip-content={!MicOn ? "Turn Mic On" : "Turn Mic Off"}
          >
            {MicOn ? (
              <IoMdMic className="w-[24px] h-[24px] text-black transition duration-100 " />
            ) : (
              <IoMdMicOff className="w-[24px] h-[24px] text-white transition duration-100 " />
            )}
          </button>
          <button
            className={`w-[50px] h-[50px] ${
              !VideoOn ? "bg-pink-700" : "bg-white"
            } transition flex items-center justify-center rounded-full  hover:scale-105`}
            onClick={() => setVideoOn(!VideoOn)}
            data-tooltip-id="start-call-screen-video-icon-tooltip"
            data-tooltip-content={!VideoOn ? "Turn Video On" : "Turn Video Off"}
          >
            {VideoOn ? (
              <IoMdVideocam className="w-[24px] h-[24px] text-black transition duration-100 " />
            ) : (
              <IoVideocamOff className="w-[24px] h-[24px] text-white transition duration-100 " />
            )}
          </button>
          <button
            className={`w-[50px] h-[50px] ${
              StartCall ? "bg-pink-700" : "bg-green-600"
            } transition flex flex-col items-center justify-center rounded-full  hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
            data-tooltip-id="start-call-screen-call-icon-tooltip"
            data-tooltip-content={
              !StartCall ? "Start Video Call" : "End Video Call"
            }
          >
            {!StartCall ? (
              <MdCall className="w-[28px] h-[28px] text-white transition duration-100 " />
            ) : (
              <MdCallEnd className="w-[28px] h-[28px] text-white transition duration-100 " />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MeetingController;

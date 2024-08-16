import SpinnerComponent from "@/components/Loader/SpinnerComponent";
import React from "react";
import { FaMicrophone } from "react-icons/fa";
import { IoMdMic, IoMdMicOff, IoMdVideocam } from "react-icons/io";
import { IoVideocamOff } from "react-icons/io5";
import { MdCall, MdCallEnd } from "react-icons/md";

function StartScreenController({
  MicOn,
  setMicOn,
  VideoOn,
  setVideoOn,
  StartCall,
  setStartCall,
  StartVideoCallProcessOnClick,
  CallingStarted,
}: {
  MicOn: boolean;
  setMicOn: React.Dispatch<React.SetStateAction<boolean>>;
  VideoOn: boolean;
  setVideoOn: React.Dispatch<React.SetStateAction<boolean>>;
  StartCall: boolean;
  setStartCall: React.Dispatch<React.SetStateAction<boolean>>;
  StartVideoCallProcessOnClick: () => void;
  CallingStarted: boolean;
}) {
  return (
    <div className="w-[100%] h-[60px] flex items-center justify-center gap-[15px] ">
      <button
        className={`w-[60px] h-[60px] ${
          !MicOn ? "bg-pink-700" : "bg-white"
        } transition flex items-center justify-center rounded-full  hover:scale-105`}
        onClick={() => setMicOn(!MicOn)}
        data-tooltip-id="start-call-screen-mic-icon-tooltip"
        data-tooltip-content={!MicOn ? "Turn Mic On" : "Turn Mic Off"}
      >
        {MicOn ? (
          <IoMdMic className="w-[20px] h-[20px] text-black transition duration-100 " />
        ) : (
          <IoMdMicOff className="w-[25px] h-[25px] text-white transition duration-100 " />
        )}
      </button>
      <button
        className={`w-[60px] h-[60px] ${
          !VideoOn ? "bg-pink-700" : "bg-white"
        } transition flex items-center justify-center rounded-full  hover:scale-105`}
        onClick={() => setVideoOn(!VideoOn)}
        data-tooltip-id="start-call-screen-video-icon-tooltip"
        data-tooltip-content={!VideoOn ? "Turn Video On" : "Turn Video Off"}
      >
        {VideoOn ? (
          <IoMdVideocam className="w-[25px] h-[25px] text-black transition duration-100 " />
        ) : (
          <IoVideocamOff className="w-[25px] h-[25px] text-white transition duration-100 " />
        )}
      </button>
      <button
        className={`w-[60px] h-[60px] ${
          StartCall ? "bg-pink-700" : "bg-green-600"
        } transition flex flex-col items-center justify-center rounded-full  hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        data-tooltip-id="start-call-screen-call-icon-tooltip"
        data-tooltip-content={!StartCall ? "Start Video Call" : "Turn Mic Off"}
        onClick={StartVideoCallProcessOnClick}
        disabled={CallingStarted}
      >
        {CallingStarted ? (
          <div className="flex">
            <SpinnerComponent />
          </div>
        ) : (
          <>
            {!StartCall ? (
              <MdCall className="w-[25px] h-[25px] text-white transition duration-100 " />
            ) : (
              <MdCallEnd className="w-[25px] h-[25px] text-white transition duration-100 " />
            )}
          </>
        )}
      </button>
    </div>
  );
}

export default StartScreenController;

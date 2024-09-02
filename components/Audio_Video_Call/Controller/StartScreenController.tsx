import SpinnerComponent from "@/components/Loader/SpinnerComponent";
import { Permission } from "@videosdk.live/react-sdk/dist/types/permission";
import React from "react";
import { FaExclamationCircle, FaMicrophone } from "react-icons/fa";
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
  JoinAnOnGoingMeeting,
  IsJoining_Meeting = false,
  Call_Type,
  Is_Mic_Permitted,
  Is_Video_Permitted,
  CheckThePermissionAndRenderDevices,
  setIs_Mic_Permitted,
  setIs_Video_Permitted,
  Video_DeviceAvailable,
}: {
  MicOn: boolean;
  setMicOn: React.Dispatch<React.SetStateAction<boolean>>;
  VideoOn: boolean;
  setVideoOn: React.Dispatch<React.SetStateAction<boolean>>;
  StartCall: boolean;
  setStartCall: React.Dispatch<React.SetStateAction<boolean>>;
  StartVideoCallProcessOnClick?: () => void;
  JoinAnOnGoingMeeting?: () => void;
  CallingStarted: boolean;
  IsJoining_Meeting?: boolean;
  Call_Type: string;
  Is_Mic_Permitted: boolean;
  Is_Video_Permitted: boolean;
  CheckThePermissionAndRenderDevices: (
    type: Permission,
    setState: (perm: boolean) => void
  ) => any;
  setIs_Mic_Permitted: React.Dispatch<React.SetStateAction<boolean>>;
  setIs_Video_Permitted: React.Dispatch<React.SetStateAction<boolean>>;
  Video_DeviceAvailable: boolean;
}) {
  const Turn_The_Mic_On = async () => {
    if (Is_Mic_Permitted) {
      setMicOn(!MicOn);
    } else {
      await CheckThePermissionAndRenderDevices(
        "audio" as any,
        setIs_Mic_Permitted
      );
    }
  };
  const Turn_The_Video_On = async () => {
    if (Is_Video_Permitted) {
      setVideoOn(!VideoOn);
    } else {
      console.log("CheckThePermissionAndRenderDevices");

      await CheckThePermissionAndRenderDevices(
        "video" as any,
        setIs_Video_Permitted
      );
    }
  };
  return (
    <div className="w-[100%]  flex-col flex items-center justify-end gap-[30px]">
      <div className="w-[100%]  flex items-center justify-center gap-[15px] ">
        <button
          className={`w-[60px] h-[60px] ${
            !MicOn || !Is_Mic_Permitted ? "bg-pink-700" : "bg-white"
          } transition flex items-center justify-center rounded-full  hover:scale-105 relative`}
          onClick={Turn_The_Mic_On}
          data-tooltip-id="start-call-screen-mic-icon-tooltip"
          data-tooltip-content={!MicOn ? "Turn Mic On" : "Turn Mic Off"}
        >
          {MicOn && Is_Mic_Permitted ? (
            <IoMdMic className="w-[20px] h-[20px] text-black transition duration-100 " />
          ) : (
            <IoMdMicOff className="w-[25px] h-[25px] text-white transition duration-100 " />
          )}
          {Is_Mic_Permitted ? null : (
            <FaExclamationCircle className="text-yellow-400 w-[18px] h-[18px] absolute top-[0px] right-[-2px]" />
          )}
        </button>
        <button
          className={`w-[60px] h-[60px] ${
            !VideoOn || !Is_Video_Permitted || !Video_DeviceAvailable
              ? "bg-pink-700"
              : "bg-white"
          } transition flex items-center justify-center rounded-full  hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed relative`}
          onClick={Turn_The_Video_On}
          data-tooltip-id="start-call-screen-video-icon-tooltip"
          data-tooltip-content={
            Call_Type === "AUDIO"
              ? "Video Is Not Allowed In Audio Call"
              : !VideoOn
              ? "Turn Video On"
              : "Turn Video Off"
          }
          disabled={Call_Type === "AUDIO" ? true : false}
        >
          {VideoOn && Is_Video_Permitted && Video_DeviceAvailable ? (
            <IoMdVideocam className="w-[25px] h-[25px] text-black transition duration-100 " />
          ) : (
            <IoVideocamOff className="w-[25px] h-[25px] text-white transition duration-100 " />
          )}
          {Call_Type === "AUDIO" ? null : Is_Video_Permitted &&
            Video_DeviceAvailable ? null : (
            <FaExclamationCircle className="text-yellow-400 w-[18px] h-[18px] absolute top-[0px] right-[-2px]" />
          )}
        </button>
        {!IsJoining_Meeting ? (
          <button
            className={`w-[60px] h-[60px] ${
              StartCall ? "bg-pink-700" : "bg-green-600"
            } transition flex flex-col items-center justify-center rounded-full  hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              !Is_Mic_Permitted && !Is_Video_Permitted ? "hidden" : ""
            }`}
            data-tooltip-id="start-call-screen-call-icon-tooltip "
            data-tooltip-content={
              !Is_Mic_Permitted && !Is_Video_Permitted
                ? "Not Allowed To Call Because Of No Permissions"
                : !StartCall
                ? "Start Video Call"
                : "Turn Mic Off"
            }
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
        ) : null}
      </div>
      {IsJoining_Meeting ? (
        <button
          className="w-[100%] px-[15px] py-[10px] text-white bg-green-600 rounded-[10px] text-center max-w-[300px]  "
          onClick={JoinAnOnGoingMeeting}
        >
          Join The Meeting
        </button>
      ) : null}
    </div>
  );
}

export default StartScreenController;

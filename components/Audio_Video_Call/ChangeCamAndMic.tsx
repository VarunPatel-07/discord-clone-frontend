import { useMediaDevice, useMeeting } from "@videosdk.live/react-sdk";
import React, { useContext, useEffect, useState } from "react";
import { MdCameraswitch } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { VideoAudioCallContext } from "@/context/CallContextApi";
import { IoMdMic } from "react-icons/io";
import SpinnerComponent from "../Loader/SpinnerComponent";

function ChangeCamAndMic() {
  const {
    Current_Audio_Mic_Info,
    setCurrent_Audio_Mic_Info,
    Current_Webcam_Info,
    setCurrent_Webcam_Info,
  } = useContext(VideoAudioCallContext) as any;
  const { getCameras, getMicrophones } = useMediaDevice();
  const { changeMic, changeWebcam } = useMeeting();
  const [AvailableCamera, setAvailableCamera] = useState([] as any);
  const [AvailableMicrophone, setAvailableMicrophone] = useState([] as any);
  const [LoadingCamera, setLoadingCamera] = useState(false as boolean);
  const [LoadingMicrophone, setLoadingMicrophone] = useState(false as boolean);

  const getall_TheAvailable_Cameras = async () => {
    setLoadingCamera(true);
    const GettingAllTheAvailableCamera = await getCameras();
    console.log(GettingAllTheAvailableCamera);
    setAvailableCamera(GettingAllTheAvailableCamera);
    setLoadingCamera(false);
  };
  const getAllThe_Available_Mic = async () => {
    setLoadingMicrophone(true);
    const GettingAllTheAvailableMicrophone = await getMicrophones();
    console.log(GettingAllTheAvailableMicrophone);
    setAvailableMicrophone(GettingAllTheAvailableMicrophone);
    setLoadingMicrophone(false);
  };
  const HandleChangeWebcam = async (device: any) => {
    changeWebcam(device.deviceId);
    setCurrent_Webcam_Info({
      label: device?.label as string,
      deviceId: device?.deviceId as string,
      groupId: device?.groupId as string,
      kind: device?.kind as string,
    });
  };
  const HandleChangeMic = async (device: any) => {
    changeMic(device.deviceId);
    setCurrent_Audio_Mic_Info({
      label: device?.label as string,
      deviceId: device?.deviceId as string,
      groupId: device?.groupId as string,
      kind: device?.kind as string,
    });
  };
  return (
    <div className="w-fit">
      <div className="flex items-center justify-start gap-[10px]">
        <div className="change-mic relative">
          <Popover>
            <PopoverTrigger onClick={getAllThe_Available_Mic}>
              <span
                className="w-[45px] h-[45px] flex items-center justify-center bg-indigo-600 rounded-full overflow-hidden"
                data-tooltip-id="change-mic-button-in-running-meeting"
                data-tooltip-content="Change Mic"
              >
                <IoMdMic className="text-white w-[24px] h-[24px]" />
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-fit h-fit p-0">
              <p className="global-font-roboto text-[15px] text-black px-[15px] py-[6px] border-b-black border-b-[1px]">
                Change Mic
              </p>
              <div className="w-[100%] p-[3px]">
                {LoadingCamera ? (
                  <SpinnerComponent />
                ) : (
                  <>
                    {AvailableMicrophone?.map((mic: any) => {
                      return (
                        <p
                          key={mic.deviceId}
                          className={`global-font-roboto text-[15px] capitalize cursor-pointer px-[12px] py-[4px] rounded ${
                            Current_Audio_Mic_Info.label === mic.label
                              ? "bg-green-500 text-white"
                              : "text-gray-900 hover:text-white hover:bg-gray-900"
                          }`}
                          onClick={() => HandleChangeMic(mic)}
                        >
                          {mic.label}
                        </p>
                      );
                    })}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="change-camera">
          <Popover>
            <PopoverTrigger onClick={getall_TheAvailable_Cameras}>
              <span
                className="w-[45px] h-[45px] flex items-center justify-center bg-indigo-600 rounded-full overflow-hidden"
                data-tooltip-id="change-camera-button-in-running-meeting"
                data-tooltip-content="Change Camera"
              >
                <MdCameraswitch className="text-white w-[24px] h-[24px]" />
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-fit h-fit p-0">
              <p className="global-font-roboto text-[15px] text-black px-[15px] py-[6px] border-b-black border-b-[1px]">
                Change Camera
              </p>
              <div className="w-[100%] p-[3px]">
                {LoadingCamera ? (
                  <SpinnerComponent />
                ) : (
                  <>
                    {AvailableCamera?.map((cam: any) => {
                      return (
                        <p
                          key={cam.deviceId}
                          className={`global-font-roboto text-[15px] capitalize cursor-pointer px-[12px] py-[4px] rounded ${
                            Current_Webcam_Info.label === cam.label
                              ? "bg-green-500 text-white"
                              : "text-gray-900 hover:text-white hover:bg-gray-900"
                          }`}
                          onClick={() => HandleChangeWebcam(cam)}
                        >
                          {cam.label}
                        </p>
                      );
                    })}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default ChangeCamAndMic;

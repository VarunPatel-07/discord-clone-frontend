import React from "react";

function AvailableDeviceList({
  ShowSelectCamModal,
  setShowSelectCamModal,
  AvailableCameras,
  SelectedCamera,
  SelectedMicrophone,
  ShowSelectMicModal,
  setShowSelectMicModal,
  AvailableMicrophones,
  onDeviceChanged,
}: {
  ShowSelectCamModal: boolean;
  setShowSelectCamModal: React.Dispatch<React.SetStateAction<boolean>>;
  AvailableCameras: any;
  SelectedCamera: any;
  SelectedMicrophone: any;
  ShowSelectMicModal: boolean;
  setShowSelectMicModal: React.Dispatch<React.SetStateAction<boolean>>;
  AvailableMicrophones: any;
  onDeviceChanged: (devices, device_type?) => void;
}) {
  return (
    <div className="w-[100%] flex items-start justify-center  gap-[20px]">
      <div className="w-[50%] ">
        <div className="w-[100%] relative">
          <button
            className="w-[100%] border-[1px] border-white rounded-[5px] px-[15px] py-[5px] text-start"
            onClick={() => {
              setShowSelectMicModal(false);
              setShowSelectCamModal(!ShowSelectCamModal);
            }}
          >
            <span className="global-font-roboto text-[15px] text-white text-start">
              {SelectedCamera.label ? SelectedCamera.label : "Select Camera"}
            </span>
          </button>
          <div
            className={`w-[100%] bg-white overflow-hidden rounded-[5px] absolute z-[10] top-[36px] left-0 transition-opacity duration-200 ${
              ShowSelectCamModal ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            {AvailableCameras.map((cam: any) => {
              if (cam.deviceId === "default") return;
              return (
                <p
                  key={cam.groupId}
                  className={`cursor-pointer global-font-roboto text-[15px] text-black w-[100%] py-[5px] px-[10px] inline-block border-0 outline-none ring-0  ${
                    SelectedCamera.label === cam.label
                      ? "bg-green-400"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => onDeviceChanged(cam, "CAM")}
                >
                  {cam.label}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-[50%] ">
        <div className="w-[100%] relative">
          <button
            className="w-[100%] border-[1px] border-white rounded-[5px] px-[15px] py-[5px] text-start"
            onClick={() => {
              setShowSelectCamModal(false);
              setShowSelectMicModal(!ShowSelectMicModal);
            }}
          >
            <span className="global-font-roboto text-[15px] text-white text-start">
              {SelectedMicrophone.label
                ? SelectedMicrophone.label
                : "Select Microphone"}
            </span>
          </button>
          <div
            className={`w-[100%] bg-white overflow-hidden rounded-[5px] absolute z-[10] top-[36px] left-0  transition-opacity duration-200 ${
              ShowSelectMicModal
                ? "visible opacity-100 "
                : "invisible opacity-0"
            }`}
          >
            {AvailableMicrophones.map((mic: any) => {
              if (mic.deviceId === "default") return;
              return (
                <p
                  key={mic.groupId}
                  className={`cursor-pointer global-font-roboto text-[15px] text-black w-[100%] py-[5px] px-[10px] inline-block border-0 outline-none ring-0  ${
                    SelectedMicrophone.label === mic.label
                      ? "bg-green-400"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => onDeviceChanged(mic, "MIC")}
                >
                  {mic.label}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvailableDeviceList;

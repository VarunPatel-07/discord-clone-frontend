import { useMediaDevice } from "@videosdk.live/react-sdk";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { GoUnmute } from "react-icons/go";
import { Tooltip as ReactTooltip } from "react-tooltip";
function TestYourSpakerComponent() {
  const { getPlaybackDevices } = useMediaDevice();
  const [AllThePlaybackDevices, setAllThePlaybackDevices] = useState([] as any);
  const getAllThePlaybackDevices = async () => {
    const PlaybackDevices = await getPlaybackDevices();
    setAllThePlaybackDevices(PlaybackDevices);
  };

  return (
    <div className="w-fit">
      <Popover>
        <PopoverTrigger className="w-fit" onClick={getAllThePlaybackDevices}>
          <span
            className="w-[45px] h-[45px] flex items-center justify-center bg-orange-600 rounded-full overflow-hidden"
            data-tooltip-id="change-or-test-speaker-button"
            data-tooltip-content="test or change output speaker"
          >
            <GoUnmute className="text-white w-[24px] h-[24px]" />
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-fit h-fit p-0">
          <p className="global-font-roboto text-[15px] text-black px-[15px] py-[6px] border-b-black border-b-[1px]">
            Change Output Speaker
          </p>
          <div className="fw-[100%] p-[3px]">
            {AllThePlaybackDevices?.map((device: any) => {
              return (
                <p
                  key={device.deviceId}
                  className={`global-font-roboto text-[15px] capitalize cursor-pointer px-[12px] py-[4px] rounded text-gray-900 hover:text-white hover:bg-gray-900`}
                >
                  {device.label}
                </p>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      <ReactTooltip
        id="change-or-test-speaker-button"
        place="top"
        style={{ backgroundColor: "white", color: "black", opacity: "1" }} opacity={1}
      />
    </div>
  );
}

export default TestYourSpakerComponent;

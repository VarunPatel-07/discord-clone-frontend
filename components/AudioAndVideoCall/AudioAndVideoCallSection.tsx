import { Context } from "@/context/ContextApi";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import CallActionFooterBar from "./CallActionFooterBar";
import UseSocketIO from "@/hooks/UseSocketIO";
import { useDebounce } from "@/hooks/debounceHook";

function AudioAndVideoCallSection() {
  //
  //
  //
  const socket = UseSocketIO();
  //
  //
  //
  const { CurrentChatChannelInfo, UserInformation } = useContext(
    Context
  ) as any;
  //
  //
  //
  const [YourStream, setYourStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [TurnVideoOff, setTurnVideoOff] = useState(false);
  const [TurnMicOff, setTurnMicOff] = useState(false);
  const [CallStarted, setCallStarted] = useState(false);

  // const getUserMedia = useCallback(async () => {
  //   try {
  //     const devices = await navigator.mediaDevices.enumerateDevices();
  //     const videoDevice = devices.find(
  //       (device) => device.kind === "videoinput"
  //     );
  //     const audioDevice = devices.find(
  //       (device) => device.kind === "audioinput"
  //     );

  //     if (!videoDevice || !audioDevice) {
  //       throw new Error("No suitable video or audio device found");
  //     }
  //     if (TurnVideoOff) {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         audio: { deviceId: audioDevice.deviceId },
  //       });
  //       console.log(stream);

  //       setYourStream(stream);

  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //       }
  //     } else if (TurnVideoOff) {
  //       const stream = await navigator.mediaDevices.getUserMedia({});
  //       console.log(stream);

  //       setYourStream(stream);

  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //       }
  //     } else {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: { deviceId: videoDevice.deviceId },
  //         audio: { deviceId: audioDevice.deviceId },
  //       });
  //       console.log(stream);

  //       setYourStream(stream);

  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //       }
  //     }
  //     setCallStarted(true);
  //   } catch (err) {
  //     console.error("Error accessing media devices.", err);
  //   }
  // }, [TurnVideoOff]);

  // useEffect(() => {
  //   getUserMedia();
  // }, [CurrentChatChannelInfo, getUserMedia]);


  const StartCallFunction = () => {};

  const HandelTheStartCallFunctionBySocket = (data: any) => {
    console.log(data);
  };



  useEffect(() => {
    socket?.on("StartTheCallAndJoinRoom", (data) => {
      HandelTheStartCallFunctionBySocket(data);
    });
    socket?.on("NewUserJoinedTheCall", (data) => {
      console.log("NewUserJoinedTheCall", data);
    });

    return () => {
      socket?.off("EmitUserStatusChanged");
      socket?.off("NewUserJoinedTheCall");
    };
  }, [socket]);

  return (
    <>
      <div className="pt-[50px] pb-[30px] px-[20px]">
        <button onClick={() => setTurnVideoOff(!TurnVideoOff)}></button>
        {YourStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="100%"
            height="100%"
            className="rounded-[15px] max-w-[400px] max-h-[300px] overflow-hidden"
          />
        ) : (
          "yha loader he"
        )}
      </div>
      <CallActionFooterBar
        TurnMicOff={TurnMicOff}
        setTurnMicOff={setTurnMicOff}
        TurnVideoOff={TurnVideoOff}
        setTurnVideoOff={setTurnVideoOff}
        CallStarted={CallStarted}
        setCallStarted={setCallStarted}
        StartCallFunction={StartCallFunction}
      />
    </>
  );
}

export default AudioAndVideoCallSection;

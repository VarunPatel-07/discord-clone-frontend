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

import peerService from "@/services/peer";
import App from "../TestTest";
import { get } from "http";
import { getCookie } from "cookies-next";

function AudioAndVideoCallSection() {
  //
  //
  //
  const socket = UseSocketIO();
  //
  //
  //
  const {
    CurrentChatChannelInfo,
    UserInformation,
    SendVideoCallInfoSdp_To_Backend,
  } = useContext(Context) as any;
  //
  //
  //
  const [YourStream, setYourStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [TurnVideoOff, setTurnVideoOff] = useState(false);
  const [TurnMicOff, setTurnMicOff] = useState(false);
  const [CallStarted, setCallStarted] = useState(false);

  const getUserMedia = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevice = devices.find(
        (device) => device.kind === "videoinput"
      );
      const audioDevice = devices.find(
        (device) => device.kind === "audioinput"
      );

      if (!videoDevice || !audioDevice) {
        throw new Error("No suitable video or audio device found");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: videoDevice.deviceId },
        audio: { deviceId: audioDevice.deviceId },
      });

      setYourStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCallStarted(true);
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const Handel_Peer_Negotiation_Needed_Event = async (peer: any) => {
    await peer.generateOffer();

    const Payload = {
      sdp: peer.peer.localDescription,
    };
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await SendVideoCallInfoSdp_To_Backend(AuthToken, Payload);
    console.log("completed");
  };

  const StartCallFunction = async () => {
    getUserMedia();
    const peer = peerService;
    if (!YourStream) return;
    YourStream.getTracks().forEach((track: MediaStreamTrack) => {
      console.log(track);
      peer.peer.addTrack(track, YourStream);
    });
    peer.peer.onnegotiationneeded = () => {
      Handel_Peer_Negotiation_Needed_Event(peer);
    };
  };

  return (
    <>
      <div className="pt-[50px] pb-[30px] px-[20px]">
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

"use client";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/ContextApi";
import MyVideoConference from "./MyVideoConference";

export default function AudioVideoCall({ Is_VideoCall }: { Is_VideoCall: boolean }) {
  // TODO: get user input for room and name

  const { UserInformation, CurrentChatChannelInfo } = useContext(Context) as any;
  const [token, setToken] = useState("");

  useEffect(() => {
    const room = CurrentChatChannelInfo?.ChatId;
    const UserName = UserInformation?.UserName;
    if (!room || !UserName) return;
    (async () => {
      try {
        const resp = await fetch(`/api/liveKit?room=${room}&username=${UserName}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (token === "") {
    return <div>Getting token...</div>;
  }

  return (
    <LiveKitRoom
      video={Is_VideoCall}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVE_KIT_WEBSOCKET_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: "100%" }}>
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar style={{ backgroundColor: "green" }} />
    </LiveKitRoom>
  );
}

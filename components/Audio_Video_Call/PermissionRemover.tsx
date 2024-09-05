import { VideoAudioCallContext } from "@/context/CallContextApi";
import React, { useContext, useEffect } from "react";

function PermissionRemover({
  CurrentChatChannelInfo,
}: {
  CurrentChatChannelInfo: any;
}) {
  const { stopVideoTrackFunction, stopAudioTrackFunction } = useContext(
    VideoAudioCallContext
  ) as any;
  useEffect(() => {
    if (CurrentChatChannelInfo.ChatType === "TEXT") {
      console.log("removing permission");
    //   stopAudioTrackFunction();
      stopVideoTrackFunction();
    }
  }, [CurrentChatChannelInfo, stopAudioTrackFunction, stopVideoTrackFunction]);
  return null;
}

export default PermissionRemover;

import React, { useContext, useRef, useState } from "react";
import StartCallScreen from "./SartCallScreen";
import RunningMeetingLayout from "./RunningMeetingLayout";

import {
  VideoAudioCallContext,
  VideoAudioCallContextProvider,
} from "@/context/CallContextApi";
import MeetingController from "./Controller/MeetingController";

function AudioAndVideoCallLayout() {
  const { A_New_Meeting_Started } = useContext(VideoAudioCallContext) as any;
  return (
    <div className="w-[100%] h-[100%] relative">
      {!A_New_Meeting_Started && <StartCallScreen />}
      {A_New_Meeting_Started && (
        <div className="w-[100%] h-[100%] pt-[50px]">
          <RunningMeetingLayout />
        </div>
      )}
    </div>
  );
}

export default AudioAndVideoCallLayout;

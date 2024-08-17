import React, { useContext, useEffect, useRef, useState } from "react";
import StartCallScreen from "./SartCallScreen";
import RunningMeetingLayout from "./RunningMeetingLayout";

import { Context } from "@/context/ContextApi";
import JoinAnOngoingMeeting from "./JoinAnOngoingMeeting";
import { getCookie } from "cookies-next";

function AudioAndVideoCallLayout() {
  const {
    A_New_Meeting_Started,
    setA_New_Meeting_Started,
    UserInformation,
    UserInfoFetchingFunction,
    AnIncomingCallOccurred,
    setAnIncomingCallOccurred,
  } = useContext(Context) as any;
  useEffect(() => {
    if (!UserInformation) {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      UserInfoFetchingFunction(AuthToken);
    }
  }, []);
  if (!UserInformation) return;

  return (
    <div className="w-[100%] h-[100%] relative">
      {AnIncomingCallOccurred.An_Incoming_Call && <JoinAnOngoingMeeting />}
      {A_New_Meeting_Started.Call_Started ? (
        <RunningMeetingLayout />
      ) : (
        <StartCallScreen />
      )}
      <p className="p-[50px]"></p>
    </div>
  );
}

export default AudioAndVideoCallLayout;

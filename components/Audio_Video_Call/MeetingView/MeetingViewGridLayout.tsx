import { useMeeting } from "@videosdk.live/react-sdk";
import React, { useContext, useEffect, useState } from "react";
import ParticipantProfile from "./ParticipantProfile";
import { useDebounce } from "@/hooks/debounceHook";
import SpinnerComponent from "@/components/Loader/SpinnerComponent";
import { VideoAudioCallContext } from "@/context/CallContextApi";
import { Context } from "@/context/ContextApi";

function MeetingViewGridLayout({
  UserInformation,
  Call_Type,
  ActiveSpeakerId,
  setActiveSpeakerId,
}: {
  UserInformation: any;
  Call_Type: string;
  ActiveSpeakerId: string;
  setActiveSpeakerId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { join, participants, end, leave } = useMeeting({});
  const [JoinMeetingPopUp, setJoinMeetingPopUp] = useState(true as boolean);
 
  const {
    Current_VideoCall_Participant_Info,
    setCurrent_VideoCall_Participant_Info,
    Current_AudioCall_Participant_Info,
    setCurrent_AudioCall_Participant_Info,
    setStartCall,
    setVideoOn,
    setMicOn,
  } = useContext(VideoAudioCallContext) as any;
  const {
    setANew_VideoMeeting_HasBeenStarted,
    setANew_AudioMeeting_HasBeenStarted,
  } = useContext(Context) as any;
  const JoinMeetingUsingDebounce = useDebounce(() => {
    setJoinMeetingPopUp(false);
    join();
  }, 500);

  useEffect(() => {
    if (Call_Type === "AUDIO") {
      if (Current_AudioCall_Participant_Info.id !== UserInformation.id) {
        JoinMeetingUsingDebounce();
      } else {
        leave();
        setANew_AudioMeeting_HasBeenStarted({
          Call_Started: false,
          Meeting_Initiator_Info: {},
          Server_Info: {},
          MeetingId: "",
        });
        setStartCall(false);
        setMicOn(false);
        setVideoOn(false);
      }
    } else {
      if (Current_VideoCall_Participant_Info.id !== UserInformation.id) {
        JoinMeetingUsingDebounce();
      } else {
        leave();
        setANew_VideoMeeting_HasBeenStarted({
          Call_Started: false,
          Meeting_Initiator_Info: {},
          Server_Info: {},
          MeetingId: "",
        });
        setStartCall(false);
        setMicOn(false);
        setVideoOn(false);
      }
    }
  }, [JoinMeetingUsingDebounce]);

  const getGridStyle = (count) => {
    if (count === 1) {
      return {
        gridCols: "flex flex-wrap items-center justify-center",
        cardStyle:
          "w-[100%] h-auto mam-h-[80%] aspect-video py-[10px] rounded-[10px]	", // High quality size
        quality: "High",
      };
    } else if (count <= 4) {
      return {
        gridCols: "flex flex-wrap items-center justify-center",
        cardStyle: "w-[50%] h-auto aspect-video py-[10px]	px-[10px]", // High quality size
        quality: "High",
      };
    } else if (count <= 6) {
      return {
        gridCols: "grid-cols-2 md:grid-cols-3",
        cardStyle: "h-48 w-72", // Medium quality size
        quality: "Med",
      };
    } else {
      return {
        gridCols: "grid-cols-2 md:grid-cols-4",
        cardStyle: "h-36 w-60", // Low quality size
        quality: "Low",
      };
    }
  };

  const { gridCols, cardStyle } = getGridStyle(
    Array.from(participants.keys()).length
  );

  const {} = useMeeting({
    onSpeakerChanged: (activeSpeakerId) => {
      setActiveSpeakerId(activeSpeakerId as string);
    },
  });

  return (
    <div className="w-[100%] h-[100%]">
      {JoinMeetingPopUp ? (
        <div className="w-[100%] h-[100%] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-[20px]">
            <p className="text-white text-[16px] font-medium capitalize">
              joining You in the meeting ......
            </p>
            <SpinnerComponent />
          </div>
        </div>
      ) : (
        <div className={`h-[100%] w-[100%]  ${gridCols}  pb-[70px]`}>
          {Array.from(participants.keys()).map((participantId) => (
            <div key={participantId} className={` ${cardStyle}`}>
              <div
                className={`w-[100%] h-[100%] overflow-hidden rounded-[10px] ${
                  ActiveSpeakerId === participantId
                    ? "border-[2px] border-red-600"
                    : "border-[2px] border-transparent"
                }`}
              >
                <ParticipantProfile
                  participantId={participantId}
                  UserInformation={UserInformation}
                  setCurrent_VideoCall_Participant_Info={
                    setCurrent_VideoCall_Participant_Info
                  }
                  setCurrent_AudioCall_Participant_Info={
                    setCurrent_AudioCall_Participant_Info
                  }
                  Call_Type={Call_Type}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeetingViewGridLayout;

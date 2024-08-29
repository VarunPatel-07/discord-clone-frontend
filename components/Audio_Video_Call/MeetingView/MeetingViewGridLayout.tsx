import { useMeeting } from "@videosdk.live/react-sdk";
import React, { useContext, useEffect, useState } from "react";
import ParticipantProfile from "./ParticipantProfile";
import { useDebounce } from "@/hooks/debounceHook";
import SpinnerComponent from "@/components/Loader/SpinnerComponent";
import { VideoAudioCallContext } from "@/context/CallContextApi";
import { Context } from "@/context/ContextApi";
import PinnedVideo from "../PinnedVideo";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const {
    setStartCall,
    setVideoOn,
    setMicOn,
    setANewParticipant_Notification,
  } = useContext(VideoAudioCallContext) as any;
  const {
    setANew_VideoMeeting_HasBeenStarted,
    setANew_AudioMeeting_HasBeenStarted,
    PinningAnSpecificVideoStream,
    Current_VideoCall_Participant_Info,
    setCurrent_VideoCall_Participant_Info,
    Current_AudioCall_Participant_Info,
    setCurrent_AudioCall_Participant_Info,
  } = useContext(Context) as any;

  const { join, participants, end, leave } = useMeeting({
    onParticipantJoined: (ParticipantInfo: any) => {
      const NotificationData = {
        id: ParticipantInfo?.id,
        participant_id: ParticipantInfo?.metaData?.id,
        FullName: ParticipantInfo?.metaData?.FullName,
        UserName: ParticipantInfo?.metaData?.UserName,
        Profile_Picture: ParticipantInfo?.metaData?.Profile_Picture,
        ProfileBanner_Color: ParticipantInfo?.metaData?.ProfileBanner_Color,
        ProfileBgColor: ParticipantInfo?.metaData?.ProfileBgColor,
        Message: "joined the meeting",
      };
      setANewParticipant_Notification((prev: any) => [
        ...prev,
        NotificationData,
      ]);
      setTimeout(() => {
        const element = document.getElementById(ParticipantInfo?.id);
        if (element) {
          element.classList.remove("animate-enter");
          element.classList.add("animate-exit");
          element.addEventListener("animationend", () => {
            setANewParticipant_Notification((prev: any) =>
              prev.filter((item: any) => item.id !== ParticipantInfo?.id)
            );
          });
        }
      }, 4000);
    },
    onParticipantLeft: (ParticipantInfo: any) => {
      const NotificationData = {
        id: ParticipantInfo?.id,
        participant_id: ParticipantInfo?.metaData?.id,
        FullName: ParticipantInfo?.metaData?.FullName,
        UserName: ParticipantInfo?.metaData?.UserName,
        Profile_Picture: ParticipantInfo?.metaData?.Profile_Picture,
        ProfileBanner_Color: ParticipantInfo?.metaData?.ProfileBanner_Color,
        ProfileBgColor: ParticipantInfo?.metaData?.ProfileBgColor,
        Message: "Left The Meeting",
      };
      setANewParticipant_Notification((prev: any) => [
        ...prev,
        NotificationData,
      ]);
      setTimeout(() => {
        const element = document.getElementById(ParticipantInfo?.id);
        if (element) {
          element.classList.remove("animate-enter");
          element.classList.add("animate-exit");
          element.addEventListener("animationend", () => {
            setANewParticipant_Notification((prev: any) =>
              prev.filter((item: any) => item.id !== ParticipantInfo?.id)
            );
          });
        }
      }, 4000);
    },
  });
  const [JoinMeetingPopUp, setJoinMeetingPopUp] = useState(true as boolean);

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
          "w-[100%] h-[100%] max-w-[1000px] max-h-[500px] py-[10px] rounded-[10px]	", // High quality size
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
      console.log(activeSpeakerId);
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
      ) : PinningAnSpecificVideoStream.PinVideo ? (
        <div className="w-[100%] h-[100%]">
          <div className=" w-[100%] h-[100%] flex items-start justify-center gap-[12px] pb-[70px]">
            <div className="pinned-video w-[70%] h-[100%] flex items-center justify-center">
              <div
                className={`w-[100%] h-[100%] max-h-[500px] overflow-hidden rounded-[10px] ${
                  ActiveSpeakerId === PinningAnSpecificVideoStream.video_id
                    ? "border-[2px] border-red-600"
                    : "border-[2px] border-transparent"
                }`}
              >
                <PinnedVideo VideoId={PinningAnSpecificVideoStream.video_id} />
              </div>
            </div>
            <div className="other-participant w-[30%] h-[100%]">
              <ScrollArea className="w-[100%] h-[100%]">
                {Array.from(participants.keys())
                  .filter(
                    (participant_id: any) =>
                      participant_id !== PinningAnSpecificVideoStream.video_id
                  )
                  .map((participantId) => (
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
                        key={participantId}
                      />
                    </div>
                  ))}
              </ScrollArea>
            </div>
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
                  key={participantId}
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

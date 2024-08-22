import { VideoAudioCallContext } from "@/context/CallContextApi";
import { Context } from "@/context/ContextApi";
import { useMeeting } from "@videosdk.live/react-sdk";
import React, { useContext } from "react";
import { IoMdMic, IoMdMicOff, IoMdVideocam } from "react-icons/io";
import { IoVideocamOff } from "react-icons/io5";
import { MdCall, MdCallEnd } from "react-icons/md";
import ChangeCamAndMic from "../ChangeCamAndMic";
import { deleteCookie, getCookie } from "cookies-next";
import { BsMicMuteFill } from "react-icons/bs";
import TestYourSpakerComponent from "../TestYourSpakerComponent";
import { Tooltip as ReactTooltip } from "react-tooltip";
function MeetingController({
  Call_Type,
  ActiveSpeakerId,
  setActiveSpeakerId,
}: {
  Call_Type: string;
  ActiveSpeakerId: string;
  setActiveSpeakerId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const {
    ANew_VideoMeeting_HasBeenStarted,
    setANew_VideoMeeting_HasBeenStarted,
    ANew_AudioMeeting_HasBeenStarted,
    setANew_AudioMeeting_HasBeenStarted,
    UserInformation,
  } = useContext(Context) as any;
  const {
    MicOn,
    setMicOn,
    VideoOn,
    setVideoOn,
    StartCall,
    setStartCall,
    ParticipantWebcamYouWantToDisable,
    ParticipantMicYouWantToMute,
    setParticipantWebcamYouWantToDisable,
    setParticipantMicYouWantToMute,
    setCurrent_VideoCall_Participant_Info,
    setCurrent_AudioCall_Participant_Info,
  } = useContext(VideoAudioCallContext) as any;

  const { toggleMic, toggleWebcam, end, leave } = useMeeting({
    onMeetingLeft: () => {
      console.log("Meeting left");
      setMicOn(false);
      setVideoOn(false);
      if (Call_Type === "AUDIO") {
        setANew_AudioMeeting_HasBeenStarted({
          Call_Started: false,
          Meeting_Initiator_Info: {},
          Server_Info: {},
          MeetingId: "",
          ChannelInfo: {},
        });
        setCurrent_AudioCall_Participant_Info({});
      } else {
        setANew_VideoMeeting_HasBeenStarted({
          Call_Started: false,
          Meeting_Initiator_Info: {},
          Server_Info: {},
          MeetingId: "",
          ChannelInfo: {},
        });
        setCurrent_VideoCall_Participant_Info({});
      }
      setStartCall(false);
    },
  });
  const EndTheVideoCall = async () => {
    try {
      if (Call_Type === "AUDIO") {
        if (getCookie("An_Incoming_AudioCall")) {
          deleteCookie("An_Incoming_AudioCall");
        }

        setANew_AudioMeeting_HasBeenStarted({
          Call_Started: false,
          Meeting_Initiator_Info: {},
          Server_Info: {},
          MeetingId: "",
          ChannelInfo: {},
        });

        setCurrent_AudioCall_Participant_Info({});
      } else {
        if (getCookie("An_Incoming_VideoCall")) {
          deleteCookie("An_Incoming_VideoCall");
        }
        setANew_VideoMeeting_HasBeenStarted({
          Call_Started: false,
          Meeting_Initiator_Info: {},
          Server_Info: {},
          MeetingId: "",
          ChannelInfo: {},
        });
        setCurrent_VideoCall_Participant_Info({});
      }
      setStartCall(false);
      setMicOn(false);
      setVideoOn(false);

      end();
    } catch (error) {
      console.log(error);
    }
  };
  const LeaveTheVideoCall = async () => {
    if (Call_Type === "AUDIO") {
      setANew_AudioMeeting_HasBeenStarted({
        Call_Started: false,
        Meeting_Initiator_Info: {},
        Server_Info: {},
        MeetingId: "",
        ChannelInfo: {},
      });
      setCurrent_AudioCall_Participant_Info({});
    } else {
      setANew_VideoMeeting_HasBeenStarted({
        Call_Started: false,
        Meeting_Initiator_Info: {},
        Server_Info: {},
        MeetingId: "",
        ChannelInfo: {},
      });
      setCurrent_VideoCall_Participant_Info({});
    }
    setStartCall(false);
    setMicOn(false);
    setVideoOn(false);
    await leave();
  };

  const ToggleMicFunction = async () => {
    setActiveSpeakerId("");
    if (!MicOn) {
      await toggleMic();
      setMicOn(true);
      setParticipantMicYouWantToMute({
        participant_id: "",
        mic_status: true,
      });
    } else {
      await toggleMic();
      setMicOn(false);
    }
  };
  const ToggleVideoFunction = async () => {
    if (!VideoOn) {
      await toggleWebcam();
      setVideoOn(true);
      setParticipantWebcamYouWantToDisable({
        participant_id: "",
        webcam_status: true,
      });
    } else {
      await toggleWebcam();
      setVideoOn(false);
    }
  };

  return (
    <div className="w-[100%] h-[69px] bg-[rgba(0,0,0,0.3)] backdrop-blur-[10px] absolute bottom-0 right-0 py-[12px] px-[10px]">
      <div className="flex items-center justify-between w-[100%] h-[100%] px-[15px]">
        <div className="change_your_current_CamAndMic">
          <ChangeCamAndMic />
        </div>
        <div className="buttons flex items-center justify-center gap-[15px]">
          {ParticipantMicYouWantToMute.participant_id === UserInformation.id ? (
            <button
              className={`w-[45px] h-[45px] ${
                !ParticipantMicYouWantToMute.mic_status
                  ? "bg-pink-700"
                  : "bg-white"
              } transition flex items-center justify-center rounded-full  hover:scale-105`}
              onClick={ToggleMicFunction}
              data-tooltip-id="start-call-screen-mic-icon-tooltip"
              data-tooltip-content={
                !ParticipantMicYouWantToMute.mic_status
                  ? "Turn Mic On"
                  : "Turn Mic Off"
              }
            >
              {ParticipantMicYouWantToMute.mic_status ? (
                <IoMdMic className="w-[24px] h-[24px] text-black transition duration-100 " />
              ) : (
                <IoMdMicOff className="w-[24px] h-[24px] text-white transition duration-100 " />
              )}
            </button>
          ) : (
            <button
              className={`w-[45px] h-[45px] ${
                !MicOn ? "bg-pink-700" : "bg-white"
              } transition flex items-center justify-center rounded-full  hover:scale-105`}
              onClick={ToggleMicFunction}
              data-tooltip-id="start-call-screen-mic-icon-tooltip"
              data-tooltip-content={!MicOn ? "Turn Mic On" : "Turn Mic Off"}
            >
              {MicOn ? (
                <IoMdMic className="w-[24px] h-[24px] text-black transition duration-100 " />
              ) : (
                <IoMdMicOff className="w-[24px] h-[24px] text-white transition duration-100 " />
              )}
            </button>
          )}
          {ParticipantMicYouWantToMute.participant_id === UserInformation.id ? (
            <button
              className={`w-[45px] h-[45px] ${
                !ParticipantWebcamYouWantToDisable.webcam_status
                  ? "bg-pink-700"
                  : "bg-white"
              } transition flex items-center justify-center rounded-full  hover:scale-105 disabled:cursor-not-allowed disabled:opacity-80`}
              onClick={ToggleVideoFunction}
              data-tooltip-id="start-call-screen-video-icon-tooltip"
              data-tooltip-content={
                Call_Type === "AUDIO"
                  ? "Video Is Not Allowed In Audio Call"
                  : !ParticipantWebcamYouWantToDisable.webcam_status
                  ? "Turn Video On"
                  : "Turn Video Off"
              }
              disabled={Call_Type === "AUDIO" ? true : false}
            >
              {ParticipantWebcamYouWantToDisable.webcam_status ? (
                <IoMdVideocam className="w-[24px] h-[24px] text-black transition duration-100 " />
              ) : (
                <IoVideocamOff className="w-[24px] h-[24px] text-white transition duration-100 " />
              )}
            </button>
          ) : (
            <button
              className={`w-[45px] h-[45px] ${
                !VideoOn ? "bg-pink-700" : "bg-white"
              } transition flex items-center justify-center rounded-full  hover:scale-105 disabled:cursor-not-allowed disabled:opacity-80`}
              onClick={ToggleVideoFunction}
              data-tooltip-id="start-call-screen-video-icon-tooltip"
              data-tooltip-content={
                Call_Type === "AUDIO"
                  ? "Video Is Not Allowed In Audio Call"
                  : !VideoOn
                  ? "Turn Video On"
                  : "Turn Video Off"
              }
              disabled={Call_Type === "AUDIO" ? true : false}
            >
              {VideoOn ? (
                <IoMdVideocam className="w-[24px] h-[24px] text-black transition duration-100 " />
              ) : (
                <IoVideocamOff className="w-[24px] h-[24px] text-white transition duration-100 " />
              )}
            </button>
          )}

          {ANew_VideoMeeting_HasBeenStarted.Meeting_Initiator_Info.id ===
            UserInformation.id ||
          ANew_AudioMeeting_HasBeenStarted.Meeting_Initiator_Info.id ===
            UserInformation.id ? (
            <button
              className={`w-[45px] h-[45px] ${
                StartCall ? "bg-pink-700" : "bg-green-600"
              } transition flex flex-col items-center justify-center rounded-full  hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              data-tooltip-id="start-call-screen-call-icon-tooltip"
              data-tooltip-content={
                !StartCall ? "Start Video Call" : "End Video Call"
              }
              onClick={EndTheVideoCall}
            >
              {!StartCall ? (
                <MdCall className="w-[28px] h-[28px] text-white transition duration-100 " />
              ) : (
                <MdCallEnd className="w-[28px] h-[28px] text-white transition duration-100 " />
              )}
            </button>
          ) : (
            <button
              className={`w-[45px] h-[45px] ${
                StartCall ? "bg-pink-700" : "bg-green-600"
              } transition flex flex-col items-center justify-center rounded-full  hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              data-tooltip-id="End-TheCallButton"
              data-tooltip-content={
                !StartCall ? "Start Video Call" : "Leave Video Call"
              }
              onClick={LeaveTheVideoCall}
            >
              {!StartCall ? (
                <MdCall className="w-[28px] h-[28px] text-white transition duration-100 " />
              ) : (
                <MdCallEnd className="w-[28px] h-[28px] text-white transition duration-100 " />
              )}
            </button>
          )}
        </div>
        <div className="more-action_button">
          <div className="flex items-center justify-center gap-[10px]">
            <div className="test-your-speaker">
              <TestYourSpakerComponent />
            </div>
            <div className="mute-all-the-participant">
              <button
                className="w-[45px] h-[45px] bg-orange-600 transition flex items-center justify-center rounded-full  hover:scale-105 "
                data-tooltip-id="mute-all-the-people-in-running-meeting"
                data-tooltip-content="Mute All The Participant"
              >
                <BsMicMuteFill className="w-[24px] h-[24px] text-white transition duration-100 " />
              </button>
              <ReactTooltip
                id="mute-all-the-people-in-running-meeting"
                place="top"
                style={{ backgroundColor: "white", color: "black", opacity: "1" }} opacity={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingController;

"use client";
import { getAudioMediaTrack, getVideoMediaTrack } from "@/helper/MediaTracks";
import React, { createContext, ReactNode, useRef, useState } from "react";

interface ContextApiProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  MeetingID: string;
  setMeetingID: React.Dispatch<React.SetStateAction<string>>;

  Video_Stream: any;
  setVideo_Stream: React.Dispatch<React.SetStateAction<any>>;
  Audio_Stream: any;
  setAudio_Stream: React.Dispatch<React.SetStateAction<any>>;
  Loader: boolean;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  ShowSelectMicModal: boolean;
  setShowSelectMicModal: React.Dispatch<React.SetStateAction<boolean>>;
  ShowSelectCamModal: boolean;
  setShowSelectCamModal: React.Dispatch<React.SetStateAction<boolean>>;
  MicOn: boolean;
  setMicOn: React.Dispatch<React.SetStateAction<boolean>>;
  VideoOn: boolean;
  setVideoOn: React.Dispatch<React.SetStateAction<boolean>>;
  StartCall: boolean;
  setStartCall: React.Dispatch<React.SetStateAction<boolean>>;

  SelectedCamera: {
    label: string;
    deviceId: string;
    groupId: string;
    kind: string;
  };
  SelectedMicrophone: {
    label: string;
    deviceId: string;
    groupId: string;
    kind: string;
  };
  setSelectedCamera: React.Dispatch<
    React.SetStateAction<{
      label: string;
      deviceId: string;
      groupId: string;
      kind: string;
    }>
  >;
  setSelectedMicrophone: React.Dispatch<
    React.SetStateAction<{
      label: string;
      deviceId: string;
      groupId: string;
      kind: string;
    }>
  >;
  Current_Webcam_Info: {
    label: string;
    deviceId: string;
    groupId: string;
    kind: string;
  };
  setCurrent_Webcam_Info: React.Dispatch<React.SetStateAction<object>>;
  Current_Audio_Mic_Info: {
    label: string;
    deviceId: string;
    groupId: string;
    kind: string;
  };
  setCurrent_Audio_Mic_Info: React.Dispatch<React.SetStateAction<object>>;
  ParticipantMicYouWantToMute: {
    participant_id: string;
    mic_status: boolean;
  };
  setParticipantMicYouWantToMute: React.Dispatch<
    React.SetStateAction<{
      participant_id: string;
      mic_status: boolean;
    }>
  >;
  ParticipantWebcamYouWantToDisable: {
    participant_id: string;
    webcam_status: boolean;
  };
  setParticipantWebcamYouWantToDisable: React.Dispatch<
    React.SetStateAction<{
      participant_id: string;
      webcam_status: boolean;
    }>
  >;
  Current_VideoCall_Participant_Info: object;
  setCurrent_VideoCall_Participant_Info: React.Dispatch<
    React.SetStateAction<object>
  >;
  Current_AudioCall_Participant_Info: object;
  setCurrent_AudioCall_Participant_Info: React.Dispatch<
    React.SetStateAction<object>
  >;
  onDeviceChanged: (devices, device_type?) => void;
}
const VideoAudioCallContext = createContext<ContextApiProps | undefined>(
  undefined
);

const VideoAudioCallContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [MeetingID, setMeetingID] = useState("" as string);

  const [Video_Stream, setVideo_Stream] = useState(null as any);
  const [Audio_Stream, setAudio_Stream] = useState(null as any);
  const [Loader, setLoader] = useState(false as boolean);

  const [ShowSelectMicModal, setShowSelectMicModal] = useState(
    false as boolean
  );
  const [ShowSelectCamModal, setShowSelectCamModal] = useState(
    false as boolean
  );

  const [SelectedCamera, setSelectedCamera] = useState({
    label: "" as string,
    deviceId: "" as string,
    groupId: "" as string,
    kind: "" as string,
  });
  const [SelectedMicrophone, setSelectedMicrophone] = useState({
    label: "" as string,
    deviceId: "" as string,
    groupId: "" as string,
    kind: "" as string,
  });
  const [MicOn, setMicOn] = useState(false as boolean);
  const [VideoOn, setVideoOn] = useState(true as boolean);
  const [StartCall, setStartCall] = useState(false as boolean);
  const [ParticipantMicYouWantToMute, setParticipantMicYouWantToMute] =
    useState({
      participant_id: "" as string,
      mic_status: false as boolean,
    });
  const [
    ParticipantWebcamYouWantToDisable,
    setParticipantWebcamYouWantToDisable,
  ] = useState({
    participant_id: "" as string,
    webcam_status: false as boolean,
  });

  const [
    Current_VideoCall_Participant_Info,
    setCurrent_VideoCall_Participant_Info,
  ] = useState({} as any);
  const [
    Current_AudioCall_Participant_Info,
    setCurrent_AudioCall_Participant_Info,
  ] = useState({} as any);

  const [Current_Webcam_Info, setCurrent_Webcam_Info] = useState({
    label: "" as string,
    deviceId: "" as string,
    groupId: "" as string,
    kind: "" as string,
  });
  const [Current_Audio_Mic_Info, setCurrent_Audio_Mic_Info] = useState({
    label: "" as string,
    deviceId: "" as string,
    groupId: "" as string,
    kind: "" as string,
  });
  const GetVideoTrackFunction = async (devicesId) => {
    setLoader(true);
    const Video_Track = await getVideoMediaTrack(devicesId);

    setVideo_Stream(Video_Track);

    setLoader(false);
  };
  const GetAudioTrackFunction = async (devicesId) => {
    const audio_track = await getAudioMediaTrack(devicesId);

    setAudio_Stream(audio_track);
    if (!audio_track) return;
    if (audioRef.current) {
      audioRef.current.srcObject = audio_track;
    }
  };
  const onDeviceChanged = (devices, device_type?) => {
    if (device_type === "CAM") {
      GetVideoTrackFunction(devices.deviceId);
      setShowSelectCamModal(false);
      setSelectedCamera({
        label: devices.label,
        deviceId: devices.deviceId,
        groupId: devices.groupId,
        kind: devices.kind,
      });
    } else if (device_type === "MIC") {
      GetAudioTrackFunction(devices.deviceId);
      setShowSelectMicModal(false);
      setSelectedMicrophone({
        label: devices.label,
        deviceId: devices.deviceId,
        groupId: devices.groupId,
        kind: devices.kind,
      });
    }
  };

  const context_value = {
    audioRef,
    MeetingID,
    setMeetingID,

    Video_Stream,
    setVideo_Stream,
    Audio_Stream,
    setAudio_Stream,
    Loader,
    setLoader,
    MicOn,
    setMicOn,
    VideoOn,
    setVideoOn,
    StartCall,
    setStartCall,
    ShowSelectMicModal,
    setShowSelectMicModal,
    ShowSelectCamModal,
    setShowSelectCamModal,
    SelectedCamera,
    SelectedMicrophone,
    setSelectedCamera,
    setSelectedMicrophone,
    GetVideoTrackFunction,
    GetAudioTrackFunction,
    ParticipantMicYouWantToMute,
    setParticipantMicYouWantToMute:
      setParticipantMicYouWantToMute as React.Dispatch<
        React.SetStateAction<object>
      >,
    ParticipantWebcamYouWantToDisable,
    setParticipantWebcamYouWantToDisable:
      setParticipantWebcamYouWantToDisable as React.Dispatch<
        React.SetStateAction<object>
      >,
    onDeviceChanged,
    Current_VideoCall_Participant_Info,
    setCurrent_VideoCall_Participant_Info:
      setCurrent_VideoCall_Participant_Info as React.Dispatch<
        React.SetStateAction<object>
      >,
    Current_AudioCall_Participant_Info,
    setCurrent_AudioCall_Participant_Info:
      setCurrent_AudioCall_Participant_Info as React.Dispatch<
        React.SetStateAction<object>
      >,
    Current_Audio_Mic_Info,
    setCurrent_Audio_Mic_Info: setCurrent_Audio_Mic_Info as React.Dispatch<
      React.SetStateAction<object>
    >,
    Current_Webcam_Info,
    setCurrent_Webcam_Info: setCurrent_Webcam_Info as React.Dispatch<
      React.SetStateAction<object>
    >,
  };
  return (
    <VideoAudioCallContext.Provider value={context_value}>
      {children}
    </VideoAudioCallContext.Provider>
  );
};
export { VideoAudioCallContext, VideoAudioCallContextProvider };

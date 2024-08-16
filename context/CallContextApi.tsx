"use client";
import { getAudioMediaTrack, getVideoMediaTrack } from "@/helper/MediaTracks";
import React, { createContext, ReactNode, useRef, useState } from "react";

interface ContextApiProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  MeetingID: string;
  setMeetingID: React.Dispatch<React.SetStateAction<string>>;
  A_New_Meeting_Started: boolean;
  setA_New_Meeting_Started: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [A_New_Meeting_Started, setA_New_Meeting_Started] = useState(
    false as boolean
  );

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
  const [VideoOn, setVideoOn] = useState(false as boolean);

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
    A_New_Meeting_Started,
    setA_New_Meeting_Started,
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
    onDeviceChanged,
  };
  return (
    <VideoAudioCallContext.Provider value={context_value}>
      {children}
    </VideoAudioCallContext.Provider>
  );
};
export { VideoAudioCallContext, VideoAudioCallContextProvider };

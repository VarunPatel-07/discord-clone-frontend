import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { MeetingProvider, useMediaDevice } from "@videosdk.live/react-sdk";
import { Permission } from "@videosdk.live/react-sdk/dist/types/permission";
import StartScreenController from "./Controller/StartScreenController";

import ReactPlayer from "react-player";

import { useDebounce } from "@/hooks/debounceHook";
import SpinnerComponent from "../Loader/SpinnerComponent";
import AvailableDeviceList from "./AvailableDeviceList";
import { GenerateCallToken } from "./GenerateToken";
import { Context } from "@/context/ContextApi";
import axios from "axios";
import UseSocketIO from "@/hooks/UseSocketIO";
import { VideoAudioCallContext } from "@/context/CallContextApi";
import { getCookie } from "cookies-next";

function StartCallScreen() {
  const {
    MeetingID,
    setMeetingID,

    Video_Stream,

    Audio_Stream,

    audioRef,
    GetVideoTrackFunction,
    GetAudioTrackFunction,
    Loader,
    onDeviceChanged,
    ShowSelectMicModal,
    setShowSelectMicModal,
    ShowSelectCamModal,
    setShowSelectCamModal,
    SelectedCamera,
    SelectedMicrophone,
    setSelectedCamera,
    setSelectedMicrophone,
    MicOn,
    setMicOn,
    VideoOn,
    setVideoOn,
    StartCall,
    setStartCall,
  } = useContext(VideoAudioCallContext) as any;

  const socket = UseSocketIO();

  const {
    UserInformation,
    ServerInfoById,
    UserInfoFetchingFunction,
    setA_New_Meeting_Started,
    A_New_Meeting_Started,
  } = useContext(Context) as any;

  const [Is_Mic_Permitted, setIs_Mic_Permitted] = useState(false as boolean);
  const [Is_Video_Permitted, setIs_Video_Permitted] = useState(
    false as boolean
  );
  const [AvailableCameras, setAvailableCameras] = useState([] as Array<Object>);
  const [AvailableMicrophones, setAvailableMicrophones] = useState(
    [] as Array<Object>
  );

  const [Token, setToken] = useState("" as string);
  const [CallingStarted, setCallingStarted] = useState(false as boolean);

  //
  //
  //

  //
  //
  //

  const { checkPermissions, requestPermission, getCameras, getMicrophones } =
    useMediaDevice({ onDeviceChanged });
  useEffect(() => {
    if (!UserInformation) {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      UserInfoFetchingFunction(AuthToken);
    }
  }, [UserInfoFetchingFunction, UserInformation]);
  useEffect(() => {
    (async () => {
      const token = await GenerateCallToken();
      setToken(token);
    })();
  }, []);
  useEffect(() => {
    const checkAndSetPermissions = async (
      type: Permission,
      setState: (perm: boolean) => void
    ) => {
      const permissionStatus = await checkPermissions(type);
      const isPermitted = permissionStatus.get(type);

      setState(!!isPermitted);

      if (!isPermitted) {
        try {
          const requestStatus = await requestPermission(type);
          const isRequestedPermitted = requestStatus.get(type);
          setState(!!isRequestedPermitted);
        } catch (error) {
          console.log(`Error requesting ${type} permission:`, error);
        }
      }
    };

    const fetchDevices = async () => {
      try {
       
        const Web_cams = await getCameras();
        const mics = await getMicrophones();

        if (Web_cams.length === 1) {
          Web_cams.forEach((cam) => {
            setSelectedCamera({
              label: cam.label,
              deviceId: cam.deviceId,
              groupId: cam.groupId,
              kind: cam.kind,
            });
          });
        } else {
          Web_cams.forEach((cam) => {
            if (cam.label.includes("(Built-in)")) {
              setSelectedCamera({
                label: cam.label,
                deviceId: cam.deviceId,
                groupId: cam.groupId,
                kind: cam.kind,
              });
            }
          });
        }

        mics.forEach((mic) => {
          if (mic.label.includes("(Built-in)")) {
            setSelectedMicrophone({
              label: mic.label,
              deviceId: mic.deviceId,
              groupId: mic.groupId,
              kind: mic.kind,
            });
          }
        });

        GetVideoTrackFunction(SelectedCamera.deviceId);
        GetAudioTrackFunction(SelectedMicrophone.deviceId);

        setAvailableCameras(Web_cams);
        setAvailableMicrophones(mics);
      } catch (error) {
        console.log("Error fetching devices in Safari:", error);
      }
    };

    (async () => {
      await checkAndSetPermissions("audio" as any, setIs_Mic_Permitted);
      await checkAndSetPermissions("video" as any, setIs_Video_Permitted);

      if (Is_Mic_Permitted || Is_Video_Permitted) {
        await fetchDevices();
      }
    })();
  }, [Is_Mic_Permitted, Is_Video_Permitted]);

  const SendMeetingIdToTheMemberOfTheServer = useCallback(
    async (MeetingID) => {
      console.log("SendMeetingIdToTheMemberOfTheServer", MeetingID);
      const Data = {
        CallInitiatorInfo: UserInformation,
        RoomId: MeetingID,
        ServerInfo: ServerInfoById,
      };
      socket?.emit("SendMeetingIdToTheMemberOfTheServer", Data);
    },
    [MeetingID, UserInformation, socket, ServerInfoById]
  );

  const StartTheCall_UsingDebounce = useDebounce(async (token: string) => {
    const VIDEO_SDK_API_ENDPOINT =
      process.env.NEXT_PUBLIC_VIDEOSDK_API_ENDPOINT;
    const response = await axios({
      method: "post",
      url: VIDEO_SDK_API_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.data) return;
    SendMeetingIdToTheMemberOfTheServer(response.data.roomId);
    setMeetingID(response.data.roomId);
    setA_New_Meeting_Started({
      Call_Started: true,
      Meeting_Initiator_Info: UserInformation
        ? UserInformation
        : JSON.parse(getCookie("User__Info") as string),
      Server_Info: ServerInfoById,
      MeetingId: response.data.roomId,
    });
    setCallingStarted(false);
    setStartCall(true);
  }, 500);
  const StartVideoCallProcessOnClick = async () => {
    setCallingStarted(true);
    StartTheCall_UsingDebounce(Token);
  };

  if (Token === "") return;
  return (
    <MeetingProvider
      config={{
        customCameraVideoTrack: Video_Stream,
        customMicrophoneAudioTrack: Audio_Stream,
        debugMode: true,
        micEnabled: MicOn,
        webcamEnabled: VideoOn,
        participantId: "",
        meetingId: "",
        name: "",
      }}
      token={Token}
    >
      <div className="w-[100%] h-[100%] flex flex-col items-center justify-center transition-opacity py-[50px]">
        <div className="w-[100%] h-[100%] flex flex-col items-center justify-center gap-[20px]">
          <div className="users-screen-wrapper w-[100%] h-[100%] max-w-[600px] max-h-[400px] flex flex-col items-center justify-center bg-black rounded-[10px] relative overflow-hidden">
            <p className="text-white bg-[rgba(0,0,0,0.08)] backdrop-blur-[10px] capitalize global-font-roboto text-[13px] absolute bottom-[10px] left-[10px] border-[1px] border-white px-[10px] py-[1px] rounded-full z-[1]">
              <span>{UserInformation.UserName}</span>
            </p>
            <audio ref={audioRef} autoPlay muted={!MicOn} />
            {Loader ? (
              <div className="flex">
                <SpinnerComponent />
              </div>
            ) : (
              <>
                {!VideoOn ? (
                  <p className="text-white capitalize global-font-roboto text-[15px]">
                    Video is Off
                  </p>
                ) : (
                  <div className="w-[100%] h-[100%] scale-[1.2]">
                    <ReactPlayer
                      url={Video_Stream}
                      playsinline // extremely crucial prop
                      pip={false}
                      light={false}
                      controls={false}
                      muted={true}
                      playing={true}
                      height={"100%"}
                      width={"100%"}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="w-[100%] max-w-[600px]">
            <AvailableDeviceList
              AvailableCameras={AvailableCameras}
              AvailableMicrophones={AvailableMicrophones}
              SelectedCamera={SelectedCamera}
              SelectedMicrophone={SelectedMicrophone}
              ShowSelectCamModal={ShowSelectCamModal}
              setShowSelectCamModal={setShowSelectCamModal}
              ShowSelectMicModal={ShowSelectMicModal}
              setShowSelectMicModal={setShowSelectMicModal}
              onDeviceChanged={onDeviceChanged}
            />
          </div>
        </div>
        <StartScreenController
          MicOn={MicOn}
          setMicOn={setMicOn}
          VideoOn={VideoOn}
          setVideoOn={setVideoOn}
          StartCall={StartCall}
          setStartCall={setStartCall}
          StartVideoCallProcessOnClick={StartVideoCallProcessOnClick}
          CallingStarted={CallingStarted}
        />
      </div>
    </MeetingProvider>
  );
}

export default StartCallScreen;

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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function StartCallScreen({ Call_Type }: { Call_Type: string }) {
  const {
    MeetingID,
    setMeetingID,
    Video_Stream,
    Audio_Stream,
    audioRef,
    videoRef,
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
    setANew_VideoMeeting_HasBeenStarted,
    CurrentChatChannelInfo,
    setANew_AudioMeeting_HasBeenStarted,
    ANew_VideoMeeting_HasBeenStarted,
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

  // getting the UserInformation OF The User
  useEffect(() => {
    if (!UserInformation) {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      UserInfoFetchingFunction(AuthToken);
    }
  }, [UserInfoFetchingFunction, UserInformation]);
  // Generating The Token For The Video Call
  useEffect(() => {
    (async () => {
      setVideoOn(Call_Type === "AUDIO" ? false : true);
      const token = await GenerateCallToken();
      setToken(token);
    })();
  }, []);
  // Checking the Permissions For The Video And Audio Call For The Browser And Asking For The Permissions To The User And After The Permission is Granted Then We will Render The All The Available Devices

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
  useEffect(() => {
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

  // Now All The Things IS Completed Then After User Has Been Clicked The  Start Call We Will Do Three Thing First Thing We will get the meeting id  ,  second Thing Is To Set The Local State "ANew_VideoMeeting_HasBeenStarted" and After the Meeting ID Has been Generated  Local State Has Been Set Then We Will Use Socket.io To Send The Meeting Info Like {CallInitiatorInfo,RoomId,ServerInfo,ChannelInfo} To All The Person Of The Server
  const SendMeetingIdToTheMemberOfTheServer = useCallback(
    async (MeetingID) => {
      const Data = {
        CallInitiatorInfo: UserInformation,
        RoomId: MeetingID,
        ServerInfo: ServerInfoById,
        ChannelInfo: CurrentChatChannelInfo,
      };
      socket?.emit("SendMeetingIdToTheMemberOfTheServer", Data);
    },
    [MeetingID, UserInformation, socket, ServerInfoById]
  );

  const StartTheCall_UsingDebounce = useDebounce(async (token: string) => {
    try {
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

      if (Call_Type === "AUDIO") {
        console.log("done 2");
        setANew_AudioMeeting_HasBeenStarted({
          Call_Started: true,
          Meeting_Initiator_Info: UserInformation
            ? UserInformation
            : JSON.parse(getCookie("User__Info") as string),
          Server_Info: ServerInfoById,
          MeetingId: response.data.roomId,
          ChannelInfo: CurrentChatChannelInfo,
        });
      } else {
        setANew_VideoMeeting_HasBeenStarted({
          Call_Started: true,
          Meeting_Initiator_Info: UserInformation
            ? UserInformation
            : JSON.parse(getCookie("User__Info") as string),
          Server_Info: ServerInfoById,
          MeetingId: response.data.roomId,
          ChannelInfo: CurrentChatChannelInfo,
        });
      }
      setCallingStarted(false);
      setStartCall(true);
    } catch (error) {
      console.log(error);
    }
  }, 500);
  const StartVideoCallProcessOnClick = async () => {
    console.log("Calling Started");
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
        webcamEnabled: Call_Type === "AUDIO" ? false : VideoOn,
        participantId: "",
        meetingId: "",
        name: "",
      }}
      token={Token}
    >
      <div className="w-[100%] h-[100%] flex flex-col items-center justify-center transition-opacity py-[50px]">
        <div className="w-[100%] h-[100%] flex flex-col items-center justify-center gap-[20px]">
          <div
            className="users-screen-wrapper w-[100%] h-[100%] max-w-[600px] max-h-[400px] flex flex-col items-center justify-center  rounded-[10px] relative overflow-hidden"
            style={{ backgroundColor: UserInformation?.ProfileBanner_Color }}
          >
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
                {Is_Video_Permitted ? (
                  <>
                    {!VideoOn ? (
                      <div className="w-[100%] h-[100%]">
                        <div className="w-[100%] h-[100%] flex items-center justify-center">
                          <Avatar
                            className="w-[120px] h-[120px] rounded-full overflow-hidden"
                            style={{
                              backgroundColor: UserInformation?.ProfileBgColor,
                            }}
                          >
                            <AvatarImage
                              className="w-[100%] h-[100%]"
                              src={UserInformation.Profile_Picture}
                            ></AvatarImage>
                            <AvatarFallback
                              className=" text-[40px] font-bold flex items-center justify-center"
                              style={{
                                color: UserInformation?.ProfileBanner_Color,
                              }}
                            >
                              {UserInformation?.FullName?.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ) : (
                      <div className="w-[100%] h-[100%] video-wrapper">
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
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-white text-[15px] font-medium text-center">
                    Allow Us To Access Your Camera To Start The Video Call
                    <span className="text-red-500 font-semibold inline-block">
                      Go To Your Browser Settings And Allow Us To Access Your
                      Camera
                    </span>
                  </p>
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
          Call_Type={Call_Type}
          Is_Mic_Permitted={Is_Mic_Permitted}
          Is_Video_Permitted={Is_Video_Permitted}
          CheckThePermissionAndRenderDevices={checkAndSetPermissions}
          setIs_Mic_Permitted={setIs_Mic_Permitted}
          setIs_Video_Permitted={setIs_Video_Permitted}
        />
      </div>
    </MeetingProvider>
  );
}

export default StartCallScreen;
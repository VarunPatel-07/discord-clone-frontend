import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import UseSocketIO from "@/hooks/UseSocketIO";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getCookie } from "cookies-next";
import { Edit } from "lucide-react";
import React, { useCallback, useContext, useEffect } from "react";
import { AiOutlineAudio } from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import { IoIosLock, IoMdVideocam } from "react-icons/io";
import { MdDelete } from "react-icons/md";

function ListOfAllTheServerChannel({
  setShowUpdateChannelInfoModal,
  setShowDeleteChannelModal,
  setChannelInfo,
  setChannalId,
  ServerInfoById,
}: {
  setShowUpdateChannelInfoModal: React.Dispatch<React.SetStateAction<boolean>>;

  setShowDeleteChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelInfo: React.Dispatch<React.SetStateAction<any>>;
  setChannalId: React.Dispatch<React.SetStateAction<any>>;
  ServerInfoById: any;
}) {
  const socket = UseSocketIO();
  const {
    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
    CurrentChatChannelInfo,
    setCurrentChatChannelInfo,
    CreateAnOneToOneConversation,
    UserInformation,
  } = useContext(Context) as any;

  useEffect(() => {
    AllTheTextChannelsOfTheServer?.map((channel_info) => {
      if (channel_info.type === "TEXT") {
        if (channel_info.name === "general") {
          setCurrentChatChannelInfo({
            ChatId: channel_info.id,
            ChatName: channel_info.name,
            ChatType: channel_info.type,
            ChatUserId: channel_info.userId,
          });
        }
      }
    });
  }, [AllTheTextChannelsOfTheServer, setCurrentChatChannelInfo]);

  const CreatingConversation_With_Debounce = useDebounce(
    async (AuthToken: String, receiver_id: String) => {
      await CreateAnOneToOneConversation(AuthToken, receiver_id);
      console.log("done");
    },
    350
  );

  const CreateNewConversation = (receiver_id: string) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    CreatingConversation_With_Debounce(AuthToken, receiver_id);
  };

  const StartCallFunctionWithDebounce = useDebounce(
    useCallback(async () => {
      const Room_Id = CurrentChatChannelInfo?.ChatId;
      const RoomName = CurrentChatChannelInfo?.ChatName;
      const Call_Type = CurrentChatChannelInfo?.ChatType;
      const Data = {
        RoomId: Room_Id,
        RoomName: RoomName,
        CallType: Call_Type,
        userInfo: UserInformation,
      };
      socket?.emit("StartTheCallAndJoinRoom", Data);
    }, [CurrentChatChannelInfo, UserInformation, socket]),
    300
  );
  const HandelVideoCallFunction = (channel_info) => {
    StartCallFunctionWithDebounce();
    setCurrentChatChannelInfo({
      ChatId: channel_info.id,
      ChatName: channel_info.name,
      ChatType: channel_info.type,
      ChatUserId: channel_info.userId,
    });
  };

  return (
    <div className="w-[100%] flex flex-col items-start justify-start gap-[10px]">
      {AllTheTextChannelsOfTheServer?.length > 0 && (
        <div className="text-channal w-[100%] px-[15px]">
          <div className="channal-header w-[100%]">
            <span className="global-font-roboto w-[100%] block fs-16 text-[#f4f3f3] capitalize font-medium ">
              text channel
            </span>
          </div>
          <ul className="flex flex-col items-start justify-start mt-[4px] gap-[1px]">
            {AllTheTextChannelsOfTheServer?.map((channel_info) => {
              return (
                <li
                  className={`w-[100%] cursor-pointer my-[2px] pl-[8px] pr-[5px] py-[5px] rounded flex items-center justify-between group ${
                    CurrentChatChannelInfo?.ChatId === channel_info.id
                      ? "bg-[rgba(255,255,255,0.18)]"
                      : "hover:bg-[rgba(255,255,255,0.08)]"
                  }`}
                  key={channel_info.id}
                  onClick={() => {
                    setCurrentChatChannelInfo({
                      ChatId: channel_info.id,
                      ChatName: channel_info.name,
                      ChatType: channel_info.type,
                      ChatUserId: channel_info.userId,
                    });
                  }}
                >
                  <span
                    className={`flex items-center gap-[5px] w-[70%]  ${
                      CurrentChatChannelInfo?.ChatId === channel_info.id
                        ? "text-[rgb(255,255,255,0.9)]"
                        : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                    }`}
                  >
                    <span className="w-[14px] h-[14px] ">
                      <FaHashtag className="w-[14px] h-[14px] " />
                    </span>
                    <span className="block capitalize fs-14 overflow-hidden whitespace-nowrap text-ellipsis global-font-roboto">
                      {channel_info.name}
                    </span>
                  </span>
                  {channel_info.name === "general" ? (
                    <span className="flex w-[30%] items-center justify-end  ">
                      <button
                        className={`w-[16px] h-[16px] ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgb(255,255,255,0.9)]"
                            : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                        }`}
                        title="locked"
                      >
                        <IoIosLock className="w-[16px] h-[16px]" />
                      </button>
                    </span>
                  ) : (
                    <span
                      className={`flex  items-center justify-center transition duration-[0.01s] ${
                        CurrentChatChannelInfo?.ChatId === channel_info.id
                          ? ""
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <button
                        className={`w-[16px] h-[16px] ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgb(255,255,255,0.9)]"
                            : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                        }`}
                        onClick={(e) => {
                          setShowUpdateChannelInfoModal(true);
                          setChannelInfo({
                            name: channel_info.name,
                            type: channel_info.type,
                            id: channel_info.id,
                          });
                        }}
                      >
                        <Edit className="w-[16px] h-[16px]" />
                      </button>
                      <button
                        className={`w-[16px] h-[16px] ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgb(255,255,255,0.9)]"
                            : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                        }`}
                        onClick={(e) => {
                          setShowDeleteChannelModal(true);
                          setChannalId(channel_info.id);
                        }}
                      >
                        <MdDelete className="w-[16px] h-[16px]" />
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {AllTheAudioChannelsOfTheServer?.length > 0 && (
        <>
          <span className="w-[100%] px-[5px]">
            <span className="w-[100%] h-[1px] bg-[rgba(230,230,230,0.2)] block rounded"></span>
          </span>

          <div className="audio-channal w-[100%] px-[15px]">
            <div className="channal-header w-[100%]">
              <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
                audio channel
              </span>
            </div>
            <ul className="flex flex-col items-start justify-start mt-[2px] gap-[1px]">
              {AllTheAudioChannelsOfTheServer?.map((channel_info) => {
                return (
                  <li
                    className={`w-[100%] cursor-pointer my-[4px] pl-[8px] pr-[5px] py-[5px] rounded flex items-center justify-between group ${
                      CurrentChatChannelInfo?.ChatId === channel_info.id
                        ? "bg-[rgba(255,255,255,0.18)]"
                        : "hover:bg-[rgba(255,255,255,0.08)]"
                    }`}
                    key={channel_info.id}
                    onClick={() => {
                      setCurrentChatChannelInfo({
                        ChatId: channel_info.id,
                        ChatName: channel_info.name,
                        ChatType: channel_info.type,
                        ChatUserId: channel_info.userId,
                      });
                    }}
                  >
                    <span
                      className={`flex items-center gap-[5px] w-[70%]  ${
                        CurrentChatChannelInfo?.ChatId === channel_info.id
                          ? "text-[rgb(255,255,255,0.9)]"
                          : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                      }`}
                    >
                      <span className="w-[16px] h-[16px] block">
                        <AiOutlineAudio className="w-[16px] h-[16px]" />
                      </span>

                      <span className="block capitalize fs-14 overflow-hidden whitespace-nowrap text-ellipsis global-font-roboto">
                        {channel_info.name}
                      </span>
                    </span>
                    <span
                      className={`flex  items-center justify-center transition duration-[0.01s] ${
                        CurrentChatChannelInfo?.ChatId === channel_info.id
                          ? ""
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <button
                        className={`w-[16px] h-[16px] ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgb(255,255,255,0.9)]"
                            : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                        }`}
                        onClick={(e) => {
                          setShowUpdateChannelInfoModal(true);
                          setChannelInfo({
                            name: channel_info.name,
                            type: channel_info.type,
                            id: channel_info.id,
                          });
                        }}
                      >
                        <Edit className="w-[16px] h-[16px]" />
                      </button>
                      <button
                        className={`w-[16px] h-[16px] ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgb(255,255,255,0.9)]"
                            : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                        }`}
                        onClick={(e) => {
                          setShowDeleteChannelModal(true);
                          setChannalId(channel_info.id);
                        }}
                      >
                        <MdDelete className="w-[16px] h-[16px]" />
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      {AllTheVideoChannelsOfTheServer?.length > 0 && (
        <>
          <span className="w-[100%] px-[5px]">
            <span className="w-[100%] h-[1px] bg-[rgba(230,230,230,0.2)] block rounded"></span>
          </span>
          <div className="video-channal w-[100%] px-[15px]">
            <div className="channal-header w-[100%]">
              <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
                video channel
              </span>
            </div>
            <ul className="flex flex-col items-start justify-start mt-[4px] gap-[1px]">
              {AllTheVideoChannelsOfTheServer?.map((channel_info) => {
                return (
                  <li
                    className={`w-[100%] cursor-pointer my-[2px] pl-[8px] pr-[5px] py-[5px] rounded flex items-center justify-between group ${
                      CurrentChatChannelInfo?.ChatId === channel_info.id
                        ? "bg-[rgba(255,255,255,0.18)]"
                        : "hover:bg-[rgba(255,255,255,0.08)]"
                    }`}
                    key={channel_info.id}
                    onClick={() => HandelVideoCallFunction(channel_info)}
                  >
                    <span
                      className={`flex items-center gap-[5px] w-[70%]  ${
                        CurrentChatChannelInfo?.ChatId === channel_info.id
                          ? "text-[rgb(255,255,255,0.9)]"
                          : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                      }`}
                    >
                      <span className="w-[16px] h-[16px] block">
                        <IoMdVideocam className="w-[16px] h-[16px]" />
                      </span>

                      <span className="block capitalize fs-14 overflow-hidden whitespace-nowrap text-ellipsis global-font-roboto">
                        {channel_info.name}
                      </span>
                    </span>
                    <span
                      className={`flex  items-center justify-center transition duration-[0.01s] ${
                        CurrentChatChannelInfo?.ChatId === channel_info.id
                          ? ""
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <button
                        className={`w-[16px] h-[16px] ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgb(255,255,255,0.9)]"
                            : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                        }`}
                        onClick={(e) => {
                          setShowUpdateChannelInfoModal(true);
                          setChannelInfo({
                            name: channel_info.name,
                            type: channel_info.type,
                            id: channel_info.id,
                          });
                        }}
                      >
                        <Edit className="w-[16px] h-[16px]" />
                      </button>
                      <button
                        className={`w-[16px] h-[16px] ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgb(255,255,255,0.9)]"
                            : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                        }`}
                        onClick={(e) => {
                          setShowDeleteChannelModal(true);
                          setChannalId(channel_info.id);
                        }}
                      >
                        <MdDelete className="w-[16px] h-[16px]" />
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      <span className="w-[100%] px-[5px]">
        <span className="w-[100%] h-[1px] bg-[rgba(230,230,230,0.2)] block rounded"></span>
      </span>
      <div className="w-[100%] ">
        {ServerInfoById?.members ? (
          <div className="channal-header w-[100%] px-[15px] ">
            <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
              members
            </span>
          </div>
        ) : (
          ""
        )}

        <div className="w-[100%] px-[15px] flex flex-col gap-[5px]">
          {ServerInfoById?.members?.map((MemberInfo: any) => (
            <div
              className="user-avatar-wrapper-main w-100 transition hover:bg-[rgba(255,255,255,0.15)]  py-[5px] px-[15px] rounded-[5px] cursor-pointer  hover:text-white"
              key={MemberInfo.userId}
              onClick={() => CreateNewConversation(MemberInfo.userId)}
            >
              <div className="w-100 flex items-center justify-between">
                <div className="left-part">
                  <div className="avatar flex items-center justify-center gap-[10px] ">
                    <div className="profile-image">
                      <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
                        <Avatar className="w-[35px] h-[35px] rounded-full">
                          <AvatarImage
                            src={MemberInfo?.user?.Profile_Picture}
                          />
                          <AvatarFallback className="global-font-roboto uppercase text-[18px] w-[35px] h-[35px]  font-semibold bg-slate-500 text-white flex items-center justify-center">
                            {MemberInfo?.user?.FullName.split("")[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <div className="members-information flex flex-col items-start justify-start gap-[2px]">
                      <p className="global-font-roboto capitalize h-[20px] fs-16 font-medium text-white ">
                        {MemberInfo?.user?.id === UserInformation?.id
                          ? "You"
                          : MemberInfo?.user?.UserName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListOfAllTheServerChannel;

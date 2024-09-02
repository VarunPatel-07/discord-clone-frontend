import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import UseSocketIO from "@/hooks/UseSocketIO";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getCookie } from "cookies-next";
import { Edit } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineAudio } from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import { IoIosLock, IoMdVideocam } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { ScrollArea } from "./ui/scroll-area";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import SpinnerComponent from "./Loader/SpinnerComponent";
import Link from "next/link";

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
  const { push } = useRouter();
  const {
    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
    CurrentChatChannelInfo,
    setCurrentChatChannelInfo,
    CreateAnOneToOneConversation,
    UserInformation,
    AnIncoming_VideoCall_Occurred,
  } = useContext(Context) as any;
  const [Loader, setLoader] = useState(false);

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
      // setLoader(false);
      push(`/pages/dashboard`);
    },
    350
  );

  const CreateNewConversation = (receiver_id: string) => {
    setLoader(true);
    const AuthToken = getCookie("User_Authentication_Token") as string;
    CreatingConversation_With_Debounce(AuthToken, receiver_id);
  };

  const HandelVideoCallFunction = (channel_info) => {
    setCurrentChatChannelInfo({
      ChatId: channel_info.id,
      ChatName: channel_info.name,
      ChatType: channel_info.type,
      ChatUserId: channel_info.userId,
    });
  };

  return (
    <div className="w-[100%]    flex flex-col items-start justify-start overflow-auto gap-[10px]">
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
                  className={`w-[100%]  my-[2px] pl-[8px] pr-[5px] py-[5px] rounded flex items-center justify-between group ${
                    CurrentChatChannelInfo?.ChatId === channel_info.id
                      ? "bg-gradient-to-r from-fuchsia-600 to-purple-600"
                      : "hover:bg-[rgba(255,255,255,0.18)]"
                  }`}
                  key={channel_info.id}
                >
                  <span
                    className={`flex items-center gap-[5px] w-[70%] cursor-pointer  ${
                      CurrentChatChannelInfo?.ChatId === channel_info.id
                        ? "text-[rgba(255,255,255,0.9)]"
                        : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                    }`}
                    onClick={() => {
                      setCurrentChatChannelInfo({
                        ChatId: channel_info.id,
                        ChatName: channel_info.name,
                        ChatType: channel_info.type,
                        ChatUserId: channel_info.userId,
                      });
                    }}
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
                        data-tooltip-id="general-channel-tooltip"
                        data-tooltip-content="Locked Channel"
                        className={`w-[16px] h-[16px] ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgba(255,255,255,0.9)]"
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
                        data-tooltip-id="edit-channel-tooltip"
                        data-tooltip-content="Edit Channel"
                        className={`w-[16px] h-[16px] cursor-pointer ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgba(255,255,255,0.9)]"
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
                        data-tooltip-id="delete-channel-tooltip"
                        data-tooltip-content="Delete Channel"
                        className={`w-[16px] h-[16px] cursor-pointer ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgba(255,255,255,0.9)]"
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
                    className={`w-[100%]  my-[4px] pl-[8px] pr-[5px] py-[5px] rounded flex items-center justify-between group ${
                      CurrentChatChannelInfo?.ChatId === channel_info.id
                        ? "bg-gradient-to-r from-fuchsia-600 to-purple-600"
                        : "hover:bg-[rgba(255,255,255,0.18)]"
                    }`}
                    key={channel_info.id}
                  >
                    <span
                      className={`flex items-center gap-[5px] w-[70%] cursor-pointer  ${
                        CurrentChatChannelInfo?.ChatId === channel_info.id
                          ? "text-[rgba(255,255,255,0.9)]"
                          : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                      }`}
                      onClick={() => {
                        setCurrentChatChannelInfo({
                          ChatId: channel_info.id,
                          ChatName: channel_info.name,
                          ChatType: channel_info.type,
                          ChatUserId: channel_info.userId,
                        });
                      }}
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
                        className={`w-[16px] h-[16px] cursor-pointer ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgba(255,255,255,0.9)]"
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
                        data-tooltip-id="edit-channel-tooltip"
                        data-tooltip-content="Edit Channel"
                      >
                        <Edit className="w-[16px] h-[16px]" />
                      </button>
                      <button
                        className={`w-[16px] h-[16px] cursor-pointer ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgba(255,255,255,0.9)]"
                            : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                        }`}
                        onClick={(e) => {
                          setShowDeleteChannelModal(true);
                          setChannalId(channel_info.id);
                        }}
                        data-tooltip-id="delete-channel-tooltip"
                        data-tooltip-content="Delete Channel"
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
                    className={`w-[100%] my-[2px] pl-[8px] pr-[5px] py-[5px] rounded flex items-center justify-between group ${
                      CurrentChatChannelInfo?.ChatId === channel_info.id
                        ? "bg-gradient-to-r from-fuchsia-600 to-purple-600"
                        : AnIncoming_VideoCall_Occurred.An_Incoming_Call
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-900"
                        : "hover:bg-[rgba(255,255,255,0.18)]"
                    }`}
                    key={channel_info.id}
                  >
                    <span
                      className={`flex items-center gap-[5px] w-[70%] cursor-pointer ${
                        CurrentChatChannelInfo?.ChatId === channel_info.id
                          ? "text-[rgba(255,255,255,0.9)]"
                          : AnIncoming_VideoCall_Occurred.An_Incoming_Call
                          ? "text-[rgba(255,255,255,0.9)]"
                          : "text-[rgb(255,255,255,0.6)] group-hover:text-[rgb(255,255,255,0.9)]"
                      }`}
                      onClick={() => HandelVideoCallFunction(channel_info)}
                    >
                      <span className="w-[16px] h-[16px] block">
                        <IoMdVideocam className="w-[16px] h-[16px]" />
                      </span>

                      <span className="block capitalize fs-14 overflow-hidden whitespace-nowrap text-ellipsis global-font-roboto">
                        {AnIncoming_VideoCall_Occurred.An_Incoming_Call
                          ? "An Incoming Call"
                          : channel_info.name}
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
                        data-tooltip-id="edit-channel-tooltip"
                        data-tooltip-content="Edit Channel"
                        className={`w-[16px] h-[16px] cursor-pointer ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgba(255,255,255,0.9)]"
                            : AnIncoming_VideoCall_Occurred.An_Incoming_Call
                            ? "text-[rgba(255,255,255,0.9)]"
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
                        data-tooltip-id="delete-channel-tooltip"
                        data-tooltip-content="Delete Channel"
                        className={`w-[16px] h-[16px] cursor-pointer ${
                          CurrentChatChannelInfo?.ChatId === channel_info.id
                            ? "text-[rgba(255,255,255,0.9)]"
                            : AnIncoming_VideoCall_Occurred.An_Incoming_Call
                            ? "text-[rgba(255,255,255,0.9)]"
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

        <div className="w-[100%] px-[8px] flex flex-col gap-[5px] pt-[10px]">
          {ServerInfoById?.members?.map((MemberInfo: any) => (
            <div
              className="user-avatar-wrapper-main w-100 transition hover:bg-[rgba(255,255,255,0.15)]  py-[5px] px-[10px] rounded-[5px] cursor-pointer  hover:text-white"
              key={MemberInfo.userId}
            >
              <div className="w-100 flex items-center justify-between">
                <div className="w-[100%] flex items-stretch justify-between">
                  <div className="w-[100%] flex items-center justify-start gap-[10px] ">
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
                  {MemberInfo?.user?.id !== UserInformation?.id && (
                    <div className="action-button flex flex-col items-center justify-center">
                      <Popover>
                        <PopoverTrigger>
                          <span className=" block w-[16px] h-[16px] text-white">
                            <BsThreeDotsVertical />
                          </span>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit p-[5px]">
                          <ul className="w-[100%] flex flex-col items-center justify-center">
                            <li className="w-[100%]">
                              <button
                                className="bg-white text-black px-[10px] py-[5px] hover:bg-black hover:text-white rounded global-font-roboto text-[13px] w-[100%]"
                                onClick={() =>
                                  CreateNewConversation(MemberInfo?.user?.id)
                                }
                              >
                                {Loader ? (
                                  <SpinnerComponent />
                                ) : (
                                  "Message Privately"
                                )}
                              </button>
                            </li>
                            <li className="w-[100%]">
                              <Link
                                href={`/pages/editProfile/${MemberInfo?.user?.UserName}`}
                                className="block bg-white text-black px-[10px] py-[5px] hover:bg-black hover:text-white rounded global-font-roboto text-[13px] w-[100%]"
                              >
                                View Profile
                              </Link>
                            </li>
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
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

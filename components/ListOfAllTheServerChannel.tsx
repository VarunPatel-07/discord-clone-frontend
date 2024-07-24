import { Context } from "@/context/ContextApi";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Edit } from "lucide-react";
import React, { useContext } from "react";
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
  const {
    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
  } = useContext(Context) as any;
  return (
    <div className="w-[100%] flex flex-col items-start justify-start gap-[8px]">
      {AllTheTextChannelsOfTheServer?.length > 0 && (
        <div className="text-channal w-[100%] px-[15px]">
          <div className="channal-header w-[100%]">
            <span className="global-font-roboto w-[100%] block fs-16 text-[#e6e6e6] capitalize font-medium ">
              text channel
            </span>
          </div>
          <ul className="flex flex-col items-start justify-start gap-[1px]">
            {AllTheTextChannelsOfTheServer?.map((channel_info) => {
              return (
                <li
                  className="w-[100%] cursor-pointer   hover:bg-[rgba(255,255,255,0.15)] pl-[12px] pr-[5px] py-[8px] rounded flex items-center justify-between group"
                  key={channel_info.id}
                >
                  <span className="flex items-center gap-[5px] w-[70%] text-[#f2f2f2]">
                    <span className="w-[16px] h-[16px] ">
                      <FaHashtag className="w-[16px] h-[16px] " />
                    </span>
                    <span className="block capitalize  overflow-hidden whitespace-nowrap text-ellipsis">
                      {channel_info.name}
                    </span>
                  </span>
                  {channel_info.name === "general" ? (
                    <span className="flex w-[30%] items-center justify-end  ">
                      <button
                        className="text-[#f2f2f2] w-[20px] h-[20px]"
                        title="locked"
                      >
                        <IoIosLock className="w-[20px] h-[20px]" />
                      </button>
                    </span>
                  ) : (
                    <span className="flex  items-center justify-center transition duration-[0.01s] opacity-0 group-hover:opacity-100">
                      <button
                        className="text-[#f2f2f2] w-[20px] h-[20px]"
                        onClick={(e) => {
                          setShowUpdateChannelInfoModal(true);
                          setChannelInfo({
                            name: channel_info.name,
                            type: channel_info.type,
                            id: channel_info.id,
                          });
                        }}
                      >
                        <Edit className="w-[20px] h-[20px]" />
                      </button>
                      <button
                        className="text-[#f2f2f2] w-[20px] h-[20px]"
                        onClick={(e) => {
                          setShowDeleteChannelModal(true);
                          setChannalId(channel_info.id);
                        }}
                      >
                        <MdDelete className="w-[20px] h-[20px]" />
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
            <span className="w-[100%] h-[1px] bg-[rgba(230,230,230,0.4)] block rounded"></span>
          </span>

          <div className="audio-channal w-[100%] px-[15px]">
            <div className="channal-header w-[100%]">
              <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
                audio channel
              </span>
            </div>
            <ul className="flex flex-col items-start justify-start gap-[1px]">
              {AllTheAudioChannelsOfTheServer?.map((channel_info) => {
                return (
                  <li
                    className="w-[100%] cursor-pointer   hover:bg-[rgba(255,255,255,0.15)] pl-[12px] pr-[5px] py-[8px] rounded flex items-center justify-between group"
                    key={channel_info.id}
                  >
                    <span className="flex items-center gap-[5px] w-[70%] text-[#f2f2f2]">
                      <span className="w-[20px] h-[20px] block">
                        <AiOutlineAudio className="w-[20px] h-[20px]" />
                      </span>

                      <span className="block capitalize  overflow-hidden whitespace-nowrap text-ellipsis">
                        {channel_info.name}
                      </span>
                    </span>
                    <span className="flex w-[30%]  items-center justify-end transition duration-[0.01s] opacity-0 group-hover:opacity-100">
                      <button
                        className="text-[#f2f2f2] w-[20px] h-[20px]"
                        onClick={(e) => {
                          setShowUpdateChannelInfoModal(true);
                          setChannelInfo({
                            name: channel_info.name,
                            type: channel_info.type,
                            id: channel_info.id,
                          });
                        }}
                      >
                        <Edit className="w-[20px] h-[20px]" />
                      </button>
                      <button
                        className="text-[#f2f2f2] w-[20px] h-[20px]"
                        onClick={(e) => {
                          setShowDeleteChannelModal(true);
                          setChannalId(channel_info.id);
                        }}
                      >
                        <MdDelete className="w-[20px] h-[20px]" />
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
            <span className="w-[100%] h-[1px] bg-[rgba(230,230,230,0.4)] block rounded"></span>
          </span>
          <div className="video-channal w-[100%] px-[15px]">
            <div className="channal-header w-[100%]">
              <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
                video channel
              </span>
            </div>
            <ul className="flex flex-col items-start justify-start gap-[1px]">
              {AllTheVideoChannelsOfTheServer?.map((channel_info) => {
                return (
                  <li
                    className="w-[100%] cursor-pointer   hover:bg-[rgba(255,255,255,0.15)] pl-[12px] pr-[5px] py-[8px] rounded flex items-center justify-between group"
                    key={channel_info.id}
                  >
                    <span className="flex items-center gap-[5px] w-[70%] text-[#f2f2f2]">
                      <span className="w-[18px] h-[18px] block">
                        <IoMdVideocam className="w-[18px] h-[18px]" />
                      </span>

                      <span className="block capitalize  overflow-hidden whitespace-nowrap text-ellipsis">
                        {channel_info.name}
                      </span>
                    </span>
                    <span className="flex w-[30%] items-center justify-end transition duration-[0.01s] opacity-0 group-hover:opacity-100">
                      <button
                        className="text-[#f2f2f2] w-[20px] h-[20px]"
                        onClick={(e) => {
                          setShowUpdateChannelInfoModal(true);
                          setChannelInfo({
                            name: channel_info.name,
                            type: channel_info.type,
                            id: channel_info.id,
                          });
                        }}
                      >
                        <Edit className="w-[20px] h-[20px]" />
                      </button>
                      <button
                        className="text-[#f2f2f2] w-[20px] h-[20px]"
                        onClick={(e) => {
                          setShowDeleteChannelModal(true);
                          setChannalId(channel_info.id);
                        }}
                      >
                        <MdDelete className="w-[20px] h-[20px]" />
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
        <span className="w-[100%] h-[1px] bg-[rgba(230,230,230,0.4)] block rounded"></span>
      </span>
      <div className="w-[100%] ">
        <div className="channal-header w-[100%] px-[15px] ">
          <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
            video channel
          </span>
        </div>
        <div className="w-[100%] px-[15px] flex flex-col gap-[5px]">
          {ServerInfoById?.members?.map((MemberInfo: any) => (
            <div
              className="user-avatar-wrapper-main w-100 transition hover:bg-[rgba(255,255,255,0.15)]  py-[5px] px-[15px] rounded-[5px] cursor-pointer  hover:text-white"
              key={MemberInfo.userId}
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
                        {MemberInfo?.user?.FullName}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="right-part flex items-center justify-center gap-[5px]">
                <div className="role-of-member ">
                  {MemberInfo?.role === "ADMIN" ? (
                    <p className="global-font-roboto uppercase text-[10px] font-medium rounded-[5px] bg-orange-200 px-[3px] py-[3px] text-center text-orange-900 ">
                      ADMIN
                    </p>
                  ) : (
                    ""
                  )}
                  {MemberInfo?.role === "MODERATOR" ? (
                    <p className="global-font-roboto uppercase text-[10px] font-medium rounded-[5px] bg-green-200 px-[3px] py-[3px] text-center text-green-900 ">
                      moderator
                    </p>
                  ) : (
                    ""
                  )}
                  {MemberInfo?.role === "GUEST" ? (
                    <p className="global-font-roboto uppercase text-[10px] font-medium rounded-[5px] bg-blue-200 px-[3px] py-[3px] text-center text-blue-900 ">
                      GUEST
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListOfAllTheServerChannel;

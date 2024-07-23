import { Context } from "@/context/ContextApi";
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
}: {
  setShowUpdateChannelInfoModal: React.Dispatch<React.SetStateAction<boolean>>;

  setShowDeleteChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelInfo: React.Dispatch<React.SetStateAction<any>>;
  setChannalId: React.Dispatch<React.SetStateAction<any>>;
}) {
  const {
    AllTheTextChannelsOfTheServer,
    AllTheAudioChannelsOfTheServer,
    AllTheVideoChannelsOfTheServer,
  } = useContext(Context) as any;
  return (
    <div className="w-[100%]">
      {AllTheTextChannelsOfTheServer.length >= 1 && (
        <div className="text-channal w-[100%] px-[15px]">
          <div className="channal-header w-[100%]">
            <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
              text channel
            </span>
          </div>
          <ul className="flex flex-col pt-[8px] ">
            {AllTheTextChannelsOfTheServer?.map((channel_info) => {
              return (
                <li
                  className="w-[100%] cursor-pointer   hover:bg-[rgba(255,255,255,0.15)] px-[8px] py-[8px] rounded flex items-center justify-between group"
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
      {AllTheAudioChannelsOfTheServer.length >= 1 && (
        <div className="audio-channal w-[100%] px-[15px]">
          <div className="channal-header w-[100%]">
            <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
              audio channel
            </span>
          </div>
          <ul className="flex flex-col pt-[8px]">
            {AllTheAudioChannelsOfTheServer?.map((channel_info) => {
              return (
                <li
                  className="w-[100%] cursor-pointer   hover:bg-[rgba(255,255,255,0.15)] px-[8px] py-[8px] rounded flex items-center justify-between group"
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
      )}
      {AllTheVideoChannelsOfTheServer.length >= 1 && (
        <div className="video-channal w-[100%] px-[15px]">
          <div className="channal-header w-[100%]">
            <span className="global-font-roboto fs-16 text-[#e6e6e6] capitalize font-medium">
              video channel
            </span>
          </div>
          <ul className="flex flex-col pt-[8px]">
            {AllTheVideoChannelsOfTheServer?.map((channel_info) => {
              return (
                <li
                  className="w-[100%] cursor-pointer   hover:bg-[rgba(255,255,255,0.15)] px-[8px] py-[8px] rounded flex items-center justify-between group"
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
      )}
    </div>
  );
}

export default ListOfAllTheServerChannel;

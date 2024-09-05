import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getCookie } from "cookies-next";
import { Divide, Edit } from "lucide-react";
import React, { useContext, useState } from "react";
import { FaCaretDown, FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CryptoJS from "crypto-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoCopy } from "react-icons/io5";
interface MessageProps {
  id: string;
  content: string;
  FileURL: string;
  IsEdited: boolean;
  IsDeleted: boolean;
  DeletedBy: string | null;
  Is_Reply: boolean;
  memberId: string;
  channelId: string;
  replyingMessage: string | null;
  replyingToUser_MemberId: string | null;
  replyingMessageMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  member: Member;
  channel: Channel;
  replyingToUser: Member;
}

interface Member {
  id: string;
  role: string;
  userId: string;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

interface User {
  id: string;
  FullName: string;
  Email: string;
  UserName: string;
  Password: string;
  Is_Online: boolean;
  Is_Email_Verified: boolean;
  Profile_Picture: string;
  createdAt: Date;
  updatedAt: Date;
  ProfileBanner_Img: string;
  ProfileBanner_Color: string;
  ProfileBgColor: string;
  TwoFactorAuth: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: string;
  userId: string;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
  server: Server;
}

interface Server {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  usersId: string;
  ServerBannerImg: string;
  ServerBannerColor: string;
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
}

function MessageProfile({
  Message_Data,
  DeleteMessage,
  MessageSendBySender,
  scrollingToTheMessage,
  setScrollingToTheMessage,
}: {
  Message_Data: MessageProps;
  DeleteMessage: (message_id: string) => void;
  MessageSendBySender: boolean;
  scrollingToTheMessage: string;
  setScrollingToTheMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

  const { UserInformation, setEditingAMessage, setReplyingASpecificMessage } =
    useContext(Context) as any;

  const GetLocalTimeFrom_UTC = (Time: Date) => {
    const date = new Date(Time);
    const localTime = date.toLocaleString();
    const __time = localTime.split(",")[1].split(":");
    const AM_PM = Number(__time[0]) >= 12 ? "PM" : "AM";

    return `${__time[0]}:${__time[1]} ${AM_PM}`;
  };

  const decryptContent = (encryptedContent) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
      const originalContent = bytes.toString(CryptoJS.enc.Utf8);
      return originalContent;
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  };

  const scrollToThe_Message_Being_Replied = (message_id: string) => {
    if (!message_id) {
      return;
    }

    const Message_Replying_To = document.getElementById(message_id);

    if (!Message_Replying_To) {
      return;
    }
    console.log(message_id);
    setScrollingToTheMessage(message_id);
    const isVisible =
      Message_Replying_To.getBoundingClientRect().top >= 0 &&
      Message_Replying_To.getBoundingClientRect().bottom <= window.innerHeight;
    console.log(isVisible);
    if (!isVisible) {
      Message_Replying_To.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      setScrollingToTheMessage("");
    }, 600);
  };

  return (
    <div className="w-[100%]">
      <div
        className={`w-fit flex items-start justify-between transition-all duration-150 max-w-[550px] cursor-pointer relative group overflow-hidden ${
          MessageSendBySender ? "ml-auto " : "ml-0"
        } `}
        id={Message_Data?.id}
      >
        <div className="w-[100%] relative flex items-end justify-start gap-[5px]">
          <div className="users-profile ">
            {!MessageSendBySender ? (
              <div className="profile">
                <Avatar
                  className="w-[25px] h-[25px]  rounded-full overflow-hidden flex items-center justify-center "
                  style={{
                    backgroundColor: Message_Data?.member?.user?.ProfileBgColor,
                  }}
                >
                  <AvatarImage
                    src={Message_Data?.member?.user?.Profile_Picture}
                    className="w-[100%] h-[100%]"
                  />
                  <AvatarFallback className="capitalize font-medium text-[15px] text-white">
                    {Message_Data?.member?.user?.FullName.split("")[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : null}
          </div>
          <div
            className={`message-container w-[100%] flex flex-col items-start  justify-start  rounded-md px-[5px]  pt-[5px] overflow-hidden transition-all duration-300  relative ${
              MessageSendBySender
                ? scrollingToTheMessage === Message_Data?.id
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-600"
                  : "bg-gradient-to-r from-emerald-700 to-emerald-800"
                : scrollingToTheMessage === Message_Data?.id
                ? "bg-gradient-to-r from-zinc-800 to-neutral-700"
                : "bg-gradient-to-r from-zinc-900 to-neutral-900"
            }`}
          >
            {/* this the div which is only visible when you are replying the message this contain the info of the message being replied */}

            <div className="content w-[100%] flex flex-col  relative ">
              <div className="w-[100%]  cursor-pointer  relative z-[1] min-w-[75px] ">
                {!MessageSendBySender ? (
                  <div className="head   flex items-center justify-start gap-[10px]">
                    <div className="username">
                      <p className="text-[#f48c25] global-font-roboto text-[14px] font-[400]">
                        {Message_Data?.member?.userId === UserInformation?.id
                          ? "You"
                          : Message_Data?.member?.user?.UserName}
                      </p>
                    </div>
                    <div className="time flex items-center gap-[5px]">
                      {Message_Data?.IsEdited && !Message_Data?.IsDeleted ? (
                        <p className="text-rose-400 text-[12px] global-font-roboto capitalize">
                          (edited)
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : null}
                {Message_Data?.Is_Reply ? (
                  <div
                    className={`w-[100%] rounded px-[8px] py-[5px] mt-[3px] relative overflow-hidden mb-[5px] ${
                      MessageSendBySender
                        ? "bg-gradient-to-r from-emerald-900 to-emerald-900"
                        : "bg-gradient-to-r from-zinc-800 to-neutral-800"
                    }`}
                    onClick={() => {
                      scrollToThe_Message_Being_Replied(
                        Message_Data?.replyingMessageMessageId as string
                      );
                    }}
                  >
                    <span className="absolute w-[6px] h-[110%] z-[2] top-[-10px] left-[0px] rounded bg-gradient-to-r from-red-500 to-orange-500 "></span>
                    <div className="inner-section pl-[6px]">
                      <div className="header">
                        <h5 className="username text-[#00ffe9] font-medium global-font-roboto text-[14px]">
                          {Message_Data?.replyingToUser?.user?.id ===
                          UserInformation?.id
                            ? "You"
                            : Message_Data?.replyingToUser?.user?.UserName}
                        </h5>
                      </div>
                      <div className="content text-gray-300 global-font-roboto text-[15px] font-[300] line-clamp-2">
                        <p>{decryptContent(Message_Data?.replyingMessage)}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-nowrap items-end justify-between relative">
                  <div className="message  flex items-center">
                    <p
                      className={`${
                        Message_Data?.IsDeleted
                          ? "text-gray-300 italic"
                          : "text-white"
                      } global-font-roboto text-[16px] font-[300]  text-wrap w-[100%] px-[4px] pb-[18px]`}
                    >
                      {Message_Data?.IsDeleted
                        ? Message_Data?.content
                        : decryptContent(Message_Data?.content)}
                    </p>
                  </div>
                  <p
                    className={`${
                      MessageSendBySender ? "text-gray-300" : "text-gray-400"
                    } text-[11px] global-font-roboto text-end absolute bottom-[3px] right-[5px] `}
                  >
                    {GetLocalTimeFrom_UTC(Message_Data?.createdAt as Date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="crude-operation  absolute top-[0px] right-[0px] invisible group-hover:visible z-[5] ">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`w-[25px] h-[25px] flex items-center justify-center ring-0 border-0 outline-none focus:outline-none focus:ring-0  `}
                >
                  <FaCaretDown className="text-white text-[18px] " />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={MessageSendBySender ? "end" : "start"}
                >
                  {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                  <DropdownMenuItem
                    className=" text-[rgb(255,255,255,0.9)]"
                    onClick={() => {
                      setReplyingASpecificMessage({
                        is_Replying: true,
                        data: Message_Data,
                      });
                    }}
                  >
                    <span className="flex items-center gap-[5px]">
                      <FaReply className="w-[18px] h-[18px]" />
                      <span className="">Reply Message</span>
                    </span>
                  </DropdownMenuItem>
                  {!Message_Data?.IsDeleted ? (
                    <DropdownMenuItem className=" text-[rgb(255,255,255,0.9)]">
                      <span className="flex items-center gap-[5px]">
                        <IoCopy className="w-[18px] h-[18px]" />
                        <span className="">Copy Message</span>
                      </span>
                    </DropdownMenuItem>
                  ) : null}
                  {Message_Data?.member?.userId === UserInformation?.id &&
                  !Message_Data?.IsDeleted ? (
                    <>
                      <DropdownMenuItem
                        className=" text-[rgb(255,255,255,0.9)]"
                        onClick={() => {
                          setEditingAMessage({
                            is_Editing: true,
                            data: Message_Data,
                          });
                        }}
                      >
                        <span className="flex items-center gap-[5px]">
                          <Edit className="w-[18px] h-[18px]" />
                          <span className="">Edit Message</span>
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[rgb(255,255,255,0.9)]  "
                        onClick={() => DeleteMessage(Message_Data?.id)}
                      >
                        <span className="flex items-center gap-[5px]">
                          <MdDelete className="w-[18px] h-[18px]" />
                          <span className="">Delete Message</span>
                        </span>
                      </DropdownMenuItem>
                    </>
                  ) : Message_Data?.channel?.userId === UserInformation?.id &&
                    !Message_Data?.IsDeleted ? (
                    <DropdownMenuItem
                      className="text-[rgb(255,255,255,0.9)] "
                      onClick={() => DeleteMessage(Message_Data?.id)}
                    >
                      <span className="flex items-center gap-[5px]">
                        <MdDelete className="w-[18px] h-[18px]" />
                        <span className="">Delete Message</span>
                      </span>
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageProfile;

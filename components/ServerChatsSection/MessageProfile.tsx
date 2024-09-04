import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getCookie } from "cookies-next";
import { Edit } from "lucide-react";
import React, { useContext } from "react";
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
}: {
  Message_Data: MessageProps;
  DeleteMessage: (message_id: string) => void;
  MessageSendBySender: boolean;
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
  return (
    <div
      className={`w-fit flex items-start justify-between transition-all duration-150 max-w-[550px] cursor-pointer relative group overflow-hidden ${
        MessageSendBySender ? "ml-auto " : "ml-0"
      } `}
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
          className={`message-container w-[100%] flex flex-col items-start  justify-start  rounded-md pl-[10px]  pt-[5px] overflow-hidden   relative ${
            MessageSendBySender
              ? "bg-gradient-to-r from-emerald-700 to-emerald-800"
              : "bg-gradient-to-r from-zinc-900 to-neutral-900"
          }`}
        >
          <div className="content w-[100%] flex flex-col  relative ">
            <div className="w-[100%]  cursor-pointer  relative z-[1] min-w-[75px] pr-[20px]">
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
              <div className="message w-[100%] flex items-center">
                <p
                  className={`${
                    Message_Data?.IsDeleted
                      ? "text-gray-300 italic"
                      : "text-white"
                  } global-font-roboto text-[16px] font-[300]  py-[3px] text-wrap w-[100%]`}
                >
                  {Message_Data?.IsDeleted
                    ? Message_Data?.content
                    : decryptContent(Message_Data?.content)}
                </p>
              </div>
            </div>
            <p
              className={`${
                MessageSendBySender ? "text-gray-300" : "text-gray-400"
              } text-[11px] global-font-roboto w-[100%] text-end pr-[10px] `}
            >
              {GetLocalTimeFrom_UTC(Message_Data?.createdAt as Date)}
            </p>
          </div>

          <div className="crude-operation  absolute top-[0px] right-[0px] invisible group-hover:visible z-[5] ">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`w-[25px] h-[25px] flex items-center justify-center ring-0 border-0 outline-none focus:outline-none focus:ring-0  `}
              >
                <FaCaretDown className="text-white text-[18px] " />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
  );
}

export default MessageProfile;

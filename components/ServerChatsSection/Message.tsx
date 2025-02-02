import React, { useContext } from "react";
import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";
import { FiMessageCircle } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FaCamera, FaCaretDown, FaReply } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { Edit } from "lucide-react";
import { MdDelete, MdOutlineAddReaction } from "react-icons/md";
import { MessageProps } from "@/interface/MessageProps";
import { NotificationType } from "@/enums/enums";
import Image from "next/image";
import MessageImage from "../MessageImage";
import FilePreviewStructure from "../FilePreviewStructure";
import { decryptContent, GetLocalTimeFrom_UTC } from "@/helper/HelperFunctions";

function Message({
  MessageData,
  scrollingToTheMessage,
  setScrollingToTheMessage,
  isLastInSequence,
}: {
  MessageData: MessageProps;
  scrollingToTheMessage: string;
  setScrollingToTheMessage: React.Dispatch<React.SetStateAction<string>>;
  isLastInSequence: boolean;
}) {
  const {
    DeleteMessageFunction,
    UserInformation,
    setEditingAMessage,
    setReplyingASpecificMessage,
    GlobalNotificationHandlerFunction,
  } = useContext(Context) as any;

  const DeleteMessage_With_Debounce = useDebounce(async (AuthToken: string, messageId: string) => {
    await DeleteMessageFunction(AuthToken, messageId);
  }, 350);

  const DeleteMessage = async (message_id: string) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    DeleteMessage_With_Debounce(AuthToken, message_id);
  };

  const scrollToThe_Message_Being_Replied = (message_id: string) => {
    if (!message_id) {
      return;
    }

    const Message_Replying_To = document.getElementById(message_id);

    if (!Message_Replying_To) {
      return;
    }
    setScrollingToTheMessage(message_id);
    const isVisible =
      Message_Replying_To.getBoundingClientRect().top >= 0 &&
      Message_Replying_To.getBoundingClientRect().bottom <= window.innerHeight;
    if (!isVisible) {
      Message_Replying_To.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      setScrollingToTheMessage("");
    }, 1000);
  };
  const copyMessageFunction = (message: string) => {
    navigator.clipboard.writeText(message);
    GlobalNotificationHandlerFunction({}, NotificationType.MESSAGE_SUCCESS, "Message Copied Successfully", "", 1000);
  };

  const MessageSendBySender = MessageData?.member?.user?.id === UserInformation?.id ? true : false;
  return (
    <div className="message w-[100%] rounded  transition-all duration-300">
      <div
        className={`w-fit flex items-start justify-between transition-all duration-150 max-w-[550px]  cursor-pointer relative group overflow-hidden ${
          MessageSendBySender ? "ml-auto " : "ml-0"
        } `}
        id={MessageData?.id}>
        <div className="w-[100%] relative flex items-end justify-start gap-[5px]">
          <div className="users-profile ">
            {isLastInSequence ? (
              !MessageSendBySender ? (
                <div className="profile">
                  <Avatar
                    className="w-[25px] h-[25px]  rounded-full overflow-hidden flex items-center justify-center "
                    style={{
                      backgroundColor: MessageData?.member?.user?.ProfileBgColor,
                    }}>
                    <AvatarImage src={MessageData?.member?.user?.Profile_Picture} className="w-[100%] h-[100%]" />
                    <AvatarFallback className="capitalize font-medium text-[15px] text-white">
                      {MessageData?.member?.user?.FullName.split("")[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : null
            ) : (
              <div className="w-[25px] h-[25px]"></div>
            )}
          </div>
          <div
            className={`message-container w-[100%] flex flex-col items-start  justify-start  rounded-md px-[5px]  pt-[5px] overflow-hidden transition-all duration-300  relative ${
              MessageSendBySender
                ? scrollingToTheMessage === MessageData?.id
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-600"
                  : "bg-gradient-to-r from-emerald-700 to-emerald-800"
                : scrollingToTheMessage === MessageData?.id
                ? "bg-gradient-to-r from-zinc-800 to-neutral-700"
                : "bg-gradient-to-r from-zinc-900 to-neutral-900"
            }`}>
            {/* this the div which is only visible when you are replying the message this contain the info of the message being replied */}

            <div className="content w-[100%] flex flex-col  relative ">
              <div className="w-[100%]  cursor-pointer  relative z-[1] min-w-[120px] ">
                {!MessageSendBySender ? (
                  <div className="head   flex items-center justify-start gap-[10px]">
                    <div className="username">
                      <p className="text-[#f48c25] global-font-roboto text-[14px] font-[400]">
                        {MessageData?.member?.userId === UserInformation?.id
                          ? "You"
                          : MessageData?.member?.user?.UserName}
                      </p>
                    </div>
                  </div>
                ) : null}
                {MessageData?.Is_Reply ? (
                  <div
                    className={`w-[100%] rounded px-[8px] py-[5px] mt-[3px] relative overflow-hidden mb-[5px] ${
                      MessageSendBySender
                        ? "bg-gradient-to-r from-emerald-900 to-emerald-900"
                        : "bg-gradient-to-r from-zinc-800 to-neutral-800"
                    }`}
                    onClick={() => {
                      scrollToThe_Message_Being_Replied(MessageData?.replyingMessageMessageId as string);
                    }}>
                    <span className="absolute w-[6px] h-[200%] z-[2] top-[-10px] left-[0px] rounded bg-gradient-to-r from-red-500 to-orange-500 "></span>
                    <div className="inner-section pl-[6px] flex items-center justify-between gap-[15px]">
                      <div className="flex flex-col items-start justify-start">
                        <div className="header">
                          <h5 className="username text-[#00ffe9] font-medium global-font-roboto text-[14px]">
                            {MessageData?.replyingToUser?.user?.id === UserInformation?.id
                              ? "You"
                              : MessageData?.replyingToUser?.user?.UserName}
                          </h5>
                        </div>
                        <div className="content text-gray-300 global-font-roboto text-[15px] font-[300] line-clamp-2">
                          {MessageData.replyingMessage ? (
                            <p>{decryptContent(MessageData?.replyingMessage)}</p>
                          ) : (
                            <p className="text-gray-300 global-font-roboto text-[15px] font-[300] py-[3px] flex items-center justify-start gap-[5px]">
                              <FaCamera />
                              <span>Photo</span>
                            </p>
                          )}
                        </div>
                      </div>
                      {MessageData.replyingImage !== "" ? (
                        <div className="w-[60px] h-[60px]">
                          <Image
                            src={MessageData.replyingImage}
                            alt="replying image"
                            width={60}
                            height={60}
                            className="object-cover rounded w-full h-full"></Image>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {MessageData.MessageType === "IMAGE" && MessageData.ImageUrl !== "" ? (
                  <MessageImage imageArray={JSON.parse(MessageData.ImageUrl)} />
                ) : null}
                {MessageData.MessageType === "FILE" && MessageData.FileURL !== "" ? (
                  <FilePreviewStructure
                    showUploadingLoader={false}
                    fileInformation={JSON.parse(MessageData.FileURL)}
                    MessageSendBySender={MessageSendBySender}
                  />
                ) : null}

                <div className="flex flex-nowrap items-end justify-between relative">
                  <div className="message  flex items-center">
                    <p
                      className={`${
                        MessageData?.IsDeleted ? "text-gray-300 italic" : "text-white"
                      } global-font-roboto text-[16px] font-[300]  text-wrap w-[100%] px-[4px] pb-[18px]`}>
                      {MessageData?.IsDeleted ? MessageData?.content : decryptContent(MessageData?.content)}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 right-[5px] flex items-center justify-end gap-2">
                  {MessageData?.IsEdited && !MessageData?.IsDeleted ? (
                    <p className="text-[11px] global-font-roboto text-end capitalize italic text-[#FFAA00]">edited</p>
                  ) : (
                    ""
                  )}
                  <p
                    className={`${
                      MessageSendBySender ? "text-gray-300" : "text-gray-400"
                    } text-[11px] global-font-roboto text-end`}>
                    {GetLocalTimeFrom_UTC(MessageData?.createdAt as Date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="crude-operation  absolute top-[0px] right-[0px] invisible group-hover:visible z-[5] ">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`w-[25px] h-[25px] flex items-center justify-center ring-0 border-0 outline-none focus:outline-none focus:ring-0 backdrop-blur-[5px] rounded `}>
                  <FaCaretDown className="text-white text-[18px] " />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={MessageSendBySender ? "end" : "start"}>
                  {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                  <DropdownMenuItem
                      className=" text-[rgb(255,255,255,0.9)]"
                      onClick={() => {
                        setReplyingASpecificMessage({
                          is_Replying: true,
                          data: MessageData as MessageProps,
                        });
                      }}>
                      <span className="flex items-center gap-[5px]">
                        <FaReply className="w-[18px] h-[18px]" />
                        <span className="">Reply Message</span>
                      </span>
                    </DropdownMenuItem>

                  {!MessageData?.IsDeleted && !MessageData?.FileURL ? (
                    <DropdownMenuItem
                      className=" text-[rgb(255,255,255,0.9)]"
                      onClick={() =>
                        copyMessageFunction(
                          MessageData?.IsDeleted ? MessageData?.content : decryptContent(MessageData?.content)
                        )
                      }>
                      <span className="flex items-center gap-[5px]">
                        <IoCopy className="w-[18px] h-[18px]" />
                        <span className="">Copy Message</span>
                      </span>
                    </DropdownMenuItem>
                  ) : null}
                  {MessageData?.member?.userId === UserInformation?.id && !MessageData?.IsDeleted ? (
                    <>
                      {!MessageData?.FileURL && !MessageData?.ImageUrl ? (
                        <DropdownMenuItem
                          className=" text-[rgb(255,255,255,0.9)]"
                          onClick={() => {
                            setEditingAMessage({
                              is_Editing: true,
                              data: MessageData as MessageProps,
                            });
                          }}>
                          <span className="flex items-center gap-[5px]">
                            <Edit className="w-[18px] h-[18px]" />
                            <span className="">Edit Message</span>
                          </span>
                        </DropdownMenuItem>
                      ) : null}

                      <DropdownMenuItem
                        className="text-[rgb(255,255,255,0.9)]  "
                        onClick={() => DeleteMessage(MessageData?.id)}>
                        <span className="flex items-center gap-[5px]">
                          <MdDelete className="w-[18px] h-[18px]" />
                          <span className="">Delete Message</span>
                        </span>
                      </DropdownMenuItem>
                    </>
                  ) : MessageData?.channel?.userId === UserInformation?.id && !MessageData?.IsDeleted ? (
                    <DropdownMenuItem
                      className="text-[rgb(255,255,255,0.9)] "
                      onClick={() => DeleteMessage(MessageData?.id)}>
                      <span className="flex items-center gap-[5px]">
                        <MdDelete className="w-[18px] h-[18px]" />
                        <span className="">Delete Message</span>
                      </span>
                    </DropdownMenuItem>
                  ) : null}
                  {MessageData?.member?.user?.id !== UserInformation?.id ? (
                    <DropdownMenuItem className=" text-[rgb(255,255,255,0.9)]">
                      <span className="flex items-center gap-[5px]">
                        <FiMessageCircle className="w-[18px] h-[18px]" />
                        <span className="">Message Privately</span>
                      </span>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem className=" text-[rgb(255,255,255,0.9)]">
                    <span className="flex items-center gap-[5px]">
                      <MdOutlineAddReaction className="w-[18px] h-[18px]" />
                      <span className="">Reaction</span>
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;

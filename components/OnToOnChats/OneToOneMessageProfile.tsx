import { Context } from "@/context/ContextApi";
import { decryptContent, GetLocalTimeFrom_UTC } from "@/helper/HelperFunctions";
import { ConversationMessageInterface } from "@/interface/ConversationMessageInterface";
import { User } from "@/interface/UserProps";
import { getCookie } from "cookies-next";
import React, { useContext } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FaCaretDown, FaReply } from "react-icons/fa";
import { MdDelete, MdOutlineAddReaction } from "react-icons/md";
import { Edit } from "lucide-react";
import { EditingMessagePreview, ReplyingMessagePreviewInterface } from "@/interface/HelperInterface";

function OneToOneMessageProfile({
  MessageInfo,
  DeleteMessageFromTheDatabase,
  setEditingMessagePreviewInfoHolderState,
  setReplyingMessagePreviewInfoState,
}: {
  MessageInfo: ConversationMessageInterface;
  DeleteMessageFromTheDatabase: (conversation_id: string, message_id: string) => void;
  setEditingMessagePreviewInfoHolderState: React.Dispatch<React.SetStateAction<EditingMessagePreview>>;
  setReplyingMessagePreviewInfoState: React.Dispatch<React.SetStateAction<ReplyingMessagePreviewInterface>>;
}) {
  const { UserInformation } = useContext(Context) as any;

  const User_Info: User = UserInformation
    ? UserInformation
    : getCookie("User__Info")
    ? JSON.parse(getCookie("User__Info") as string)
    : "";

  const MessageSendBySender = MessageInfo?.Sender?.id === User_Info?.id ? true : false;

  const DeleteMessageOnButtonClick = (message_id: string) => {
    DeleteMessageFromTheDatabase(MessageInfo?.ConversationId, message_id);
  };

  const handelEditMessageOnClick = () => {
    setReplyingMessagePreviewInfoState({ isReplying: false, data: {} as ConversationMessageInterface });
    setEditingMessagePreviewInfoHolderState({ isEditing: true, data: MessageInfo });
  };
  const handelReplyMessageOnClick = () => {
    setEditingMessagePreviewInfoHolderState({ isEditing: false, data: {} as ConversationMessageInterface });
    setReplyingMessagePreviewInfoState({ isReplying: true, data: MessageInfo });
  };

  return (
    <div
      className={`w-fit min-w-[130px] max-w-[520px] rounded pt-1 px-1 relative group ${
        MessageInfo?.Sender?.id === User_Info?.id
          ? "ml-auto bg-gradient-to-r from-emerald-700 to-emerald-800"
          : MessageInfo?.Receiver?.id === User_Info?.id
          ? "ml-0 bg-gradient-to-r from-zinc-900 to-neutral-900"
          : ""
      }`}>
      {MessageInfo?.IsMessageReply ? (
        <div
          className={`message-replies transition-all rounded px-[8px] py-[5px] mt-[3px] relative overflow-hidden mb-[5px]  ${
            MessageSendBySender
              ? "bg-gradient-to-r from-emerald-900 to-emerald-900"
              : "bg-gradient-to-r from-zinc-800 to-neutral-800"
          }`}>
          <span className="absolute w-[6px] h-[200%] z-[2] top-[-10px] left-[0px] rounded bg-gradient-to-r from-red-500 to-orange-500 "></span>
          <div className="inner-section pl-[6px] flex items-center justify-between gap-[15px]">
            <div className="flex flex-col items-start justify-start">
              <div className="header">
                <h5 className="username text-[#00ffe9] font-medium global-font-roboto text-[14px]">
                  {MessageInfo?.Sender?.id ? "You" : MessageInfo?.Sender?.UserName}
                </h5>
              </div>
              <div className="content text-gray-300 global-font-roboto text-[15px] font-[300] line-clamp-2">
                {MessageInfo?.replyingMessageContent ? (
                  <p>{decryptContent(MessageInfo?.replyingMessageContent)}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="content w-full relative h-full">
        <div className="w-full">
          <p
            className={`${
              MessageInfo?.IsDeleted ? "text-gray-300 italic text-sm" : "text-white base"
            } text- global-font-roboto pb-4 break-words pl-1`}>
            {MessageInfo?.IsDeleted ? MessageInfo?.content : decryptContent(MessageInfo?.content)}
          </p>
        </div>
      </div>
      <div className="message-created-date absolute bottom-0 right-[5px] flex items-center justify-end gap-2">
        {MessageInfo?.IsEdited && !MessageInfo?.IsDeleted ? (
          <p className="text-[11px] global-font-roboto text-end capitalize italic text-[#FFAA00]">edited</p>
        ) : null}
        <p
          className={`${
            MessageSendBySender ? "text-gray-300" : "text-gray-400"
          } text-[11px] global-font-roboto text-end`}>
          {GetLocalTimeFrom_UTC(MessageInfo?.createdAt as Date)}
        </p>
      </div>
      <div className="crude-operation  absolute top-[0px] right-[0px] invisible group-hover:visible z-[5]">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-[25px] h-[25px] flex items-center bg-white/[0.1] justify-center ring-0 border-0 outline-none focus:outline-none focus:ring-0 backdrop-blur-sm rounded">
            <FaCaretDown className="text-white text-[18px]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align={MessageSendBySender ? "end" : "start"}>
            <DropdownMenuItem
              className=" text-[rgb(255,255,255,0.9)] cursor-pointer"
              onClick={handelReplyMessageOnClick}>
              <span className="flex items-center gap-[5px]">
                <FaReply className="w-[18px] h-[18px]" />
                <span className="">Reply Message</span>
              </span>
            </DropdownMenuItem>
            {!MessageInfo?.IsDeleted ? (
              <>
                <DropdownMenuItem
                  className=" text-[rgb(255,255,255,0.9)] cursor-pointer"
                  onClick={handelEditMessageOnClick}>
                  <span className="flex items-center gap-[5px]">
                    <Edit className="w-[18px] h-[18px]" />
                    <span className="">Edit Message</span>
                  </span>
                </DropdownMenuItem>
                {MessageSendBySender ? (
                  <DropdownMenuItem
                    className=" text-[rgb(255,255,255,0.9)] cursor-pointer"
                    onClick={() => DeleteMessageOnButtonClick(MessageInfo?.id)}>
                    <span className="flex items-center gap-[5px]">
                      <MdDelete className="w-[18px] h-[18px]" />
                      <span className="">Delete Message</span>
                    </span>
                  </DropdownMenuItem>
                ) : null}
              </>
            ) : null}

            <DropdownMenuItem className=" text-[rgb(255,255,255,0.9)] cursor-pointer">
              <span className="flex items-center gap-[5px]">
                <MdOutlineAddReaction className="w-[18px] h-[18px]" />
                <span className="">Reaction</span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default OneToOneMessageProfile;
